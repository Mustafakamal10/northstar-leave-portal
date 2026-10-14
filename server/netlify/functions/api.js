/**
 * Netlify Serverless Function Entry Point
 * Wraps the Express application using serverless-http with cached Sequelize connection
 * and comprehensive CORS handling.
 */

// Explicitly require dependencies so Netlify function bundler includes them
require('mysql2');
try {
  require('sqlite3');
} catch (e) {
  // sqlite3 is optional if MySQL is active
}

const serverless = require('serverless-http');
const app = require('../../app');
const { sequelize, initDatabase } = require('../../app/models');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
};

let isConnected = false;
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for lingering database pool connections
  context.callbackWaitsForEmptyEventLoop = false;

  // Handle CORS preflight OPTIONS request immediately
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Initialize and cache database connection on cold start
  if (!isConnected) {
    try {
      if (typeof initDatabase === 'function') {
        await initDatabase();
      } else {
        await sequelize.authenticate();
        await sequelize.sync();
      }
      isConnected = true;
    } catch (err) {
      console.error('Database connection error in Netlify function:', err.message);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({
          error: 'Database connection failed',
          message: err.message
        })
      };
    }
  }

  const response = await handler(event, context);

  // Guarantee CORS headers on all responses
  response.headers = {
    ...corsHeaders,
    ...(response.headers || {})
  };

  return response;
};
