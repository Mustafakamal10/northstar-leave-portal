/**
 * Employee Controller (Admin)
 * Handles admin leave summary, list of all requests, approvals, employee management, and password resets.
 */

const employeeService = require('../utils/employee.service');

async function getAdminSummary(req, res, next) {
  try {
    const { range } = req.query;
    const summary = await employeeService.getAdminSummary(range || 'today');
    return res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}

async function getAdminLeaves(req, res, next) {
  try {
    const { range, status, search, page, limit } = req.query;
    const result = await employeeService.getAdminLeaves({
      range: range || 'today',
      status,
      search,
      page,
      limit
    });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function updateLeaveStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminComment, comment, remarks } = req.body;
    const finalComment = adminComment || comment || remarks;
    const updated = await employeeService.updateLeaveStatus(id, req.user.id, {
      status,
      adminComment: finalComment
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

async function getEmployees(req, res, next) {
  try {
    const { page, limit, search } = req.query;
    const employees = await employeeService.getEmployees({ page, limit, search });
    return res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
}

async function createEmployee(req, res, next) {
  try {
    const { name, email, password, designation } = req.body;
    const employee = await employeeService.createEmployee({ name, email, password, designation });
    return res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const result = await employeeService.resetPassword(id, newPassword);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdminSummary,
  getAdminLeaves,
  updateLeaveStatus,
  getEmployees,
  createEmployee,
  resetPassword
};
