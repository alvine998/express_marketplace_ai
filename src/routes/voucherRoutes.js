const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * tags:
 *   name: Vouchers
 *   description: API for managing discount and cashback vouchers
 */

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new voucher (Admin only)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, type, valueType, value]
 *             properties:
 *               code:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [discount, cashback]
 *               valueType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *               minTransaction:
 *                 type: number
 *               maxLimit:
 *                 type: number
 *               quota:
 *                 type: integer
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Voucher created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     type:
 *                       type: string
 *                     valueType:
 *                       type: string
 *                     value:
 *                       type: number
 *       400:
 *         description: Voucher code already exists
 */
router.post("/", auth, admin, voucherController.createVoucher);

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Get all vouchers (Admin only)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vouchers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       type:
 *                         type: string
 */
router.get("/", auth, admin, voucherController.getAllVouchers);

/**
 * @swagger
 * /api/vouchers/active:
 *   get:
 *     summary: Get available vouchers for users
 *     tags: [Vouchers]
 *     responses:
 *       200:
 *         description: List of active and non-expired vouchers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       type:
 *                         type: string
 *                       value:
 *                         type: number
 */
router.get("/active", voucherController.getActiveVouchers);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Update a voucher (Admin only)
 *     tags: [Vouchers]
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
 *         description: Voucher updated
 *       404:
 *         description: Voucher not found
 */
router.put("/:id", auth, admin, voucherController.updateVoucher);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Delete a voucher (Admin only)
 *     tags: [Vouchers]
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
 *         description: Voucher deleted
 *       404:
 *         description: Voucher not found
 */
router.delete("/:id", auth, admin, voucherController.deleteVoucher);

/**
 * @swagger
 * /api/vouchers/validate:
 *   post:
 *     summary: Validate a voucher and calculate benefits
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, transactionAmount]
 *             properties:
 *               code:
 *                 type: string
 *               transactionAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Validation result with benefit amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     voucherId:
 *                       type: string
 *                       example: "uuid-123"
 *                     code:
 *                       type: string
 *                       example: "PROMO2026"
 *                     type:
 *                       type: string
 *                       example: "discount"
 *                     benefitAmount:
 *                       type: string
 *                       example: "50000.00"
 *                     finalAmount:
 *                       type: string
 *                       example: "450000.00"
 *       400:
 *         description: Invalid transaction amount for voucher
 *       404:
 *         description: Invalid or expired voucher
 */
router.post("/validate", voucherController.validateVoucher);

module.exports = router;
