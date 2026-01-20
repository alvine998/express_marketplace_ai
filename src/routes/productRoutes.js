const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone with A17 chip
 *               price:
 *                 type: number
 *                 example: 15000000
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: Electronics
 *               subcategoryId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               isFlashSale:
 *                 type: boolean
 *                 example: true
 *               flashSalePrice:
 *                 type: number
 *                 example: 10000000
 *               flashSaleExpiry:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-21T00:00:00Z
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 sellerId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 name:
 *                   type: string
 *                   example: iPhone 15 Pro
 *                 description:
 *                   type: string
 *                   example: Latest Apple smartphone with A17 chip
 *                 price:
 *                   type: number
 *                   example: 15000000
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 category:
 *                   type: string
 *                   example: Electronics
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/image.jpg
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, upload.single("image"), productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default 10)
 *       - in: query
 *         name: subcategoryId
 *         schema:
 *           type: string
 *         description: Filter by subcategory ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       name:
 *                         type: string
 *                         example: iPhone 15 Pro
 *                       description:
 *                         type: string
 *                         example: Latest Apple smartphone
 *                       price:
 *                         type: number
 *                         example: 15000000
 *                       stock:
 *                         type: integer
 *                         example: 50
 *                       category:
 *                         type: string
 *                         example: Electronics
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
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/flash-sale:
 *   get:
 *     summary: Get active flash sale products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of flash sale products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get("/flash-sale", productController.getFlashSaleProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 name:
 *                   type: string
 *                   example: iPhone 15 Pro
 *                 description:
 *                   type: string
 *                   example: Latest Apple smartphone with A17 chip
 *                 price:
 *                   type: number
 *                   example: 15000000
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 category:
 *                   type: string
 *                   example: Electronics
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/image.jpg
 *                 seller:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 subcategory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 example: 18000000
 *               stock:
 *                 type: integer
 *                 example: 30
 *               category:
 *                 type: string
 *                 example: Electronics
 *               isFlashSale:
 *                 type: boolean
 *               flashSalePrice:
 *                 type: number
 *               flashSaleExpiry:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 name:
 *                   type: string
 *                   example: iPhone 15 Pro Max
 *                 description:
 *                   type: string
 *                   example: Updated description
 *                 price:
 *                   type: number
 *                   example: 18000000
 *                 stock:
 *                   type: integer
 *                   example: 30
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/image.jpg
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Forbidden - Not authorized to update this product
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  auth,
  upload.single("image"),
  productController.updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       403:
 *         description: Forbidden - Not authorized to delete this product
 *       404:
 *         description: Product not found
 */
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
