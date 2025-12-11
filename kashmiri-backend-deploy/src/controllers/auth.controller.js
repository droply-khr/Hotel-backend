const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const signToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username || !password || !email || !role) return res.status(400).json({ success: false, message: 'Missing fields' });

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ success: false, message: 'Username already taken' });

    const user = await User.create({ username, password, email, role });
    const token = signToken(user);
    res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Missing fields' });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
