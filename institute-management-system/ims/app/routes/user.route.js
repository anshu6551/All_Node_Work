const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const userController = require('../controllers/UserController');

router.use(authMiddleware);

router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', asyncHandler(userController.updateProfile));

router.get('/', authCheckMiddleware('Admin'), asyncHandler(userController.listUsers));
router.patch('/:id/status', authCheckMiddleware('Admin'), asyncHandler(userController.setUserStatus));
router.get('/:id', asyncHandler(userController.getUserById));

module.exports = router;
