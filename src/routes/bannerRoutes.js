const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale
 *               targetUrl:
 *                 type: string
 *                 example: https://example.com/sale
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 title:
 *                   type: string
 *                   example: Summer Sale
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/banner.jpg
 *                 targetUrl:
 *                   type: string
 *                   example: https://example.com/sale
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Banner image is required
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, upload.single("image"), bannerController.createBanner);

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all active banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of active banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   title:
 *                     type: string
 *                     example: Summer Sale
 *                   imageUrl:
 *                     type: string
 *                     example: https://storage.googleapis.com/bucket/banner.jpg
 *                   targetUrl:
 *                     type: string
 *                     example: https://example.com/sale
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", bannerController.getAllBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Summer Sale
 *               targetUrl:
 *                 type: string
 *                 example: https://example.com/new-sale
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 title:
 *                   type: string
 *                   example: Updated Summer Sale
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/banner.jpg
 *                 targetUrl:
 *                   type: string
 *                   example: https://example.com/new-sale
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Banner not found
 */
router.put("/:id", auth, upload.single("image"), bannerController.updateBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
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
 *         description: Banner deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Banner deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Banner not found
 */
router.delete("/:id", auth, bannerController.deleteBanner);

module.exports = router;
