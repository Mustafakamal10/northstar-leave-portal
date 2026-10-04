/**
 * Database Initialization & Model Associations
 * Initializes Sequelize instance and sets up relationships between User and LeaveRequest models.
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const dbConfig = require('../../config/db.config');

let sequelize;

if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', 'northstar_leave_db.sqlite'),
    logging: false
  });
} else {
  const sequelizeOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
    pool: dbConfig.pool
  };

  if (process.env.DB_SSL === 'true') {
    sequelizeOptions.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    };
  }

  sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, sequelizeOptions);
}

const User = require('./user')(sequelize);
const LeaveRequest = require('./leaveRequest')(sequelize);

// User hasMany LeaveRequest (as 'leaves')
User.hasMany(LeaveRequest, {
  foreignKey: 'user_id',
  as: 'leaves'
});

// LeaveRequest belongsTo User (as 'employee')
LeaveRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'employee'
});

// LeaveRequest belongsTo User (as 'reviewer')
LeaveRequest.belongsTo(User, {
  foreignKey: 'reviewed_by',
  as: 'reviewer'
});

const db = {
  Sequelize,
  sequelize,
  User,
  LeaveRequest
};

module.exports = db;
