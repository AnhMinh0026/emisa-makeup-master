const streamifier = require('streamifier');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

// ─── Helper: upload a buffer to Cloudinary via stream ────────────────────────
const uploadToCloudinary = (buffer, folder = 'emisa-gallery') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ─── Helper: safely delete a Cloudinary asset ────────────────────────────────
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log but don't surface to caller — we still want DB operations to proceed
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/images
// Body (multipart): image (file), category (string), title?, isFeatured?, isHidden?
// ─────────────────────────────────────────────────────────────────────────────
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const { category, title, isFeatured, isHidden } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    // Upload buffer to Cloudinary
    const cloudResult = await uploadToCloudinary(req.file.buffer);

    const image = await Image.create({
      title: title || 'Untitled',
      category,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isHidden: isHidden === 'true' || isHidden === true,
      imageUrl: cloudResult.secure_url,
      publicId: cloudResult.public_id,
    });

    return res.status(201).json({ message: 'Image uploaded successfully.', image });
  } catch (error) {
    console.error('[uploadImage]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/images
// Query params:
//   ?isFeatured=true  → featured, non-hidden images only
//   ?category=bridal  → non-hidden images in that category
//   ?admin=true       → ALL images (including hidden)
// ─────────────────────────────────────────────────────────────────────────────
const getImages = async (req, res) => {
  try {
    const { isFeatured, category, admin } = req.query;

    let filter = {};

    if (admin === 'true') {
      // Admin view — return everything, no filter applied
    } else if (isFeatured === 'true') {
      filter = { isFeatured: true, isHidden: false };
    } else if (category) {
      filter = { category, isHidden: false };
    } else {
      // Default public view — exclude hidden images
      filter = { isHidden: false };
    }

    const images = await Image.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ count: images.length, images });
  } catch (error) {
    console.error('[getImages]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/images/:id
// Body (multipart): title?, category?, isFeatured?, isHidden?, image (file)?
// If a new file is included, the old Cloudinary asset is replaced safely.
// ─────────────────────────────────────────────────────────────────────────────
const updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const { title, category, isFeatured, isHidden } = req.body;

    // Build the fields to update
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isHidden !== undefined) updates.isHidden = isHidden === 'true' || isHidden === true;

    // ── File replacement flow ─────────────────────────────────────────────────
    if (req.file) {
      const oldPublicId = image.publicId;

      // 1. Upload the new file first — if this fails, old asset is untouched
      const cloudResult = await uploadToCloudinary(req.file.buffer);

      updates.imageUrl = cloudResult.secure_url;
      updates.publicId = cloudResult.public_id;

      // 2. Only delete the old asset after the new one is successfully stored
      await deleteFromCloudinary(oldPublicId);
    }

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Image updated successfully.', image: updatedImage });
  } catch (error) {
    console.error('[updateImage]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/images/:id
// Removes the asset from Cloudinary, then deletes the DB document.
// ─────────────────────────────────────────────────────────────────────────────
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Delete from Cloudinary first
    await cloudinary.uploader.destroy(image.publicId);

    // Then remove from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('[deleteImage]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { uploadImage, getImages, updateImage, deleteImage };
