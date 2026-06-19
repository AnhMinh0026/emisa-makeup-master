const express = require('express');
const router = express.Router();

const {
  createService,
  getServices,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

// POST   /api/services       — Create a new service package
router.post('/', createService);

// GET    /api/services       — Fetch packages (supports ?category=&admin=true)
router.get('/', getServices);

// PUT    /api/services/:id   — Update a service package
router.put('/:id', updateService);

// DELETE /api/services/:id   — Delete a service package
router.delete('/:id', deleteService);

module.exports = router;
