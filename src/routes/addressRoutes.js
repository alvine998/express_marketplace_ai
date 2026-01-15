const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const auth = require("../middleware/auth");

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
 *                 example: Home
 *               receiverName:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "081234567890"
 *               provinceId:
 *                 type: string
 *                 example: "11"
 *               province:
 *                 type: string
 *                 example: DKI Jakarta
 *               cityId:
 *                 type: string
 *                 example: "151"
 *               city:
 *                 type: string
 *                 example: Jakarta Selatan
 *               district:
 *                 type: string
 *                 example: Kebayoran Baru
 *               fullAddress:
 *                 type: string
 *                 example: Jl. Senopati No. 45, RT 05/RW 03
 *               isPrimary:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created successfully
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
 *                 label:
 *                   type: string
 *                   example: Home
 *                 receiverName:
 *                   type: string
 *                   example: John Doe
 *                 phoneNumber:
 *                   type: string
 *                   example: "081234567890"
 *                 province:
 *                   type: string
 *                   example: DKI Jakarta
 *                 city:
 *                   type: string
 *                   example: Jakarta Selatan
 *                 district:
 *                   type: string
 *                   example: Kebayoran Baru
 *                 fullAddress:
 *                   type: string
 *                   example: Jl. Senopati No. 45, RT 05/RW 03
 *                 isPrimary:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, addressController.addAddress);

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
 *                   label:
 *                     type: string
 *                     example: Home
 *                   receiverName:
 *                     type: string
 *                     example: John Doe
 *                   phoneNumber:
 *                     type: string
 *                     example: "081234567890"
 *                   province:
 *                     type: string
 *                     example: DKI Jakarta
 *                   city:
 *                     type: string
 *                     example: Jakarta Selatan
 *                   district:
 *                     type: string
 *                     example: Kebayoran Baru
 *                   fullAddress:
 *                     type: string
 *                     example: Jl. Senopati No. 45, RT 05/RW 03
 *                   isPrimary:
 *                     type: boolean
 *                     example: true
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, addressController.getAddresses);

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
 *                 example: Office
 *               receiverName:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "081234567890"
 *               provinceId:
 *                 type: string
 *                 example: "11"
 *               province:
 *                 type: string
 *                 example: DKI Jakarta
 *               cityId:
 *                 type: string
 *                 example: "151"
 *               city:
 *                 type: string
 *                 example: Jakarta Selatan
 *               district:
 *                 type: string
 *                 example: Setiabudi
 *               fullAddress:
 *                 type: string
 *                 example: Jl. HR Rasuna Said No. 100
 *               isPrimary:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 label:
 *                   type: string
 *                   example: Office
 *                 receiverName:
 *                   type: string
 *                   example: John Doe
 *                 fullAddress:
 *                   type: string
 *                   example: Jl. HR Rasuna Said No. 100
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.put("/:id", auth, addressController.updateAddress);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Primary address updated
 *                 address:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     isPrimary:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.patch("/:id/primary", auth, addressController.setPrimary);

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
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete("/:id", auth, addressController.deleteAddress);

module.exports = router;
