const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin only.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin role' });
  }
};

module.exports = admin;
