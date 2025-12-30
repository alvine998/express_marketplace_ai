const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

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
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/send', auth, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/rooms:
 *   get:
 *     summary: Get user conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat rooms
 */
router.get('/rooms', auth, chatController.getRooms);

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
 */
router.get('/messages/:roomId', auth, chatController.getMessages);

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
 *         description: Updated status
 */
router.patch('/read/:roomId', auth, chatController.markAsRead);

module.exports = router;
