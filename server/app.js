/**
 * Express Application Setup
 * Configures middleware, API routes, and global error handling.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./app/routes/auth.routes');
const leaveRoutes = require('./app/routes/leave.routes');
const employeeRoutes = require('./app/routes/employee.routes');
const errorHandler = require('./app/middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/admin', employeeRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
