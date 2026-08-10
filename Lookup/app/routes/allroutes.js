const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');


router.post('/create/user', userController.createUser);
router.post('/create/order', userController.createOrder);
router.get('/users/orders', userController.getUsersWithOrders);




module.exports = router;