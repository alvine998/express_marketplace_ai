const ActivityLog = require('../models/ActivityLog');
const LoginAttempt = require('../models/LoginAttempt');
const { getPagination, getPagingData } = require('../utils/paginationUtils');

exports.getActivityLogs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await ActivityLog.findAndCountAll({
      limit: l,
      offset,
      order: [['createdAt', 'DESC']],
      include: ['user'],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving activity logs' });
  }
};

exports.getLoginAttempts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await LoginAttempt.findAndCountAll({
      limit: l,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving login attempts' });
  }
};
