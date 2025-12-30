const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

/**
 * @swagger
 * /api/shipping/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: List of provinces
 */
router.get('/provinces', shippingController.getProvinces);

/**
 * @swagger
 * /api/shipping/cities/{provinceId}:
 *   get:
 *     summary: Get cities by province
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cities
 */
router.get('/cities/:provinceId', shippingController.getCities);

/**
 * @swagger
 * /api/shipping/cost:
 *   post:
 *     summary: Calculate shipping cost
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - weight
 *               - courier
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               weight:
 *                 type: integer
 *               courier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipping cost results
 */
router.post('/cost', shippingController.calculateCost);

module.exports = router;
