const express = require('express');
const router = express.Router();

const user = require('./user');

/* GET home page. */
router.use('/user', user);

module.exports = router;
