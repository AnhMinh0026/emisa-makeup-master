const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
