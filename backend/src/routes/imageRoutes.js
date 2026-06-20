const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const {
  uploadImage,
  getImages,
  updateImage,
  deleteImage,
} = require('../controllers/imageController');

/* --- POST /api/images ---
 * Uploads a new image.
 */
router.post('/', upload.single('image'), uploadImage);

/* --- GET /api/images ---
 * Fetches images, supporting optional query filters.
 */
router.get('/', getImages);

/* --- PUT /api/images/:id ---
 * Updates image metadata, optionally handling file replacement.
 */
router.put('/:id', upload.single('image'), updateImage);

/* --- DELETE /api/images/:id ---
 * Deletes an image from external storage and the database.
 */
router.delete('/:id', deleteImage);

module.exports = router;
