const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AdminController {

    async AdminRegister(req, res) {
        try {
            const { name, email, phone, password, role } = req.body;

            if (!name || !email || !phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const existAdmin = await User.findOne({ email });

            if (existAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const userdata = new User({
                name,
                email,
                phone,
                password: hashPassword,
                role: role || "employee" 
            });

            const result = await userdata.save();

            if (result) {
                return res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    data: result,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async AdminLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const existuser = await User.findOne({ email });

            if (!existuser) {
                return res.status(400).json({
                    success: false,
                    message: "User not found",
                });
            }

            let isCheck = await bcrypt.compare(password, existuser.password);

            if (!isCheck) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials",
                });
            }

            // Generate token for all roles, not just 'admin'
            const token = jwt.sign(
                {
                    id: existuser._id,
                    name: existuser.name,
                    email: existuser.email,
                    phone: existuser.phone,
                    role: existuser.role,
                },
               
                process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRECT,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                data: {
                    id: existuser._id,
                    name: existuser.name,
                    email: existuser.email,
                    phone: existuser.phone,
                    role: existuser.role, 
                },
                token: token,
            });
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AdminController();