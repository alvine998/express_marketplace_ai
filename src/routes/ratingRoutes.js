const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/ratings/product:
 *   post:
 *     summary: Submit or update a product rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent product, fast delivery!
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440002
 *                 productId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 comment:
 *                   type: string
 *                   example: Excellent product, fast delivery!
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/product", auth, ratingController.submitProductRating);

/**
 * @swagger
 * /api/ratings/product/{productId}:
 *   get:
 *     summary: Get all ratings for a product
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   example: 4.5
 *                 totalRatings:
 *                   type: integer
 *                   example: 120
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: Excellent product!
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Product not found
 */
router.get("/product/:productId", ratingController.getProductRatings);

/**
 * @swagger
 * /api/ratings/seller:
 *   post:
 *     summary: Submit or update a seller rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - rating
 *             properties:
 *               sellerId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Great seller, responsive and friendly!
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440002
 *                 sellerId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 rating:
 *                   type: integer
 *                   example: 4
 *                 comment:
 *                   type: string
 *                   example: Great seller, responsive and friendly!
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Seller not found
 */
router.post("/seller", auth, ratingController.submitSellerRating);

/**
 * @swagger
 * /api/ratings/seller/{sellerId}:
 *   get:
 *     summary: Get all ratings for a seller
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   example: 4.8
 *                 totalRatings:
 *                   type: integer
 *                   example: 85
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: Best seller in the marketplace!
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: buyer123
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Seller not found
 */
router.get("/seller/:sellerId", ratingController.getSellerRatings);

module.exports = router;
