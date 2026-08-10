const express = require("express")

const RegisterController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router()

router.post('/auth/register',RegisterController.addUser)
router.post('/auth/login',RegisterController.loginUser)
router.post('/auth/logout', protect , RegisterController.loginUser)
router.post('/auth/refresh' , RegisterController.refreshToken)

module.exports = router