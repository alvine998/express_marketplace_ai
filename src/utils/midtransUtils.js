const midtransClient = require('midtrans-client');
require('dotenv').config();

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.createSnapTransaction = async (orderId, grossAmount, customerDetails) => {
  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction;
  } catch (error) {
    console.error('Midtrans Snap Error:', error);
    throw error;
  }
};

exports.verifyNotification = async (notificationJson) => {
  try {
    return await snap.transaction.notification(notificationJson);
  } catch (error) {
    console.error('Midtrans Notification Error:', error);
    throw error;
  }
};
