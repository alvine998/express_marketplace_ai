const midtransClient = require('midtrans-client');
const NodeCache = require('node-cache');
require('dotenv').config();

// Cache for 24 hours
const myCache = new NodeCache({ stdTTL: 86400 });

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

/**
 * Static list of supported payment methods in Midtrans Snap.
 * In a real scenario, this could be fetched from Midtrans Account API if available,
 * or configured per merchant.
 */
exports.getPaymentMethods = async () => {
  const cacheKey = 'midtrans_payment_methods';
  const cachedData = myCache.get(cacheKey);
  if (cachedData) return cachedData;

  // Standard Midtrans payment methods
  const paymentMethods = [
    { id: 'credit_card', name: 'Credit Card', group: 'Cards' },
    { id: 'gopay', name: 'GoPay', group: 'E-Wallet' },
    { id: 'shopeepay', name: 'ShopeePay', group: 'E-Wallet' },
    { id: 'bank_transfer', name: 'Virtual Account (VA)', group: 'Bank Transfer', subMethods: ['bca', 'bni', 'bri', 'mandiri', 'permata'] },
    { id: 'bca_klikpay', name: 'BCA KlikPay', group: 'Direct Debit' },
    { id: 'bripay', name: 'Bripay', group: 'Direct Debit' },
    { id: 'cimb_clicks', name: 'CIMB Clicks', group: 'Direct Debit' },
    { id: 'danamon_online', name: 'Danamon Online', group: 'Direct Debit' },
    { id: 'indomaret', name: 'Indomaret', group: 'Over the Counter' },
    { id: 'alfamart', name: 'Alfamart', group: 'Over the Counter' },
    { id: 'akulaku', name: 'Akulaku', group: 'Installment' }
  ];

  myCache.set(cacheKey, paymentMethods);
  return paymentMethods;
};
