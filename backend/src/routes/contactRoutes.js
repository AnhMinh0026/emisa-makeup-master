const express = require('express');
const router = express.Router();

const { getContact, updateContact } = require('../controllers/contactController');

/* --- GET /api/contact ---
 * Fetches the singleton contact document.
 */
router.get('/', getContact);

/* --- PUT /api/contact ---
 * Upserts the singleton contact document.
 */
router.put('/', updateContact);

module.exports = router;
