const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../utils/emailService');

class UserController {
  // 1. User Signup with Email Verification Link
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false
      });

      // Nodemailer via emailService send verification mail
      await emailService.sendVerificationEmail(email, verificationToken);

      return res.status(201).json({
        success: true,
        message: 'Signup successful! Verification link sent to your email.'
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Account Verification Endpoint
  async verifyAccount(req, res) {
    try {
      const { token } = req.params;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { isVerified: true, verificationToken: null },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }

      return res.status(200).json({
        success: true,
        message: 'Account verified successfully! You can now log in.'
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
    }
  }

  // 3. User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check if user has verified email
      if (!user.isVerified) {
        return res.status(401).json({ 
          success: false, 
          message: 'Please verify your email address before logging in.' 
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Get User Profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 5. Edit User Profile
  async editProfile(req, res) {
    try {
      const { name, email, profilePicture } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, profilePicture },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new UserController();