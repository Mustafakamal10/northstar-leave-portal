/**
 * JWT Authentication Middleware
 * Validates the Bearer token in the Authorization header and attaches req.user.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    const secret = process.env.JWT_SECRET || 'northstar_jwt_super_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'designation']
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}

module.exports = {
  verifyToken
};
