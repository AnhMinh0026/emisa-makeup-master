const express = require('express');
const router = express.Router();

const {
  createService,
  getServices,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

/* --- POST /api/services ---
 * Creates a new service package.
 */
router.post('/', createService);

/* --- GET /api/services ---
 * Fetches service packages, supporting category and visibility filters.
 */
router.get('/', getServices);

/* --- PUT /api/services/:id ---
 * Updates a service package.
 */
router.put('/:id', updateService);

/* --- DELETE /api/services/:id ---
 * Deletes a service package.
 */
router.delete('/:id', deleteService);

module.exports = router;
