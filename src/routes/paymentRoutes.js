const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: 66e4fa55-fdac-4ef9-91b5-733b97d1b862
 *                 redirectUrl:
 *                   type: string
 *                   example: https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55-fdac-4ef9-91b5-733b97d1b862
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 */
router.post("/token/:transactionId", auth, paymentController.getPaymentToken);

/**
 * @swagger
 * /api/payment/notification:
 *   post:
 *     summary: Midtrans payment notification webhook
 *     tags: [Payment]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               transaction_status:
 *                 type: string
 *               fraud_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.post("/notification", paymentController.handleNotification);

/**
 * @swagger
 * /api/payment/methods:
 *   get:
 *     summary: Get available payment methods
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: bank_transfer
 *                   name:
 *                     type: string
 *                     example: Bank Transfer
 *                   icon:
 *                     type: string
 *                     example: https://example.com/icons/bank.png
 *                   enabled:
 *                     type: boolean
 *                     example: true
 */
router.get("/methods", paymentController.getPaymentMethods);

module.exports = router;
