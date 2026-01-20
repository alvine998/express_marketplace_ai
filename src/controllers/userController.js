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

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, address, role } = req.body;

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

    await user.update({
      name,
      email,
      phone,
      gender,
      address,
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
