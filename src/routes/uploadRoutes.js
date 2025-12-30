const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image to Firebase
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successful
 *       400:
 *         description: Please upload a file
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, upload.single('image'), uploadController.uploadImage);

module.exports = router;
