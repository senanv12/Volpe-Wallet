const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/userController');

// Axtarış route-u: /api/users/search
router.get('/search', searchUsers);

module.exports = router;