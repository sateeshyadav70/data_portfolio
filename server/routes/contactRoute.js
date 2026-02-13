const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../controllers/contactController');
const auth = require('../middleware/auth');

// Public route - create contact
router.post('/', createContact);

// Admin route - get all contacts
router.get('/', auth, getAllContacts);

module.exports = router;
