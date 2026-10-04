/**
 * Application Constants
 * Defines core application constants including leave day entitlements, user roles,
 * leave categories, request status options, and supported date filter ranges.
 */

const TOTAL_LEAVE_DAYS = 24;

const ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin'
};

const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal'
};

const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  ALL: 'all'
};

module.exports = {
  TOTAL_LEAVE_DAYS,
  ROLES,
  LEAVE_TYPES,
  LEAVE_STATUS,
  DATE_RANGES
};
