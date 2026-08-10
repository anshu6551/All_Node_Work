const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, getProfile, editProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup',(req,res,next)=>{
//  #swagger.tags = ['Authentication']
  signup(req,res,next)
});


router.get('/verify/:token', (req,res,next)=>{
  //  #swagger.tags = ['Authentication']
  verifyEmail(req,res,next)
});

router.get('/login', (req,res,next)=>{
  //  #swagger.tags = ['Authentication']
  login(req,res,next)
});


// 🔐 Tells Swagger to track authorization headers automatically using the lock icon
router.get('/profile', protect, (req, res) => {
  /* #swagger.security = [{
          "bearerAuth": []
  }] */
//  #swagger.tags = ['Authentication']
  getProfile(req, res);
});

router.put('/profile', protect, upload.single('profilePicture'), (req, res) => {
  /* #swagger.security = [{
          "bearerAuth": []
  }] */
 
// #swagger.tags = ['Authentication']
  editProfile(req, res);
});

module.exports = router;