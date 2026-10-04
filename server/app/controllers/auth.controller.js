/**
 * Authentication Controller
 * Reads request data and delegates authentication logic to auth.service.js.
 */

const authService = require('../utils/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  me
};
