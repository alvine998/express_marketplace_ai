const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * /api/admin/approve-seller/{sellerId}:
 *   post:
 *     summary: Approve or reject a seller request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
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
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *                 description: true to approve, false to reject
 *     responses:
 *       200:
 *         description: Seller status updated
 *       404:
 *         description: Seller not found
 */
router.post(
  "/approve-seller/:sellerId",
  auth,
  admin,
  adminController.approveSeller,
);

module.exports = router;
