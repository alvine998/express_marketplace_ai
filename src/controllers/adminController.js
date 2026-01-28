const Seller = require("../models/Seller");
const User = require("../models/User");
const { sendPushNotification } = require("../utils/fcmUtils");
const { logActivity } = require("../utils/loggingUtils");

exports.approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { isApproved } = req.body; // true = approve, false = reject

    const seller = await Seller.findByPk(sellerId, {
      include: [{ model: User, as: "user" }],
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const status = isApproved ? "approved" : "rejected";
    const isVerified = isApproved;

    await seller.update({ status, isVerified });

    // Send Push Notification
    if (seller.user && seller.user.fcmToken) {
      const title = isApproved
        ? "Seller Request Approved"
        : "Seller Request Rejected";
      const body = isApproved
        ? "Congratulations! Your seller account has been approved. You can now start selling."
        : "Your seller account request has been rejected. Please contact support for more details.";

      await sendPushNotification(seller.user.fcmToken, {
        title,
        body,
        data: { type: "seller_approval", status },
      });
    }

    await logActivity(req, "APPROVE_SELLER", { sellerId, status });

    res.status(200).json({
      message: `Seller request ${status}`,
      seller: {
        id: seller.id,
        status: seller.status,
        isVerified: seller.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error processing seller approval" });
  }
};
