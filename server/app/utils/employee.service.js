/**
 * Employee & Admin Service
 * Handles admin leave overview, range filtering, leave approvals/rejections,
 * employee account creation, listing, and password resetting.
 */

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, LeaveRequest } = require('../models');
const { ROLES, LEAVE_STATUS } = require('../../config/constants');
const { getDateRangeFilter } = require('./dateRange');

/**
 * Helper to compute user initials.
 */
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Helper to compute formatted employee code (e.g. EMP-001).
 */
function getEmployeeCode(id) {
  return `EMP-${String(id).padStart(3, '0')}`;
}

/**
 * Admin Summary Stats:
 * - totalEmployees (unaffected by range)
 * - pending, approved, rejected (follow selected range)
 */
async function getAdminSummary(range = 'today') {
  const totalEmployees = await User.count({
    where: { role: ROLES.EMPLOYEE }
  });

  const rangeFilter = getDateRangeFilter(range);

  const pending = await LeaveRequest.count({
    where: {
      status: LEAVE_STATUS.PENDING,
      ...rangeFilter
    }
  });

  const approved = await LeaveRequest.count({
    where: {
      status: LEAVE_STATUS.APPROVED,
      ...rangeFilter
    }
  });

  const rejected = await LeaveRequest.count({
    where: {
      status: LEAVE_STATUS.REJECTED,
      ...rangeFilter
    }
  });

  return {
    totalEmployees,
    pending,
    approved,
    rejected
  };
}

/**
 * Admin Leave Requests with Range, Search, Status filter, and Pagination.
 */
async function getAdminLeaves({ range = 'today', status = '', search = '', page = 1, limit = 10 }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const rangeFilter = getDateRangeFilter(range);

  const leaveWhere = {
    ...rangeFilter
  };

  if (status && status !== 'all') {
    leaveWhere.status = status;
  }

  const userWhere = {};
  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    leaveWhere[Op.or] = [
      { reason: { [Op.like]: term } },
      { '$employee.name$': { [Op.like]: term } }
    ];
  }

  const { count, rows } = await LeaveRequest.findAndCountAll({
    where: leaveWhere,
    include: [
      {
        model: User,
        as: 'employee',
        attributes: ['id', 'name', 'email', 'designation'],
        where: userWhere,
        required: true
      },
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

  // Attach initials and employeeCode for easy frontend rendering
  const formattedData = rows.map((item) => {
    const plain = item.toJSON();
    if (plain.employee) {
      plain.employee.initials = getInitials(plain.employee.name);
      plain.employee.code = getEmployeeCode(plain.employee.id);
    }
    return plain;
  });

  return {
    data: formattedData,
    total: count,
    totalPages: Math.ceil(count / limitNum) || 1,
    page: pageNum
  };
}

/**
 * Updates status of a pending leave request (approve / reject).
 */
async function updateLeaveStatus(leaveId, adminId, { status, adminComment }) {
  if (![LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED].includes(status)) {
    const error = new Error('Invalid status. Allowed values: approved, rejected');
    error.statusCode = 400;
    throw error;
  }

  const leave = await LeaveRequest.findByPk(leaveId, {
    include: [
      {
        model: User,
        as: 'employee',
        attributes: ['id', 'name', 'email', 'designation']
      }
    ]
  });

  if (!leave) {
    const error = new Error('Leave request not found');
    error.statusCode = 404;
    throw error;
  }

  if (leave.status !== LEAVE_STATUS.PENDING) {
    const error = new Error('Only pending leave requests can be updated');
    error.statusCode = 400;
    throw error;
  }

  leave.status = status;
  leave.reviewed_by = adminId;
  leave.admin_comment = adminComment && adminComment.trim() !== '' ? adminComment.trim() : null;
  await leave.save();

  return leave;
}

/**
 * Retrieves paginated list of employees with search.
 */
async function getEmployees({ page = 1, limit = 10, search = '' }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const where = {
    role: ROLES.EMPLOYEE
  };

  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { name: { [Op.like]: term } },
      { email: { [Op.like]: term } },
      { designation: { [Op.like]: term } }
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: ['id', 'name', 'email', 'role', 'designation', 'created_at'],
    order: [['created_at', 'DESC']],
    limit: limitNum,
    offset
  });

  const formatted = rows.map((emp) => {
    const plain = emp.toJSON();
    plain.initials = getInitials(plain.name);
    plain.code = getEmployeeCode(plain.id);
    return plain;
  });

  return {
    data: formatted,
    total: count,
    totalPages: Math.ceil(count / limitNum) || 1,
    page: pageNum
  };
}

/**
 * Creates a new employee account.
 */
async function createEmployee({ name, email, password, designation }) {
  if (!name || !email || !password || !designation) {
    const error = new Error('All fields are required (name, email, password, designation)');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ where: { email: cleanEmail } });

  if (existing) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    role: ROLES.EMPLOYEE,
    designation: designation.trim()
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    designation: user.designation,
    created_at: user.created_at
  };
}

/**
 * Resets employee password (admin only).
 */
async function resetPassword(employeeId, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    const error = new Error('New password must be at least 8 characters long');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(employeeId);

  if (!user) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== ROLES.EMPLOYEE) {
    const error = new Error('Can only reset password for employee accounts');
    error.statusCode = 403;
    throw error;
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();

  return {
    message: 'Password reset successfully'
  };
}

module.exports = {
  getAdminSummary,
  getAdminLeaves,
  updateLeaveStatus,
  getEmployees,
  createEmployee,
  resetPassword,
  getInitials,
  getEmployeeCode
};
