const Transaction = require("../models/Transaction");
const TransactionDetail = require("../models/TransactionDetail");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Voucher = require("../models/Voucher");
const sequelize = require("../config/database");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");

exports.checkout = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress, shippingCost = 0 } = req.body;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: ["product"],
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsTotal = 0;
    for (const item of cartItems) {
      itemsTotal += item.product.price * item.quantity;

      // Basic stock check
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.product.name}`,
        });
      }
    }

    const totalAmountBeforeDiscount =
      parseFloat(itemsTotal) + parseFloat(shippingCost);
    let finalTotalAmount = totalAmountBeforeDiscount;
    let discountAmount = 0;
    let usedVoucher = null;

    if (req.body.voucherCode) {
      const voucher = await Voucher.findOne({
        where: { code: req.body.voucherCode, isActive: true },
        transaction: t, // Lock if needed, or just read
      });

      if (!voucher) {
        await t.rollback();
        return res
          .status(404)
          .json({ message: "Voucher not found or inactive" });
      }

      // Validate Expiry
      if (voucher.expiryDate && new Date() > new Date(voucher.expiryDate)) {
        await t.rollback();
        return res.status(400).json({ message: "Voucher has expired" });
      }

      // Validate Quota
      if (voucher.quota !== -1 && voucher.quota <= 0) {
        await t.rollback();
        return res.status(400).json({ message: "Voucher is out of stock" });
      }

      // Validate Min Transaction
      if (itemsTotal < voucher.minTransaction) {
        await t.rollback();
        return res.status(400).json({
          message: `Minimum transaction of ${voucher.minTransaction} required`,
        });
      }

      // Calculate Discount
      if (voucher.valueType === "percentage") {
        let discount = (itemsTotal * voucher.value) / 100;
        if (voucher.maxLimit) {
          discount = Math.min(discount, voucher.maxLimit);
        }
        discountAmount = discount;
      } else {
        discountAmount = voucher.value;
      }

      // Ensure discount doesn't exceed total
      discountAmount = Math.min(discountAmount, totalAmountBeforeDiscount);
      finalTotalAmount = totalAmountBeforeDiscount - discountAmount;
      usedVoucher = voucher;
    }

    const transaction = await Transaction.create(
      {
        userId,
        totalAmount: finalTotalAmount,
        shippingCost,
        paymentMethod,
        shippingAddress,
        status: "pending",
        voucherCode: usedVoucher ? usedVoucher.code : null,
        discountAmount: discountAmount,
      },
      { transaction: t },
    );

    const details = cartItems.map((item) => ({
      transactionId: transaction.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await TransactionDetail.bulkCreate(details, { transaction: t });

    // Update stock and clear cart
    for (const item of cartItems) {
      await item.product.update(
        { stock: item.product.stock - item.quantity },
        { transaction: t },
      );
    }

    // Decrement Voucher Quota
    if (usedVoucher && usedVoucher.quota !== -1) {
      await usedVoucher.decrement("quota", { transaction: t });
    }

    await CartItem.destroy({ where: { userId }, transaction: t });

    await t.commit();
    await logActivity(req, "CHECKOUT", {
      transactionId: transaction.id,
      totalAmount: finalTotalAmount,
      voucherCode: usedVoucher ? usedVoucher.code : null,
    });

    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Error during checkout process" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page, limit, userId, status } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    // Default to current user's ID
    let targetUserId = req.user.id;

    // If admin provides a userId in query, use that instead
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;
    }

    const whereCondition = { userId: targetUserId };

    if (status) {
      whereCondition.status = status;
    }

    const data = await Transaction.findAndCountAll({
      where: whereCondition,
      limit: l,
      offset,
      include: [
        { model: TransactionDetail, as: "details", include: ["product"] },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transaction history" });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: TransactionDetail, as: "details", include: ["product"] },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Authorization check: Only admin can view other users' transactions
    if (req.user.role !== "admin" && transaction.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transaction details" });
  }
};
