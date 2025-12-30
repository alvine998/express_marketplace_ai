const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Seller registered successfully
 *       400:
 *         description: Already a seller or store name taken
 *       401:
 *         description: Unauthorized
 */
router.post('/register', auth, upload.single('logo'), sellerController.becomeSeller);

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
 *       404:
 *         description: Not a seller
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, sellerController.getOwnProfile);

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
 *       404:
 *         description: Seller not found
 */
router.get('/:id', sellerController.getSellerById);

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
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Seller profile updated
 *       400:
 *         description: Store name taken
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not a seller
 */
router.put('/me', auth, upload.single('logo'), sellerController.updateProfile);

module.exports = router;
