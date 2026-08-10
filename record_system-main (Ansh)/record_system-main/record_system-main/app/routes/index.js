const express = require('express');
const UserRouter = require('./user.routes');
const RecordRouter = require('./record.routes');

const router = express.Router();

// user

router.use('/api', UserRouter);

// record

router.use('/api/record', RecordRouter);


module.exports = router