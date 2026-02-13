const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Public route - login
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', auth, getAdminProfile);
router.put('/profile', auth, updateAdminProfile);

module.exports = router;
