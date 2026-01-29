const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/sellers:
 *   get:
 *     summary: Get all sellers with pagination
 *     tags: [Sellers]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by store name
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verified status
 *       - in: query
 *         name: isOfficial
 *         schema:
 *           type: boolean
 *         description: Filter by official status
 *     responses:
 *       200:
 *         description: List of sellers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       storeName:
 *                         type: string
 *                         example: Tech Store
 *                       description:
 *                         type: string
 *                         example: Best electronics store in town
 *                       address:
 *                         type: string
 *                         example: Jl. Sudirman No. 123, Jakarta
 *                       logoUrl:
 *                         type: string
 *                         example: https://storage.googleapis.com/bucket/logo.jpg
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       isOfficial:
 *                         type: boolean
 *                         example: false
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                           email:
 *                             type: string
 *                             example: johndoe@email.com
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 */
router.get("/", sellerController.getAllSellers);

/**
 * @swagger
 * /api/sellers/register:
 *   post:
 *     summary: Register as a seller
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: Tech Store
 *               userId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440001
 *                 description: Explicit user ID (Admin only)
 *               description:
 *                 type: string
 *                 example: Best electronics store in town
 *               address:
 *                 type: string
 *                 example: Jl. Sudirman No. 123, Jakarta
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Seller registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 storeName:
 *                   type: string
 *                   example: Tech Store
 *                 description:
 *                   type: string
 *                   example: Best electronics store in town
 *                 address:
 *                   type: string
 *                   example: Jl. Sudirman No. 123, Jakarta
 *                 logoUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/logo.jpg
 *                 isVerified:
 *                   type: boolean
 *                   example: false
 *                 isOfficial:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Already a seller or store name taken
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/register",
  auth,
  upload.single("logo"),
  sellerController.becomeSeller,
);

/**
 * @swagger
 * /api/sellers/me:
 *   get:
 *     summary: Get own seller profile
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 storeName:
 *                   type: string
 *                   example: Tech Store
 *                 description:
 *                   type: string
 *                   example: Best electronics store in town
 *                 address:
 *                   type: string
 *                   example: Jl. Sudirman No. 123, Jakarta
 *                 logoUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/logo.jpg
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 *                 isOfficial:
 *                   type: boolean
 *                   example: false
 *                 rating:
 *                   type: number
 *                   example: 4.5
 *                 totalProducts:
 *                   type: integer
 *                   example: 25
 *       404:
 *         description: Not a seller
 *       401:
 *         description: Unauthorized
 */
router.get("/me", auth, sellerController.getOwnProfile);

/**
 * @swagger
 * /api/sellers/{id}:
 *   get:
 *     summary: Get seller profile by ID
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 storeName:
 *                   type: string
 *                   example: Tech Store
 *                 description:
 *                   type: string
 *                   example: Best electronics store in town
 *                 logoUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/logo.jpg
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 *                 isOfficial:
 *                   type: boolean
 *                   example: false
 *                 rating:
 *                   type: number
 *                   example: 4.5
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *       404:
 *         description: Seller not found
 */
router.get("/:id", sellerController.getSellerById);

/**
 * @swagger
 * /api/sellers/{id}/products:
 *   get:
 *     summary: Get products list for a seller
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 50
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
 *                       subcategory:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Seller not found
 */
router.get("/:id/products", sellerController.getSellerProducts);

/**
 * @swagger
 * /api/sellers/me:
 *   put:
 *     summary: Update own seller profile
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: Updated Tech Store
 *               description:
 *                 type: string
 *                 example: Updated description
 *               address:
 *                 type: string
 *                 example: New address
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Seller profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 storeName:
 *                   type: string
 *                   example: Updated Tech Store
 *                 description:
 *                   type: string
 *                   example: Updated description
 *                 address:
 *                   type: string
 *                   example: New address
 *                 logoUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/logo.jpg
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Store name taken
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not a seller
 */
router.put("/me", auth, upload.single("logo"), sellerController.updateProfile);

/**
 * @swagger
 * /api/sellers/{id}/verify:
 *   patch:
 *     summary: Verify a seller (Admin only)
 *     tags: [Sellers]
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
 *         description: Seller verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seller verified successfully
 *                 seller:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storeName:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Seller not found
 */
router.patch("/:id/verify", auth, admin, sellerController.adminVerifySeller);

/**
 * @swagger
 * /api/sellers/{id}/official:
 *   patch:
 *     summary: Toggle official status for a seller (Admin only)
 *     tags: [Sellers]
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
 *         description: Official status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Official status updated
 *                 seller:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     storeName:
 *                       type: string
 *                     isOfficial:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Seller not found
 */
router.patch(
  "/:id/official",
  auth,
  admin,
  sellerController.adminToggleOfficial,
);

/**
 * @swagger
 * /api/sellers/dashboard:
 *   get:
 *     summary: Get seller dashboard statistics
 *     tags: [Sellers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   example: 15
 *                 totalSales:
 *                   type: number
 *                   format: float
 *                   example: 1500000.00
 *                 totalOrders:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: Seller profile not found
 */
router.get("/dashboard", auth, sellerController.getDashboardStats);

module.exports = router;
