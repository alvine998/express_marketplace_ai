const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { sendPushNotification } = require("../utils/fcmUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    if (senderId === recipientId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Find or create chat room
    let room = await ChatRoom.findOne({
      where: {
        [Op.or]: [
          { participant1Id: senderId, participant2Id: recipientId },
          { participant1Id: recipientId, participant2Id: senderId },
        ],
      },
    });

    if (!room) {
      room = await ChatRoom.create({
        participant1Id: senderId,
        participant2Id: recipientId,
      });
    }

    // Save message
    const chatMessage = await ChatMessage.create({
      chatRoomId: room.id,
      senderId,
      message,
    });

    // Update room metadata
    await room.update({
      lastMessage: message,
      lastMessageAt: new Date(),
    });

    // Notify recipient
    const recipient = await User.findByPk(recipientId);
    if (recipient && recipient.fcmTokens && recipient.fcmTokens.length > 0) {
      try {
        await sendPushNotification(
          recipient.fcmTokens,
          "New Message",
          message.length > 50 ? message.substring(0, 47) + "..." : message,
          { roomId: room.id, senderId: senderId.toString() },
        );
      } catch (fcmError) {
        console.error("Failed to send push notification:", fcmError.message);
      }
    }

    await logActivity(req, "SEND_CHAT_MESSAGE", {
      roomId: room.id,
      recipientId,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const { page, limit, userId } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    // Default to current user's ID
    let targetUserId = req.user.id;

    // If admin provides a userId in query, use that instead
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;
    }

    const data = await ChatRoom.findAndCountAll({
      where: {
        [Op.or]: [
          { participant1Id: targetUserId },
          { participant2Id: targetUserId },
        ],
      },
      limit: l,
      offset,
      include: [
        {
          model: User,
          as: "participant1",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "participant2",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["lastMessageAt", "DESC"]],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat rooms" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await ChatRoom.findByPk(roomId);
    if (
      !room ||
      (room.participant1Id !== userId && room.participant2Id !== userId)
    ) {
      return res
        .status(404)
        .json({ message: "Room not found or access denied" });
    }

    const messages = await ChatMessage.findAll({
      where: { chatRoomId: roomId },
      order: [["createdAt", "ASC"]],
      include: [{ model: User, as: "sender", attributes: ["id", "username"] }],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    await ChatMessage.update(
      { isRead: true },
      {
        where: {
          chatRoomId: roomId,
          senderId: { [Op.ne]: userId },
          isRead: false,
        },
      },
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking messages as read" });
  }
};
