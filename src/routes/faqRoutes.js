const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of FAQs
 */
router.get("/", faqController.getAllFaqs);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ (Admin only)
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: FAQ created
 */
router.post("/", auth, admin, faqController.createFaq);

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an FAQ (Admin only)
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated
 */
router.put("/:id", auth, admin, faqController.updateFaq);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete an FAQ (Admin only)
 *     tags: [FAQs]
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
 *         description: FAQ deleted
 */
router.delete("/:id", auth, admin, faqController.deleteFaq);

module.exports = router;
