const express = require("express");
const router = express.Router();
const loggingController = require("../controllers/loggingController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/logs/activity:
 *   get:
 *     summary: Get all activity logs
 *     tags: [Logs]
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
 *     responses:
 *       200:
 *         description: List of activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 150
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       userId:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440001
 *                       action:
 *                         type: string
 *                         example: USER_LOGIN
 *                       details:
 *                         type: object
 *                         example: { "email": "user@example.com" }
 *                       ipAddress:
 *                         type: string
 *                         example: 192.168.1.1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                   example: 15
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized
 */
router.get("/activity", auth, loggingController.getActivityLogs);

/**
 * @swagger
 * /api/logs/login-attempts:
 *   get:
 *     summary: Get all login attempts
 *     tags: [Logs]
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
 *     responses:
 *       200:
 *         description: List of login attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       isSuccess:
 *                         type: boolean
 *                         example: true
 *                       ipAddress:
 *                         type: string
 *                         example: 192.168.1.1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                   example: 50
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized
 */
router.get("/login-attempts", auth, loggingController.getLoginAttempts);

module.exports = router;
