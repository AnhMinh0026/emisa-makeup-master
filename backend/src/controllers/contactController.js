const Contact = require('../models/Contact');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact
// Fetch the singleton contact document.
// Returns an empty default object if none exists yet.
// ─────────────────────────────────────────────────────────────────────────────
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(200).json({
        phone: '',
        facebook: '',
        instagram: '',
        address: '',
        mapEmbedCode: '',
      });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error('[getContact]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/contact
// Upsert the singleton contact document.
// Finds the first document and updates it; creates one if none exists.
// ─────────────────────────────────────────────────────────────────────────────
const updateContact = async (req, res) => {
  try {
    const { phone, facebook, instagram, address, mapEmbedCode } = req.body;

    const updates = {};
    if (phone !== undefined)        updates.phone = phone.trim();
    if (facebook !== undefined)     updates.facebook = facebook.trim();
    if (instagram !== undefined)    updates.instagram = instagram.trim();
    if (address !== undefined)      updates.address = address.trim();
    if (mapEmbedCode !== undefined) updates.mapEmbedCode = mapEmbedCode;

    // Upsert: update the first document, or create it if none exists
    const contact = await Contact.findOneAndUpdate(
      {}, // match any document (singleton pattern)
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Contact updated.', contact });
  } catch (error) {
    console.error('[updateContact]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getContact, updateContact };
