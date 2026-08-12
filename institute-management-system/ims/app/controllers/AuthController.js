const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { verificationEmailTemplate } = require('../utils/emailTemplates');

class AuthController {
  constructor() {
   
    this.signup = this.signup.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.login = this.login.bind(this);
  }

  async signup(req, res) {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required' });
    }

    if (!['Student', 'Teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be Student or Teacher' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ name, email, password, role });
    const rawToken = user.generateVerificationToken();
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email - Institute Management System',
        html: verificationEmailTemplate(user.name, verificationUrl),
      });
    } catch (err) {
      console.error('Failed to send verification email:', err.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Signup successful. Please check your email to verify your account.',
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  }

  

 
  async verifyEmail(req, res) {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully. You may now log in.' });
  }

  
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  }
}

module.exports = new AuthController();
