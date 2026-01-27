const express = require("express");
const router = express.Router();
const popupPromoController = require("../controllers/popupPromoController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/popup-promos:
 *   post:
 *     summary: Create a new pop-up promo
 *     tags: [Pop-up Promo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pop-up promo created successfully
 */
router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  popupPromoController.createPopupPromo,
);

/**
 * @swagger
 * /api/popup-promos:
 *   get:
 *     summary: Get all pop-up promos
 *     tags: [Pop-up Promo]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of pop-up promos
 */
router.get("/", popupPromoController.getAllPopupPromos);

/**
 * @swagger
 * /api/popup-promos/{id}:
 *   get:
 *     summary: Get pop-up promo by ID
 *     tags: [Pop-up Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pop-up promo details
 */
router.get("/:id", auth, admin, popupPromoController.getPopupPromoById);

/**
 * @swagger
 * /api/popup-promos/{id}:
 *   put:
 *     summary: Update a pop-up promo
 *     tags: [Pop-up Promo]
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
 *               message:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pop-up promo updated successfully
 */
router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  popupPromoController.updatePopupPromo,
);

/**
 * @swagger
 * /api/popup-promos/{id}:
 *   delete:
 *     summary: Delete a pop-up promo
 *     tags: [Pop-up Promo]
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
 *         description: Pop-up promo deleted successfully
 */
router.delete("/:id", auth, admin, popupPromoController.deletePopupPromo);

module.exports = router;
