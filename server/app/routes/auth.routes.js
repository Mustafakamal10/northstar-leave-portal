/**
 * Authentication Routes
 * Handles user login and authenticated profile verification.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authJwt');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', verifyToken, authController.me);

module.exports = router;
