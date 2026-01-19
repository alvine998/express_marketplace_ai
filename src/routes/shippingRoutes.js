const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

/**
 * @swagger
 * /api/shipping/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: List of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   province_id:
 *                     type: string
 *                     example: "11"
 *                   province:
 *                     type: string
 *                     example: DKI Jakarta
 */
router.get("/provinces", shippingController.getProvinces);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city_id:
 *                     type: string
 *                     example: "151"
 *                   province_id:
 *                     type: string
 *                     example: "11"
 *                   province:
 *                     type: string
 *                     example: DKI Jakarta
 *                   type:
 *                     type: string
 *                     example: Kota
 *                   city_name:
 *                     type: string
 *                     example: Jakarta Selatan
 *                   postal_code:
 *                     type: string
 *                     example: "12230"
 */
router.get("/cities/:provinceId", shippingController.getCities);

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
 *                 example: "151"
 *               destination:
 *                 type: string
 *                 example: "444"
 *               weight:
 *                 type: integer
 *                 example: 1000
 *               courier:
 *                 type: string
 *                 example: jne
 *     responses:
 *       200:
 *         description: Shipping cost results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 origin:
 *                   type: object
 *                   properties:
 *                     city_id:
 *                       type: string
 *                     city_name:
 *                       type: string
 *                       example: Jakarta Selatan
 *                 destination:
 *                   type: object
 *                   properties:
 *                     city_id:
 *                       type: string
 *                     city_name:
 *                       type: string
 *                       example: Surabaya
 *                 costs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service:
 *                         type: string
 *                         example: REG
 *                       description:
 *                         type: string
 *                         example: Regular
 *                       cost:
 *                         type: integer
 *                         example: 18000
 *                       etd:
 *                         type: string
 *                         example: 2-3 days
 */
router.post("/cost", shippingController.calculateCost);

module.exports = router;
