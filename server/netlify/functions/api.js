require('mysql2');
try {
  require('sqlite3');
} catch (e) {}

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
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

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

  response.headers = {
    ...corsHeaders,
    ...(response.headers || {})
  };

  return response;
};
