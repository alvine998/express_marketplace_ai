const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/transactions/checkout:
 *   post:
 *     summary: Checkout items from cart and create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 example: bank_transfer
 *               shippingAddress:
 *                 type: string
 *                 example: Jl. Sudirman No. 123, Jakarta
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 totalAmount:
 *                   type: number
 *                   example: 30000000
 *                 paymentMethod:
 *                   type: string
 *                   example: bank_transfer
 *                 status:
 *                   type: string
 *                   example: pending
 *                 shippingAddress:
 *                   type: string
 *                   example: Jl. Sudirman No. 123, Jakarta
 *                 paymentUrl:
 *                   type: string
 *                   example: https://app.sandbox.midtrans.com/snap/v2/...
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart is empty
 *       401:
 *         description: Unauthorized
 */
router.post("/checkout", auth, transactionController.checkout);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get user transaction history
 *     tags: [Transactions]
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (pending, paid, shipped, completed, cancelled)
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 25
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       totalAmount:
 *                         type: number
 *                         example: 30000000
 *                       paymentMethod:
 *                         type: string
 *                         example: bank_transfer
 *                       status:
 *                         type: string
 *                         example: completed
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, transactionController.getTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction details by ID
 *     tags: [Transactions]
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
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 totalAmount:
 *                   type: number
 *                   example: 30000000
 *                 paymentMethod:
 *                   type: string
 *                   example: bank_transfer
 *                 status:
 *                   type: string
 *                   example: completed
 *                 shippingAddress:
 *                   type: string
 *                   example: Jl. Sudirman No. 123, Jakarta
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 15000000
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: iPhone 15 Pro
 *                           imageUrl:
 *                             type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
router.get("/:id", auth, transactionController.getTransactionById);

module.exports = router;
