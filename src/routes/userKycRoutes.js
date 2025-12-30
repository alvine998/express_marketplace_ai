const express = require('express');
const router = express.Router();
const userKycController = require('../controllers/userKycController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/kyc/submit:
 *   post:
 *     summary: Submit User KYC
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - idNumber
 *               - idCard
 *               - selfie
 *             properties:
 *               fullName:
 *                 type: string
 *               idNumber:
 *                 type: string
 *               idCard:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 *       400:
 *         description: Missing fields or KYC already approved
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/submit',
  auth,
  upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  userKycController.submitKyc
);

/**
 * @swagger
 * /api/kyc/status:
 *   get:
 *     summary: Get current user's KYC status
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status retrieved
 *       404:
 *         description: KYC not found
 *       401:
 *         description: Unauthorized
 */
router.get('/status', auth, userKycController.getKycStatus);

module.exports = router;
