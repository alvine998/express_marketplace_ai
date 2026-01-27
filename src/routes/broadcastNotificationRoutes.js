const express = require("express");
const router = express.Router();
const broadcastNotificationController = require("../controllers/broadcastNotificationController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/notifications/broadcast:
 *   post:
 *     summary: Send a push notification broadcast to all users (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               clickAction:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Broadcast sent successfully
 */
router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  broadcastNotificationController.sendBroadcast,
);

/**
 * @swagger
 * /api/notifications/broadcast/history:
 *   get:
 *     summary: Get broadcast notification history (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Broadcast history retrieved successfully
 */
router.get(
  "/history",
  auth,
  admin,
  broadcastNotificationController.getBroadcastHistory,
);

module.exports = router;
