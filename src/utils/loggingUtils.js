const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, details = null) => {
  try {
    await ActivityLog.create({
      userId: req.user ? req.user.id : null,
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = { logActivity };
