const User = require('../models/User');

class UserController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.setUserStatus = this.setUserStatus.bind(this);
  }


  async getProfile(req, res) {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, data: user });
  }

  async updateProfile(req, res) {
    const { name, profilePicture, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    if (phone !== undefined) user.contact.phone = phone;
    if (address !== undefined) user.contact.address = address;

    await user.save();

    return res.status(200).json({ success: true, message: 'Profile updated', data: user });
  }

 
  async getUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  }

 
  async listUsers(req, res) {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: users,
    });
  }


  async setUserStatus(req, res) {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User status updated', data: user });
  }
}

module.exports = new UserController();
