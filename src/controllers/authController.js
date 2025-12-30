const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const jwt = require('jsonwebtoken');
const { logActivity } = require('../utils/loggingUtils');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({ username, email, password });
    
    await logActivity(req, 'REGISTER_USER', { username: user.username, email: user.email });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await LoginAttempt.create({ email, ipAddress, userAgent, isSuccess: false, details: 'User not found' });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await LoginAttempt.create({ email, ipAddress, userAgent, isSuccess: false, details: 'Invalid password' });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    await LoginAttempt.create({ email, ipAddress, userAgent, isSuccess: true });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({ message: 'fcmToken is required' });
    }

    const user = await User.findByPk(userId);
    let tokens = user.fcmTokens || [];

    if (!Array.isArray(tokens)) tokens = [];

    if (!tokens.includes(fcmToken)) {
      tokens.push(fcmToken);
      await user.update({ fcmTokens: tokens });
    }

    res.status(200).json({ message: 'FCM token updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
