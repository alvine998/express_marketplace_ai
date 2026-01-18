const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard and Analytical APIs
 */

/**
 * @swagger
 * /api/dashboard/admin/summary:
 *   get:
 *     summary: Get administrative dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin summary data
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
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                     totalSellers:
 *                       type: integer
 *                       example: 25
 *                     totalProducts:
 *                       type: integer
 *                       example: 450
 *                     totalTransactions:
 *                       type: integer
 *                       example: 1200
 *                     totalRevenue:
 *                       type: string
 *                       example: "150000000.00"
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/admin/summary", auth, admin, dashboardController.getAdminSummary);

/**
 * @swagger
 * /api/dashboard/seller/summary:
 *   get:
 *     summary: Get seller dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller summary data
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
 *                     totalProducts:
 *                       type: integer
 *                       example: 15
 *                     totalOrders:
 *                       type: integer
 *                       example: 85
 *                     totalRevenue:
 *                       type: string
 *                       example: "12500000.00"
 *                     rating:
 *                       type: number
 *                       example: 4.8
 *       404:
 *         description: Seller profile not found
 */
router.get("/seller/summary", auth, dashboardController.getSellerSummary);

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get dashboard analytics and trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Date range for analytics
 *     responses:
 *       200:
 *         description: Analytical data and trends
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
 *                     revenueTrend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: "2026-01-01"
 *                           revenue:
 *                             type: number
 *                             example: 500000
 *                     topProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "uuid-123"
 *                           totalSold:
 *                             type: integer
 *                             example: 50
 *                           product:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "iPhone 15 Pro"
 *                               price:
 *                                 type: number
 *                                 example: 15000000
 */
router.get("/analytics", auth, dashboardController.getAnalytics);

module.exports = router;
