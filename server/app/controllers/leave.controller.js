/**
 * Leave Controller (Employee)
 * Handles leave summary, history, details, and application requests.
 */

const leaveService = require('../utils/leave.service');

async function getSummary(req, res, next) {
  try {
    const summary = await leaveService.getMySummary(req.user.id);
    return res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}

async function getMyLeaves(req, res, next) {
  try {
    const { page, limit, search, status } = req.query;
    const leaves = await leaveService.getMyLeaves(req.user.id, { page, limit, search, status });
    return res.status(200).json(leaves);
  } catch (err) {
    next(err);
  }
}

async function getLeaveById(req, res, next) {
  try {
    const { id } = req.params;
    const leave = await leaveService.getLeaveById(id, req.user.id);
    return res.status(200).json(leave);
  } catch (err) {
    next(err);
  }
}

async function applyLeave(req, res, next) {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await leaveService.applyLeave(req.user.id, { leaveType, startDate, endDate, reason });
    return res.status(201).json(leave);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummary,
  getMyLeaves,
  getLeaveById,
  applyLeave
};
