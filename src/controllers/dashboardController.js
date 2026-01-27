const { Op, fn, col } = require("sequelize");
const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalSellers = await Seller.count();
    const totalProducts = await Product.count();

    const completedTransactions = await Transaction.findAll({
      where: { status: "completed" },
    });

    const totalTransactions = completedTransactions.length;
    const totalRevenue = completedTransactions.reduce(
      (acc, curr) => acc + parseFloat(curr.totalAmount),
      0,
    );

    // Monthly Sales Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Transaction.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y-%m-01"), "month"],
        [fn("SUM", col("totalAmount")), "totalAmount"],
      ],
      where: {
        status: "completed",
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [fn("DATE_FORMAT", col("createdAt"), "%Y-%m-01")],
      order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m-01"), "ASC"]],
    });

    // Recent Transactions
    const recentTransactions = await Transaction.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    });

    res.status(200).json({
      summary: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalTransactions,
        totalRevenue,
      },
      monthlySales,
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error retrieving dashboard stats" });
  }
};
