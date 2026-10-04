/**
 * Leave Routes (Employee)
 * Endpoints for employees to view summary, view list of requests, view single request, and apply for leaves.
 */

const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave.controller');
const { verifyToken } = require('../middlewares/authJwt');
const { requireRole } = require('../middlewares/role');
const { ROLES } = require('../../config/constants');

// All leave routes require authentication and employee role
router.use(verifyToken, requireRole(ROLES.EMPLOYEE));

// GET /api/leaves/summary
router.get('/summary', leaveController.getSummary);

// GET /api/leaves/my
router.get('/my', leaveController.getMyLeaves);

// GET /api/leaves/:id
router.get('/:id', leaveController.getLeaveById);

// POST /api/leaves
router.post('/', leaveController.applyLeave);

module.exports = router;
