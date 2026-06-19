const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// POST   /api/categories       — Create a new category
router.post('/', createCategory);

// GET    /api/categories       — Fetch all categories (with imageCount)
router.get('/', getCategories);

// PUT    /api/categories/:id   — Update category name / slug
router.put('/:id', updateCategory);

// DELETE /api/categories/:id   — Delete category (blocked if images exist)
router.delete('/:id', deleteCategory);

module.exports = router;
