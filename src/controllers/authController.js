const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const { logActivity } = require('../utils/loggingUtils');
const crypto = require('crypto');
const { Op } = require('sequelize');
require('dotenv').config();

// ... existing register, login, updateFcmToken code ...

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await Otp.create({ email, otp: otpCode, expiresAt });

    await sendEmail(
      email,
      'Password Reset OTP',
      `<p>Your OTP for password reset is: <strong>${otpCode}</strong>. Use it within 10 minutes.</p>`
    );

    await logActivity(req, 'FORGOT_PASSWORD_REQUEST', { email });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({
      where: {
        email,
        otp,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // We don't mark as used yet because we need it for reset-password
    // Alternatively, we could return a temporary recovery token here.
    // For simplicity, we'll verify it and let reset-password finalize it.

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await Otp.findOne({
      where: {
        email,
        otp,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    otpRecord.isUsed = true;
    await otpRecord.save();

    await logActivity(req, 'PASSWORD_RESET_SUCCESS', { email });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ email, otp: otpCode, expiresAt });

    await sendEmail(
      email,
      'Resend: Password Reset OTP',
      `<p>Your new OTP for password reset is: <strong>${otpCode}</strong>.</p>`
    );

    await logActivity(req, 'RESEND_OTP', { email });

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
