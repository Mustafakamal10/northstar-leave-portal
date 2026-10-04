/**
 * Leave Request Service (Employee)
 * Handles leave balance calculations, leave applications, pagination, and fetching leave details.
 */

const { Op } = require('sequelize');
const { LeaveRequest, User } = require('../models');
const { TOTAL_LEAVE_DAYS, LEAVE_TYPES, LEAVE_STATUS } = require('../../config/constants');

/**
 * Calculates leave balance summary for an employee.
 */
async function getMySummary(userId) {
  const currentYear = new Date().getFullYear();
  const startOfYear = `${currentYear}-01-01`;
  const endOfYear = `${currentYear}-12-31`;

  // Calculate used days from approved leaves in current year
  const approvedLeaves = await LeaveRequest.findAll({
    where: {
      user_id: userId,
      status: LEAVE_STATUS.APPROVED,
      start_date: {
        [Op.between]: [startOfYear, endOfYear]
      }
    },
    attributes: ['total_days']
  });

  const usedDays = approvedLeaves.reduce((sum, req) => sum + (req.total_days || 0), 0);
  const remainingDays = Math.max(0, TOTAL_LEAVE_DAYS - usedDays);

  // Status counts for this user
  const pending = await LeaveRequest.count({
    where: { user_id: userId, status: LEAVE_STATUS.PENDING }
  });

  const approved = await LeaveRequest.count({
    where: { user_id: userId, status: LEAVE_STATUS.APPROVED }
  });

  const rejected = await LeaveRequest.count({
    where: { user_id: userId, status: LEAVE_STATUS.REJECTED }
  });

  // Most recent rejected leave
  const lastRejected = await LeaveRequest.findOne({
    where: { user_id: userId, status: LEAVE_STATUS.REJECTED },
    order: [['created_at', 'DESC']],
    attributes: ['created_at', 'start_date']
  });

  const lastRejectedDate = lastRejected ? (lastRejected.start_date || lastRejected.created_at) : null;

  return {
    totalDays: TOTAL_LEAVE_DAYS,
    usedDays,
    remainingDays,
    pending,
    approved,
    rejected,
    lastRejectedDate
  };
}

/**
 * Retrieves paginated list of leaves for the current employee with optional search and status filter.
 */
async function getMyLeaves(userId, { page = 1, limit = 10, search = '', status = '' }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const where = {
    user_id: userId
  };

  if (status && status !== 'all') {
    where.status = status;
  }

  if (search && search.trim() !== '') {
    const searchTerm = `%${search.trim()}%`;
    where[Op.or] = [
      { reason: { [Op.like]: searchTerm } },
      { leave_type: { [Op.like]: searchTerm } }
    ];
  }

  const { count, rows } = await LeaveRequest.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset
  });

  return {
    data: rows,
    total: count,
    totalPages: Math.ceil(count / limitNum) || 1,
    page: pageNum
  };
}

/**
 * Retrieves single leave request details (authorized for owner only).
 */
async function getLeaveById(id, userId) {
  const leave = await LeaveRequest.findByPk(id, {
    include: [
      {
        model: User,
        as: 'employee',
        attributes: ['id', 'name', 'email', 'designation']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  if (!leave) {
    const error = new Error('Leave request not found');
    error.statusCode = 404;
    throw error;
  }

  if (leave.user_id !== userId) {
    const error = new Error('Forbidden: You can only view your own leave requests');
    error.statusCode = 403;
    throw error;
  }

  return leave;
}

/**
 * Creates a new leave request for the employee.
 */
async function applyLeave(userId, { leaveType, startDate, endDate, reason }) {
  if (!leaveType || !startDate || !endDate || !reason) {
    const error = new Error('All fields are required (leaveType, startDate, endDate, reason)');
    error.statusCode = 400;
    throw error;
  }

  const validTypes = Object.values(LEAVE_TYPES);
  if (!validTypes.includes(leaveType)) {
    const error = new Error(`Invalid leave type. Allowed: ${validTypes.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    const error = new Error('Invalid date format');
    error.statusCode = 400;
    throw error;
  }

  // Check start date is not in the past (before today 00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  if (startDay < today) {
    const error = new Error('Start date cannot be in the past');
    error.statusCode = 400;
    throw error;
  }

  if (end < start) {
    const error = new Error('End date cannot be earlier than start date');
    error.statusCode = 400;
    throw error;
  }

  if (typeof reason !== 'string' || reason.trim().length < 10) {
    const error = new Error('Reason must be at least 10 characters long');
    error.statusCode = 400;
    throw error;
  }

  // Calculate inclusive total days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const newLeave = await LeaveRequest.create({
    user_id: userId,
    leave_type: leaveType,
    start_date: startDate,
    end_date: endDate,
    total_days: totalDays,
    reason: reason.trim(),
    status: LEAVE_STATUS.PENDING
  });

  return newLeave;
}

module.exports = {
  getMySummary,
  getMyLeaves,
  getLeaveById,
  applyLeave
};
