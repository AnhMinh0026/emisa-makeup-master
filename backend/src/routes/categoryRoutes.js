const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

/* --- POST /api/categories ---
 * Creates a new category.
 */
router.post('/', createCategory);

/* --- GET /api/categories ---
 * Fetches all categories, including associated image counts.
 */
router.get('/', getCategories);

/* --- PUT /api/categories/:id ---
 * Updates a category's name and/or slug.
 */
router.put('/:id', updateCategory);

/* --- DELETE /api/categories/:id ---
 * Deletes a category. Blocked if associated images exist.
 */
router.delete('/:id', deleteCategory);

module.exports = router;
