/**
 * Centralized Error Handling Middleware
 * Catches unhandled errors or explicitly thrown custom errors and returns structured JSON responses.
 */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    message
  });
}

module.exports = errorHandler;
