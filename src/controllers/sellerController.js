const Seller = require("../models/Seller");
const User = require("../models/User");
const { Op } = require("sequelize");
const { uploadImageToFirebase } = require("../utils/firebaseUtils");
const { logActivity } = require("../utils/loggingUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");

// Get all sellers with pagination and search
exports.getAllSellers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isVerified, isOfficial } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const whereCondition = {};

    if (search) {
      whereCondition.storeName = { [Op.like]: `%${search}%` };
    }
    if (isVerified !== undefined) {
      whereCondition.isVerified = isVerified === "true";
    }
    if (isOfficial !== undefined) {
      whereCondition.isOfficial = isOfficial === "true";
    }

    const data = await Seller.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      limit: limitValue,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const response = getPagingData(data, page, limitValue);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching sellers" });
  }
};

exports.becomeSeller = async (req, res) => {
  try {
    const { storeName, description, address, userId } = req.body;

    // Default to current user's ID
    let targetUserId = req.user.id;

    // If admin provides a userId in body, use that instead
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;

      // Validate that the target user exists
      const targetUser = await User.findByPk(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "Target user not found" });
      }
    }

    let seller = await Seller.findOne({ where: { userId: targetUserId } });
    if (seller) {
      return res.status(400).json({ message: "User is already a seller" });
    }

    const existingStore = await Seller.findOne({ where: { storeName } });
    if (existingStore) {
      return res.status(400).json({ message: "Store name is already taken" });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(req.file);
    }

    seller = await Seller.create({
      userId: targetUserId,
      storeName,
      description,
      address,
      logoUrl,
    });

    await logActivity(req, "REGISTER_SELLER", { storeName: seller.storeName });

    res.status(201).json(seller);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during seller registration" });
  }
};

exports.getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { storeName, description, address } = req.body;
    const userId = req.user.id;

    let seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    if (storeName && storeName !== seller.storeName) {
      const existingStore = await Seller.findOne({ where: { storeName } });
      if (existingStore) {
        return res.status(400).json({ message: "Store name already taken" });
      }
    }

    let logoUrl = seller.logoUrl;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(req.file);
    }

    await seller.update({
      storeName,
      description,
      address,
      logoUrl,
    });

    await logActivity(req, "UPDATE_SELLER_PROFILE", {
      storeName: seller.storeName,
    });

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating seller profile" });
  }
};

exports.adminVerifySeller = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await seller.update({ isVerified: true });
    await logActivity(req, "ADMIN_VERIFY_SELLER", { sellerId: seller.id });

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Error verifying seller" });
  }
};

exports.adminToggleOfficial = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await seller.update({ isOfficial: !seller.isOfficial });
    await logActivity(req, "ADMIN_TOGGLE_OFFICIAL_SELLER", {
      sellerId: seller.id,
      isOfficial: seller.isOfficial,
    });

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Error toggling official status" });
  }
};
