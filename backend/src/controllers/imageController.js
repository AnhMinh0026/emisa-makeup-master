const streamifier = require('streamifier');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

/* --- Cloudinary Utility Functions --- */
/**
 * Uploads a file buffer to Cloudinary using an upload stream.
 *
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {string} [folder='emisa-gallery'] - The destination folder in Cloudinary.
 * @returns {Promise<Object>} A promise resolving to the Cloudinary upload result.
 */
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

/**
 * Safely removes an asset from Cloudinary.
 * Errors are logged but caught to ensure continuous execution of subsequent operations.
 *
 * @param {string} publicId - The Cloudinary public identifier of the asset.
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log the error internally without surfacing it to the caller to allow subsequent database operations to proceed.
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err.message);
  }
};

/**
 * Uploads a new image and persists its metadata to the database.
 * Route: POST /api/images
 *
 * @param {import('express').Request} req - The Express request object containing the file and metadata.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the newly created image document.
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const { category, title, isFeatured, isHidden } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    // Upload the file buffer to the external storage provider.
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

/**
 * Retrieves a list of images based on specified filter criteria.
 * Route: GET /api/images
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the list of images.
 */
const getImages = async (req, res) => {
  try {
    const { isFeatured, category, admin, startDate, endDate } = req.query;

    let filter = {};

    // Exclude hidden images from the default public view.
    if (admin !== 'true') {
      filter.isHidden = false;
    }

    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    if (category) {
      filter.category = category;
    }

    // Apply a date range filter if both start and end dates are provided.
    if (startDate && endDate) {
      const end = new Date(endDate);
      // Extend the end date to cover the entire day.
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: end
      };
    }

    const images = await Image.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ count: images.length, images });
  } catch (error) {
    console.error('[getImages]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Updates an existing image entry.
 * Route: PUT /api/images/:id
 * If a new file is provided, the legacy Cloudinary asset is safely replaced.
 *
 * @param {import('express').Request} req - The Express request object containing the image ID, metadata, and optional new file.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the updated image document.
 */
const updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const { title, category, isFeatured, isHidden } = req.body;

    // Construct the object containing fields to be updated.
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isHidden !== undefined) updates.isHidden = isHidden === 'true' || isHidden === true;

    /* --- File Replacement Flow --- */
    if (req.file) {
      const oldPublicId = image.publicId;

      // Upload the new file first to ensure the original asset remains intact if the upload fails.
      const cloudResult = await uploadToCloudinary(req.file.buffer);

      updates.imageUrl = cloudResult.secure_url;
      updates.publicId = cloudResult.public_id;

      // Remove the legacy asset only after the new file is successfully persisted.
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

/**
 * Deletes an image.
 * Route: DELETE /api/images/:id
 * Removes the asset from Cloudinary prior to deleting the database document.
 *
 * @param {import('express').Request} req - The Express request object containing the image ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response confirming the deletion.
 */
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Remove the asset from external storage first.
    await cloudinary.uploader.destroy(image.publicId);

    // Remove the corresponding document from the database.
    await Image.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('[deleteImage]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { uploadImage, getImages, updateImage, deleteImage };
