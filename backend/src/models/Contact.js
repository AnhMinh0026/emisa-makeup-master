const mongoose = require('mongoose');

/* --- Singleton Contact Schema --- */
/**
 * Mongoose schema representing global contact information.
 * Designed to operate as a singleton; only one document should exist in the collection.
 * It is recommended to use the provided getContact and updateContact (upsert) controllers to manage it.
 */
const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    facebook: {
      type: String,
      trim: true,
      default: '',
    },
    facebookName: {
      type: String,
      trim: true,
      default: '',
    },
    instagram: {
      type: String,
      trim: true,
      default: '',
    },
    instagramName: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    mapEmbedCode: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
