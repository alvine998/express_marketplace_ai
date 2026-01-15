const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/subcategoryController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - name
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               name:
 *                 type: string
 *                 example: Smartphones
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 categoryId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 name:
 *                   type: string
 *                   example: Smartphones
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error creating subcategory
 */
router.post("/", auth, subcategoryController.createSubcategory);

/**
 * @swagger
 * /api/subcategories/category/{categoryId}:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories
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
 *                   categoryId:
 *                     type: string
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   name:
 *                     type: string
 *                     example: Smartphones
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error fetching subcategories
 */
router.get(
  "/category/:categoryId",
  subcategoryController.getSubcategoriesByCategory
);

module.exports = router;
