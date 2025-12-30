const Otp = require('../models/Otp');
const { sendEmail } = require('../utils/emailService');
const { v4: uuidv4 } = require('uuid');
const { logActivity } = require('../utils/loggingUtils');

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    const html = `
      <h1>Your Verification Code</h1>
      <p>Your OTP for Marketplace AI is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `;

    await sendEmail(email, 'Verification Code - Marketplace AI', html);

    await logActivity(req, 'SEND_OTP', { email });

    res.status(200).json({ message: 'OTP sent successfully to ' + email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({
      where: {
        email,
        otp,
        isUsed: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    await logActivity(req, 'VERIFY_OTP', { email });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};
