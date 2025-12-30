const UserKyc = require('../models/UserKyc');
const { uploadImageToFirebase } = require('../utils/firebaseUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.submitKyc = async (req, res) => {
  try {
    const { fullName, idNumber } = req.body;
    const userId = req.user.id;

    if (!req.files || !req.files['idCard'] || !req.files['selfie']) {
      return res.status(400).json({ message: 'Both ID Card and Selfie images are required' });
    }

    const idCardFile = req.files['idCard'][0];
    const selfieFile = req.files['selfie'][0];

    // Check if KYC already exists for this user
    let kyc = await UserKyc.findOne({ where: { userId } });
    if (kyc && kyc.status === 'approved') {
      return res.status(400).json({ message: 'KYC already approved' });
    }

    // Upload to Firebase
    const idCardImageUrl = await uploadImageToFirebase(idCardFile);
    const selfieImageUrl = await uploadImageToFirebase(selfieFile);

    if (kyc) {
      // Update existing KYC
      await kyc.update({
        fullName,
        idNumber,
        idCardImageUrl,
        selfieImageUrl,
        status: 'pending' // Reset to pending on re-submission
      });
    } else {
      // Create new KYC
      kyc = await UserKyc.create({
        userId,
        fullName,
        idNumber,
        idCardImageUrl,
        selfieImageUrl,
        status: 'pending'
      });
    }

    await logActivity(req, 'SUBMIT_KYC', { status: 'pending' });

    res.status(201).json({ 
      message: 'KYC submitted successfully',
      kyc: {
        id: kyc.id,
        status: kyc.status,
        fullName: kyc.fullName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during KYC submission' });
  }
};

exports.getKycStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const kyc = await UserKyc.findOne({ where: { userId } });

    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found for this user' });
    }

    res.status(200).json({ kyc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
