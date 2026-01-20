const ActivityLog = require("../models/ActivityLog");
const LoginAttempt = require("../models/LoginAttempt");
const User = require("../models/User");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/paginationUtils");

exports.getActivityLogs = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const where = {};
    if (search) {
      where[Op.or] = [
        { action: { [Op.like]: `%${search}%` } },
        { details: { [Op.like]: `%${search}%` } },
        { ipAddress: { [Op.like]: `%${search}%` } },
        { "$user.username$": { [Op.like]: `%${search}%` } },
        { "$user.email$": { [Op.like]: `%${search}%` } },
        { "$user.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await ActivityLog.findAndCountAll({
      where,
      limit: l,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "name"],
        },
      ],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving activity logs" });
  }
};

exports.getLoginAttempts = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const where = {};
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { ipAddress: { [Op.like]: `%${search}%` } },
        { details: { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await LoginAttempt.findAndCountAll({
      where,
      limit: l,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving login attempts" });
  }
};
