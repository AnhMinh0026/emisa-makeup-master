const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const {
  uploadImage,
  getImages,
  updateImage,
  deleteImage,
} = require('../controllers/imageController');

// POST   /api/images        — Upload a new image
router.post('/', upload.single('image'), uploadImage);

// GET    /api/images        — Fetch images (with optional query filters)
router.get('/', getImages);

// PUT    /api/images/:id    — Update image metadata (+ optional file replacement)
router.put('/:id', upload.single('image'), updateImage);

// DELETE /api/images/:id   — Delete image from Cloudinary and DB
router.delete('/:id', deleteImage);

module.exports = router;
