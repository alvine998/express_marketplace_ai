const admin = require('../config/firebase');

exports.sendPushNotification = async (tokens, title, body, data = {}) => {
  if (!tokens || tokens.length === 0) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('FCM Notification sent:', response.successCount, 'successes out of', tokens.length);
    return response;
  } catch (error) {
    console.error('FCM Error:', error);
    throw error;
  }
};
