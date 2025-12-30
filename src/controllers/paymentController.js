const midtrans = require('../utils/midtransUtils');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.getPaymentToken = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findByPk(transactionId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!transaction || transaction.userId !== req.user.id) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const customerDetails = {
      first_name: transaction.user.username,
      email: transaction.user.email,
    };

    const snapResponse = await midtrans.createSnapTransaction(
      transaction.id,
      Math.round(transaction.totalAmount),
      customerDetails
    );

    res.status(200).json(snapResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment token' });
  }
};

exports.handleNotification = async (req, res) => {
  try {
    const notification = await midtrans.verifyNotification(req.body);
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    const transaction = await Transaction.findByPk(orderId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        await transaction.update({ status: 'completed' });
      }
    } else if (transactionStatus === 'settlement') {
      await transaction.update({ status: 'completed' });
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      await transaction.update({ status: 'cancelled' });
    } else if (transactionStatus === 'pending') {
      await transaction.update({ status: 'pending' });
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error handling payment notification' });
  }
};
