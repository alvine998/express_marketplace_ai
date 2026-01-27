const AiChatbotOrder = require("../models/AiChatbotOrder");
const Seller = require("../models/Seller");
const { logActivity } = require("../utils/loggingUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");

exports.createOrder = async (req, res) => {
  try {
    const { botName, description, packageType, price } = req.body;
    const userId = req.user.id;

    const seller = await Seller.findOne({ where: { userId } });
    if (!seller) {
      return res
        .status(403)
        .json({ message: "Only sellers can order AI chatbots" });
    }

    const order = await AiChatbotOrder.create({
      sellerId: seller.id,
      botName,
      description,
      packageType,
      price,
      status: "pending",
    });

    await logActivity(req, "CREATE_AI_CHATBOT_ORDER", {
      orderId: order.id,
      botName: order.botName,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during AI chatbot order creation" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);
    const userId = req.user.id;
    const userRole = req.user.role;

    let where = {};
    if (userRole !== "admin") {
      const seller = await Seller.findOne({ where: { userId } });
      if (!seller) {
        return res.status(403).json({ message: "Not authorized" });
      }
      where.sellerId = seller.id;
    }

    const data = await AiChatbotOrder.findAndCountAll({
      where,
      limit: l,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: Seller, as: "seller", attributes: ["storeName"] }],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error retrieving AI chatbot orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await AiChatbotOrder.findByPk(req.params.id, {
      include: [{ model: Seller, as: "seller", attributes: ["storeName"] }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization: Admin or the Seller who owns the order
    if (req.user.role !== "admin") {
      const seller = await Seller.findOne({ where: { userId: req.user.id } });
      if (!seller || order.sellerId !== seller.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await AiChatbotOrder.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });

    await logActivity(req, "UPDATE_AI_CHATBOT_ORDER_STATUS", {
      orderId: order.id,
      status,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating order status" });
  }
};
