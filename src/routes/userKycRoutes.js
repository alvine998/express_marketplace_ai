const express = require("express");
const router = express.Router();
const userKycController = require("../controllers/userKycController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

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
 *                 example: John Doe
 *               idNumber:
 *                 type: string
 *                 example: "1234567890123456"
 *               idCard:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
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
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 idNumber:
 *                   type: string
 *                   example: "1234567890123456"
 *                 status:
 *                   type: string
 *                   example: pending
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing fields or KYC already approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: KYC already submitted and approved
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/submit",
  auth,
  upload.fields([
    { name: "idCard", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  userKycController.submitKyc,
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 fullName:
 *                   type: string
 *                   example: John Doe
 *                 idNumber:
 *                   type: string
 *                   example: "1234567890123456"
 *                 status:
 *                   type: string
 *                   example: approved
 *                 idCardUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/idcard.jpg
 *                 selfieUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/selfie.jpg
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: KYC not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: KYC not submitted yet
 *       401:
 *         description: Unauthorized
 */
router.get("/status", auth, userKycController.getKycStatus);

module.exports = router;
