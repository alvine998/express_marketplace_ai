const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       201:
 *         description: Product added to wishlist
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
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Product already in wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product already in wishlist
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlisted products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440001
 *                   userId:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440002
 *                   productId:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   product:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: iPhone 15 Pro
 *                       price:
 *                         type: number
 *                         example: 15000000
 *                       imageUrl:
 *                         type: string
 *                         example: https://storage.googleapis.com/bucket/image.jpg
 *                       seller:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, wishlistController.getWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found in wishlist
 */
router.delete("/:productId", auth, wishlistController.removeFromWishlist);

module.exports = router;
