const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message to another user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - message
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               message:
 *                 type: string
 *                 example: Hello, is this item still available?
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 roomId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440002
 *                 senderId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440003
 *                 message:
 *                   type: string
 *                   example: Hello, is this item still available?
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post("/send", auth, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/rooms:
 *   get:
 *     summary: Get user conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID (Admin only)
 *     responses:
 *       200:
 *         description: List of chat rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   participant:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                   lastMessage:
 *                     type: string
 *                     example: Hello, is this item still available?
 *                   unreadCount:
 *                     type: integer
 *                     example: 3
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/rooms", auth, chatController.getRooms);

/**
 * @swagger
 * /api/chat/messages/{roomId}:
 *   get:
 *     summary: Get message history for a room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   senderId:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440001
 *                   message:
 *                     type: string
 *                     example: Hello, is this item still available?
 *                   isRead:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.get("/messages/:roomId", auth, chatController.getMessages);

/**
 * @swagger
 * /api/chat/read/{roomId}:
 *   patch:
 *     summary: Mark messages in a room as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Messages marked as read
 *                 updatedCount:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.patch("/read/:roomId", auth, chatController.markAsRead);

module.exports = router;
