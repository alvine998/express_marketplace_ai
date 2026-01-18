const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const TransactionDetail = require("../models/TransactionDetail");
const Category = require("../models/Category");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Get Admin Dashboard Summary
 * @param {Object} req
 * @param {Object} res
 */
exports.getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "user" } });
    const totalSellers = await Seller.count();
    const totalProducts = await Product.count();
    const totalTransactions = await Transaction.count();

    const totalRevenue = await Transaction.sum("totalAmount", {
      where: { status: "completed" },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalTransactions,
        totalRevenue: parseFloat(totalRevenue || 0).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error in getAdminSummary:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Get Seller Dashboard Summary
 * @param {Object} req
 * @param {Object} res
 */
exports.getSellerSummary = async (req, res) => {
  try {
    const seller = await Seller.findOne({ where: { userId: req.user.id } });
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller profile not found" });
    }

    const totalProducts = await Product.count({
      where: { sellerId: req.user.id },
    });

    // Get transactions that include products from this seller
    const transactionDetails = await TransactionDetail.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { sellerId: req.user.id },
        },
        {
          model: Transaction,
          as: "transaction",
          where: { status: "completed" },
        },
      ],
    });

    const totalOrders = transactionDetails.length;
    const totalRevenue = transactionDetails.reduce(
      (sum, detail) => sum + parseFloat(detail.price) * detail.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        rating: seller.rating,
      },
    });
  } catch (error) {
    console.error("Error in getSellerSummary:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Get Dashboard Analytics
 * @param {Object} req
 * @param {Object} res
 */
exports.getAnalytics = async (req, res) => {
  try {
    const { range = "30d" } = req.query; // Default to last 30 days
    let startDate = new Date();

    if (range === "7d") startDate.setDate(startDate.getDate() - 7);
    else if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else if (range === "90d") startDate.setDate(startDate.getDate() - 90);

    // Revenue Trend (Daily)
    const revenueTrend = await Transaction.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
      ],
      where: {
        status: "completed",
        createdAt: { [Op.gte]: startDate },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    });

    // Top Products
    const topProducts = await TransactionDetail.findAll({
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
      ],
      include: [
        { model: Product, as: "product", attributes: ["name", "price"] },
      ],
      group: ["productId", "product.id"],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      data: {
        revenueTrend,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
