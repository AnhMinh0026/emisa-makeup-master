const mongoose = require('mongoose');

/* --- ServicePackage Schema --- */
/**
 * Mongoose schema representing a service package or course offering.
 */
const servicePackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required.'],
      trim: true,
    },
    price: {
      type: String,
      required: [true, 'Price is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: {
        values: ['makeup', 'course'],
        message: 'Category must be "makeup" or "course".',
      },
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServicePackage', servicePackageSchema);
