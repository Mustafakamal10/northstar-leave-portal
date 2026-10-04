/**
 * Server Entry Point
 * Authenticates database connection and starts the Express HTTP server.
 */

require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./app/models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    // Sync models with database in development if needed
    await sequelize.sync();
    console.log('✓ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`✓ Northstar Leave Portal Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

startServer();
