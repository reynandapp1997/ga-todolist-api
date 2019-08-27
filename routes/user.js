const express = require('express');
const router = express.Router();

const {
    getAllUser,
    createUser,
    loginUser
} = require('../controllers/user');

router.get('/', getAllUser);
router.post('/', createUser);
router.post('/login', loginUser);

module.exports = router;
