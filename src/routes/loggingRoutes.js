const express = require('express');
const router = express.Router();
const loggingController = require('../controllers/loggingController');
const auth = require('../middleware/auth');

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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/activity', auth, loggingController.getActivityLogs);

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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of login attempts
 *       401:
 *         description: Unauthorized
 */
router.get('/login-attempts', auth, loggingController.getLoginAttempts);

module.exports = router;
