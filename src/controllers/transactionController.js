const Transaction = require('../models/Transaction');
const TransactionDetail = require('../models/TransactionDetail');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const sequelize = require('../config/database');
const { logActivity } = require('../utils/loggingUtils');

exports.checkout = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress } = req.body;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: ['product'],
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.product.price * item.quantity;
      
      // Basic stock check
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for product: ${item.product.name}` });
      }
    }

    const transaction = await Transaction.create({
      userId,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: 'completed', // For this demo, we assume payment is instant
    }, { transaction: t });

    const details = cartItems.map(item => ({
      transactionId: transaction.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await TransactionDetail.bulkCreate(details, { transaction: t });

    // Update stock and clear cart
    for (const item of cartItems) {
      await item.product.update({ stock: item.product.stock - item.quantity }, { transaction: t });
    }
    await CartItem.destroy({ where: { userId }, transaction: t });

    await t.commit();
    await logActivity(req, 'CHECKOUT', { transactionId: transaction.id, totalAmount });

    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error during checkout process' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({
      where: { userId },
      include: [{ model: TransactionDetail, as: 'details', include: ['product'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: TransactionDetail, as: 'details', include: ['product'] }],
    });

    if (!transaction || transaction.userId !== req.user.id) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction details' });
  }
};
