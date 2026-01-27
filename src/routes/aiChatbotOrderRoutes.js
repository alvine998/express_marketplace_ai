const express = require("express");
const router = express.Router();
const aiChatbotOrderController = require("../controllers/aiChatbotOrderController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * /api/ai-chatbot-orders:
 *   post:
 *     summary: Create a new AI chatbot order (Seller only)
 *     tags: [AI Chatbot Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - botName
 *               - packageType
 *               - price
 *             properties:
 *               botName:
 *                 type: string
 *               description:
 *                 type: string
 *               packageType:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/", auth, aiChatbotOrderController.createOrder);

/**
 * @swagger
 * /api/ai-chatbot-orders:
 *   get:
 *     summary: Get all AI chatbot orders (Seller sees their own, Admin sees all)
 *     tags: [AI Chatbot Order]
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
 *         description: List of AI chatbot orders
 */
router.get("/", auth, aiChatbotOrderController.getOrders);

/**
 * @swagger
 * /api/ai-chatbot-orders/{id}:
 *   get:
 *     summary: Get AI chatbot order by ID
 *     tags: [AI Chatbot Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI chatbot order details
 */
router.get("/:id", auth, aiChatbotOrderController.getOrderById);

/**
 * @swagger
 * /api/ai-chatbot-orders/{id}/status:
 *   patch:
 *     summary: Update AI chatbot order status (Admin only)
 *     tags: [AI Chatbot Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, activated, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch(
  "/:id/status",
  auth,
  admin,
  aiChatbotOrderController.updateOrderStatus,
);

module.exports = router;
