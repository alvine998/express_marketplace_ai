const { Op } = require("sequelize");
const User = require("../models/User");
const BroadcastNotification = require("../models/BroadcastNotification");
const { sendPushNotification } = require("../utils/fcmUtils");
const { uploadImageToFirebase } = require("../utils/firebaseUtils");
const { logActivity } = require("../utils/loggingUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");

exports.sendBroadcast = async (req, res) => {
  try {
    const { title, body, clickAction } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    // Fetch all users with FCM tokens
    const users = await User.findAll({
      attributes: ["fcmTokens"],
      where: {
        fcmTokens: {
          [Op.ne]: null,
          [Op.ne]: [],
        },
      },
    });

    let allTokens = [];
    users.forEach((user) => {
      if (Array.isArray(user.fcmTokens)) {
        allTokens = allTokens.concat(user.fcmTokens);
      }
    });

    if (allTokens.length === 0) {
      return res
        .status(400)
        .json({ message: "No users with FCM tokens found" });
    }

    // Send broadcast
    const fcmData = {
      clickAction: clickAction || "",
      imageUrl: imageUrl || "",
    };

    const response = await sendPushNotification(
      allTokens,
      title,
      body,
      fcmData,
    );

    // Save to broadcast history
    const broadcast = await BroadcastNotification.create({
      title,
      body,
      targetAudience: `ALL_USERS (${allTokens.length})`,
      clickAction,
      imageUrl,
      sentAt: new Date(),
      successCount: response.successCount || 0,
      failureCount: response.failureCount || 0,
    });

    await logActivity(req, "SEND_PUSH_BROADCAST", {
      broadcastId: broadcast.id,
      title: broadcast.title,
    });

    res.status(200).json({
      message: "Broadcast sent successfully",
      broadcast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during push broadcast" });
  }
};

exports.getBroadcastHistory = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await BroadcastNotification.findAndCountAll({
      limit: l,
      offset: offset,
      order: [["sentAt", "DESC"]],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error retrieving broadcast history" });
  }
};
