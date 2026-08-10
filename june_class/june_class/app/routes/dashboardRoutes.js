const router = require('express').Router();

// Direct inline callback function taaki controllers ka koi jhanjhat hi na rahe abhi
router.get('/', (req, res) => {
    res.send("Dashboard Home via Inline Function Working!");
});

module.exports = router;