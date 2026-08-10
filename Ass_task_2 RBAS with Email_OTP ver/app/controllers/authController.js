const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const httpStatusCode = require('../utils/httpsStatusCode');

// 1. Transporter ko global scope mein setup kiya taaki saare methods direct access kar sakein
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

class AuthController {

  // Helper method to generate JWT
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  //   Register User & Send OTP
  //   POST /api/auth/register
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: 'User already exists' });
      }

      // Generate Salt and Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with hashed password
      await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        role 
      });

      // OTP Code Flow
      const otpCode = crypto.randomInt(100000, 999999).toString();
      await Otp.create({ email, otp: otpCode });

      // Send Mail Notification using global transporter
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Your Account Verification OTP Code',
        text: `Welcome ${name}! Your verification OTP is: ${otpCode}. It expires in 5 minutes.`,
      });

      res.status(httpStatusCode.CREATED).json({ 
        success: true, 
        message: 'Registration successful! Please check your email for the verification code.' 
      });

    } catch (error) {
      res.status(httpStatusCode.SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  //     Verify Email via OTP
  //  POST /api/auth/verify-otp
  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const record = await Otp.findOne({ email, otp });
      if (!record) {
        return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: 'Invalid or expired OTP code' });
      }

      await User.findOneAndUpdate({ email }, { isVerified: true });
      await Otp.deleteOne({ _id: record._id });

      res.status(httpStatusCode.OK).json({ success: true, message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
      res.status(httpStatusCode.SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  //   Login User & Return Token
  //   POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Fetch user data from database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: 'Invalid email or password' });
      }

      // Perform raw password comparison directly in the login method
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: 'Invalid email or password' });
      }

      // Route Guard: Block unverified accounts
      if (!user.isVerified) {
        return res.status(httpStatusCode.FORBIDDEN).json({ success: false, message: 'Your account email is not verified yet.' });
      }

      // Generate Session Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(httpStatusCode.OK).json({
        success: true,
        token: token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(httpStatusCode.SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  //   Resend Verification OTP
  //    POST /api/auth/resend-otp
  async resendOtp(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) return res.status(httpStatusCode.NOT_FOUND).json({ success: false, message: 'User not found' });
      if (user.isVerified) return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: 'Account is already verified' });

      await Otp.deleteMany({ email });

      const otpCode = crypto.randomInt(100000, 999999).toString();
      await Otp.create({ email, otp: otpCode });

      // Cleaned up here too: Using global transporter directly
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Your Fresh Verification OTP Code',
        text: `Your new OTP is: ${otpCode}. It expires in 5 minutes.`,
      });

      res.status(httpStatusCode.OK).json({ success: true, message: 'A fresh OTP has been dispatched to your email.' });
    } catch (error) {
      res.status(httpStatusCode.SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();