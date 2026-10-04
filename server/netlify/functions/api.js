/**
 * Netlify Serverless Function Entry Point
 * Wraps the Express application using serverless-http with cached Sequelize connection.
 */

// Explicitly require mysql2 so Netlify function bundler includes it
require('mysql2');
const serverless = require('serverless-http');
const app = require('../../app');
const { sequelize } = require('../../app/models');

let isConnected = false;
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for lingering database pool connections
  context.callbackWaitsForEmptyEventLoop = false;

  // Initialize and cache database connection on cold start
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      isConnected = true;
    } catch (err) {
      console.error('Database connection error in Netlify function:', err.message);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Database connection failed',
          message: err.message
        })
      };
    }
  }

  return await handler(event, context);
};
