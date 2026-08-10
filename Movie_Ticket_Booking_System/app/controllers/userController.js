const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');



exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = await User.create({ name, email, password, role, verificationToken });

        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({ message: 'Signup successful! Please check your email to verify your account.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).json({ message: 'Invalid verification token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_key_for_testing', { expiresIn: '1d' });
        res.status(200).json({ message:"Login SuccessFully",token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

exports.editProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) updates.profilePicture = req.file.path;

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};