const User = require("../models/User");
const LoginAttempt = require("../models/LoginAttempt");
const PasswordResetToken = require("../models/PasswordResetToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");
const { logActivity } = require("../utils/loggingUtils");
require("dotenv").config();

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, name, email, password, phone, gender, address } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = await User.create({
      username,
      name,
      email,
      password,
      phone,
      gender,
      address,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await logActivity(req, "USER_REGISTER", { userId: user.id, email });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Find user by email or phone
    let user;
    const identifier = email || phone;

    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
    } else {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Log failed attempt
      await LoginAttempt.create({
        email: identifier,
        isSuccess: false,
        ipAddress: req.ip,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Log successful attempt
    await LoginAttempt.create({
      email: identifier,
      isSuccess: true,
      ipAddress: req.ip,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await logActivity(req, "USER_LOGIN", {
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update FCM token
exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.status(200).json({ message: "FCM token updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Request password reset - sends email with reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token to database
    await PasswordResetToken.create({
      email,
      token: resetToken,
      expiresAt,
    });

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.username},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await sendEmail(email, "Password Reset Request", emailHtml);

    await logActivity(req, "PASSWORD_RESET_REQUEST", { email });

    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify reset token (optional - for frontend to check if token is valid)
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        isUsed: false,
      },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: "Token has expired" });
    }

    res.status(200).json({
      message: "Token is valid",
      email: resetToken.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        isUsed: false,
      },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Find user and update password
    const user = await User.findOne({ where: { email: resetToken.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetToken.isUsed = true;
    await resetToken.save();

    await logActivity(req, "PASSWORD_RESET_SUCCESS", {
      email: resetToken.email,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
