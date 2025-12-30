const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - receiverName
 *               - phoneNumber
 *               - provinceId
 *               - province
 *               - cityId
 *               - city
 *               - district
 *               - fullAddress
 *             properties:
 *               label:
 *                 type: string
 *               receiverName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               provinceId:
 *                 type: string
 *               province:
 *                 type: string
 *               cityId:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address created
 */
router.post('/', auth, addressController.addAddress);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all user addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 */
router.get('/', auth, addressController.getAddresses);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               receiverName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               provinceId:
 *                 type: string
 *               province:
 *                 type: string
 *               cityId:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 */
router.put('/:id', auth, addressController.updateAddress);

/**
 * @swagger
 * /api/addresses/{id}/primary:
 *   patch:
 *     summary: Set an address as primary
 *     tags: [Addresses]
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
 *         description: Primary address updated
 */
router.patch('/:id/primary', auth, addressController.setPrimary);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
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
 *         description: Address deleted
 */
router.delete('/:id', auth, addressController.deleteAddress);

module.exports = router;
