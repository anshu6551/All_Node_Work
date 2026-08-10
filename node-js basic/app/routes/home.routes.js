const express = require('express');
const homeController = require('../controller/home.controller')
const router = express.Router();


router.get('/',homeController.Home);
router.get('/about',homeController.about);

router.get('/contact', (req, res) => {
    res.render('contact'); // ✅ THIS FIXES YOUR ISSUE
});




module.exports = router;