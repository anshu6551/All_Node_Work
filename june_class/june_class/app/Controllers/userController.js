const path = require('path');
const rootDir = path.join(__dirname, '..');

// Ekdum exact spelling jo aapke sidebar me hai: 'Users' aur 'Role'
const User = require(path.join(rootDir, 'models', 'Users'));
const Role = require(path.join(rootDir, 'models', 'Role'));

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.getUsersPage = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $lookup: { from: "roles", localField: "roleId", foreignField: "_id", as: "role" } },
      { $unwind: "$role" },
      { $project: { name: 1, email: 1, isActive: 1, roleName: "$role.name" } }
    ]);
    const roles = await Role.find(); 
    res.render('dashboard/users', { users, roles, currentUser: req.user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, roleId } = req.body;
    const autoPassword = crypto.randomBytes(4).toString('hex'); 
    const hashedPassword = await bcrypt.hash(autoPassword, 10);

    const newUser = new User({ name, email, password: hashedPassword, roleId });
    await newUser.save();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: '"App Portal" <no-reply@app.com>',
      to: email,
      subject: "Your Generated Credentials",
      text: `Welcome ${name},\n\nYour account has been configured.\n\nEmail: ${email}\nPassword: ${autoPassword}\n\nLog in immediately.`
    });

    res.redirect('/dashboard/users');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.redirect('/dashboard/users');
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard/users');
};