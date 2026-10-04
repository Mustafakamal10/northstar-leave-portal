/**
 * Date Range Helper
 * Generates Sequelize Op.between / Op.gte filter clauses for leave_requests.created_at
 * based on selected range ('today', 'week', 'month', 'all').
 */

const { Op } = require('sequelize');

function getDateRangeFilter(range = 'today') {
  const now = new Date();

  switch (range) {
    case 'today': {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return {
        created_at: {
          [Op.between]: [startOfToday, endOfToday]
        }
      };
    }
    case 'week': {
      // Last 7 days including today
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startOfWeek.setHours(0, 0, 0, 0);
      return {
        created_at: {
          [Op.gte]: startOfWeek
        }
      };
    }
    case 'month': {
      // From 1st of current month to now
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      return {
        created_at: {
          [Op.gte]: startOfMonth
        }
      };
    }
    case 'all':
    default:
      return {};
  }
}

module.exports = {
  getDateRangeFilter
};
