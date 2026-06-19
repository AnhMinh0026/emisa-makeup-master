const mongoose = require('mongoose');

// ─── Singleton Contact Schema ─────────────────────────────────────────────────
// Only one document will ever exist in this collection.
// Use getContact / updateContact (upsert) to manage it.
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
    instagram: {
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
