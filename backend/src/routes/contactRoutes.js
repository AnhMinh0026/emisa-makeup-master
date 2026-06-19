const express = require('express');
const router = express.Router();

const { getContact, updateContact } = require('../controllers/contactController');

// GET  /api/contact  — Fetch the singleton contact document
router.get('/', getContact);

// PUT  /api/contact  — Upsert the singleton contact document
router.put('/', updateContact);

module.exports = router;
