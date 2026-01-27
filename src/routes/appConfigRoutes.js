const express = require("express");
const router = express.Router();
const appConfigController = require("../controllers/appConfigController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * /api/app-config/{key}:
 *   get:
 *     summary: Get app configuration by key (e.g., about_us)
 *     tags: [App Config]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration data
 */
router.get("/:key", appConfigController.getAppConfig);

/**
 * @swagger
 * /api/app-config:
 *   post:
 *     summary: Create or update app configuration (Admin only)
 *     tags: [App Config]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configuration updated
 */
router.post("/", auth, admin, appConfigController.updateAppConfig);

module.exports = router;
