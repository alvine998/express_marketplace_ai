const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const auth = require('../middleware/auth');

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
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created
 */
router.post('/', auth, subcategoryController.createSubcategory);

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
 */
router.get('/category/:categoryId', subcategoryController.getSubcategoriesByCategory);

module.exports = router;
