const User = require("../models/User");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
      ];
    }
    if (role) {
      whereCondition.role = role;
    }

    const data = await User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      limit: limitValue,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const response = getPagingData(data, page, limitValue);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization check: Only admin can view other users, unless viewing own profile
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, address, role, fcmTokens } = req.body;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization check: Only admin can update other users or change role
    if (req.user.role !== "admin" && (req.user.id !== id || role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If changing email, check for uniqueness
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    let finalFcmTokens = user.fcmTokens;
    if (fcmTokens && Array.isArray(fcmTokens)) {
      // 1. Internal deduplication
      finalFcmTokens = [...new Set(fcmTokens)];

      // 2. Global uniqueness: Remove these tokens from other users
      const otherUsersWithTokens = await User.findAll({
        where: {
          id: { [Op.ne]: id },
          // Using a simple search approach for cross-DB compatibility if possible,
          // but for JSON arrays in Sequelize/MySQL, we can use Op.contains or Op.and with Op.or
          // For now, let's use a robust approach: find any user where fcmTokens JSON contains any of the new tokens
          [Op.or]: finalFcmTokens.map((token) => ({
            fcmTokens: { [Op.like]: `%${token}%` },
          })),
        },
      });

      for (const otherUser of otherUsersWithTokens) {
        const updatedTokens = otherUser.fcmTokens.filter(
          (t) => !finalFcmTokens.includes(t),
        );
        if (updatedTokens.length !== otherUser.fcmTokens.length) {
          await otherUser.update({ fcmTokens: updatedTokens });
        }
      }
    }

    await user.update({
      name,
      email,
      phone,
      gender,
      address,
      fcmTokens: finalFcmTokens,
      role: req.user.role === "admin" ? role : user.role, // Only admin can change role
    });

    await logActivity(req, "UPDATE_USER", { targetUserId: id });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        fcmTokens: user.fcmTokens,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
