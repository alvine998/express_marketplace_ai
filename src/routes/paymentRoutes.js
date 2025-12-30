const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/payment/token/{transactionId}:
 *   post:
 *     summary: Get Midtrans Snap token for a transaction
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Snap token and redirect URL
 */
router.post('/token/:transactionId', auth, paymentController.getPaymentToken);

/**
 * @swagger
 * /api/payment/notification:
 *   post:
 *     summary: Midtrans payment notification webhook
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/notification', paymentController.handleNotification);

/**
 * @swagger
 * /api/payment/methods:
 *   get:
 *     summary: Get available payment methods
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: List of payment methods
 */
router.get('/methods', paymentController.getPaymentMethods);

module.exports = router;
