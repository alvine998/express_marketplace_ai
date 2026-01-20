const Notification = require("../models/Notification");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");

exports.getNotifications = async (req, res) => {
  try {
    const { page, limit, userId, isRead } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    // Default to current user's ID
    let targetUserId = req.user.id;

    // If admin provides a userId in query, use that instead
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;
    }

    const whereCondition = { userId: targetUserId };

    if (isRead !== undefined) {
      whereCondition.isRead = isRead === "true";
    }

    const data = await Notification.findAndCountAll({
      where: whereCondition,
      limit: l,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ isRead: true });

    await logActivity(req, "MARK_NOTIFICATION_READ", {
      notificationId: req.params.id,
    });

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    await logActivity(req, "DELETE_NOTIFICATION", {
      notificationId: req.params.id,
    });

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};
