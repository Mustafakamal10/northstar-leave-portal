const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const dbConfig = require('../../config/db.config');

const isServerless = !!(
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

const bundledSqlitePath = path.resolve(__dirname, '..', '..', 'northstar_leave_db.sqlite');
const targetSqlitePath = isServerless
  ? path.join('/tmp', 'northstar_leave_db.sqlite')
  : bundledSqlitePath;

function createSqliteSequelize() {
  if (isServerless && fs.existsSync(bundledSqlitePath) && !fs.existsSync(targetSqlitePath)) {
    try {
      fs.copyFileSync(bundledSqlitePath, targetSqlitePath);
    } catch (e) {
      console.warn('[Database] Could not copy bundled sqlite to /tmp:', e.message);
    }
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: targetSqlitePath,
    logging: false
  });
}

function createMysqlSequelize() {
  const sequelizeOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: dbConfig.pool?.max || 5,
      min: dbConfig.pool?.min || 0,
      acquire: 5000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 5000
    }
  };

  if (process.env.DB_SSL === 'true') {
    sequelizeOptions.dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: false
    };
  }

  return new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    sequelizeOptions
  );
}

function setupModelsForSequelize(seq) {
  const User = require('./user')(seq);
  const LeaveRequest = require('./leaveRequest')(seq);

  User.hasMany(LeaveRequest, {
    foreignKey: 'user_id',
    as: 'leaves'
  });

  LeaveRequest.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'employee'
  });

  LeaveRequest.belongsTo(User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer'
  });

  return { User, LeaveRequest };
}

let activeSequelize = dbConfig.dialect === 'sqlite'
  ? createSqliteSequelize()
  : createMysqlSequelize();

setupModelsForSequelize(activeSequelize);

async function seedDefaultDataIfNeeded(seq) {
  try {
    const UserModel = seq.models.User;
    const LeaveModel = seq.models.LeaveRequest;
    if (!UserModel) return;

    const count = await UserModel.count();
    if (count === 0) {
      const adminHash = bcrypt.hashSync('Admin@123', 10);
      const empHash = bcrypt.hashSync('Employee@123', 10);
      const now = new Date();

      const emily = await UserModel.create({
        name: 'Emily Turner',
        email: 'emily@northstar.com',
        password: adminHash,
        role: 'admin',
        designation: 'HR Administrator'
      });

      const mustafa = await UserModel.create({
        name: 'Mustafa Kamal',
        email: 'mustafa@northstar.com',
        password: empHash,
        role: 'employee',
        designation: 'Senior Software Engineer'
      });

      const abbas = await UserModel.create({
        name: 'Abbas Khan',
        email: 'abbas@northstar.com',
        password: empHash,
        role: 'employee',
        designation: 'Junior Developer'
      });

      if (LeaveModel) {
        const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dayAfter = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        await LeaveModel.create({
          user_id: abbas.id,
          leave_type: 'sick',
          start_date: tomorrow,
          end_date: dayAfter,
          total_days: 2,
          reason: 'Seasonal flu and rest advised by physician',
          status: 'pending'
        });
      }
    }
  } catch (err) {
    console.warn('[Database] Auto-seeding warning:', err.message);
  }
}

let isInitialized = false;

async function initDatabase() {
  if (isInitialized) {
    return activeSequelize;
  }

  if (dbConfig.dialect === 'mysql') {
    try {
      await activeSequelize.authenticate();
      await activeSequelize.sync();
      await seedDefaultDataIfNeeded(activeSequelize);
      isInitialized = true;
      return activeSequelize;
    } catch (mysqlErr) {
      console.warn(`[Database] MySQL connection failed (${mysqlErr.message}). Falling back to SQLite.`);
    }
  }

  const sqliteInstance = createSqliteSequelize();
  setupModelsForSequelize(sqliteInstance);
  activeSequelize = sqliteInstance;

  await activeSequelize.authenticate();
  await activeSequelize.sync();
  await seedDefaultDataIfNeeded(activeSequelize);
  isInitialized = true;
  return activeSequelize;
}

function createModelProxy(modelName) {
  const getModel = () => activeSequelize.models[modelName];
  return new Proxy(function() {}, {
    get(target, prop) {
      const model = getModel();
      if (!model) return undefined;
      const val = model[prop];
      return typeof val === 'function' ? val.bind(model) : val;
    },
    construct(target, args) {
      const Model = getModel();
      return new Model(...args);
    },
    apply(target, thisArg, args) {
      const model = getModel();
      return model.apply(thisArg, args);
    }
  });
}

const UserProxy = createModelProxy('User');
const LeaveRequestProxy = createModelProxy('LeaveRequest');

const sequelizeProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === 'authenticate') {
      return async () => initDatabase();
    }
    if (prop === 'sync') {
      return async (...args) => {
        if (!isInitialized) await initDatabase();
        return activeSequelize.sync(...args);
      };
    }
    const val = activeSequelize[prop];
    return typeof val === 'function' ? val.bind(activeSequelize) : val;
  }
});

const db = {
  Sequelize,
  sequelize: sequelizeProxy,
  initDatabase,
  User: UserProxy,
  LeaveRequest: LeaveRequestProxy
};

module.exports = db;
