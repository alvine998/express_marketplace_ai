const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 */
router.post('/product', auth, ratingController.submitProductRating);

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
 */
router.get('/product/:productId', ratingController.getProductRatings);

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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 */
router.post('/seller', auth, ratingController.submitSellerRating);

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
 */
router.get('/seller/:sellerId', ratingController.getSellerRatings);

module.exports = router;
