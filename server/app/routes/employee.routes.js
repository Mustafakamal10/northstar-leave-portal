/**
 * Admin & Employee Management Routes
 * Endpoints for HR administrators to manage leave requests and employee accounts.
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { requireRole } = require('../middlewares/role');
const { ROLES } = require('../../config/constants');

// All admin routes require authentication and admin role
router.use(verifyToken, requireRole(ROLES.ADMIN));

// Leave Management
router.get('/summary', employeeController.getAdminSummary);
router.get('/leaves', employeeController.getAdminLeaves);
router.patch('/leaves/:id/status', employeeController.updateLeaveStatus);

// Employee Management
router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeController.createEmployee);
router.patch('/employees/:id/password', employeeController.resetPassword);

module.exports = router;
