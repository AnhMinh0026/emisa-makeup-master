const multer = require('multer');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: "${file.mimetype}". Only JPEG, PNG, WebP, and HEIC images are allowed.`
      ),
      false
    );
  }
};

/**
 * Multer middleware configuration for handling multipart/form-data.
 * Enforces memory storage, a 20 MB file size limit, and specific MIME type filtering.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
  fileFilter,
});

module.exports = upload;
