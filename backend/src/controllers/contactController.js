const Contact = require('../models/Contact');

/**
 * Retrieves the singleton contact document.
 * Route: GET /api/contact
 * Returns a default empty object if the contact document does not exist.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the contact details.
 */
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

/**
 * Updates or creates the singleton contact document.
 * Route: PUT /api/contact
 * Applies upsert logic to ensure exactly one document governs the contact information.
 *
 * @param {import('express').Request} req - The Express request object containing the updated fields.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the updated contact document.
 */
const updateContact = async (req, res) => {
  try {
    const { phone, facebook, instagram, address, mapEmbedCode } = req.body;

    const updates = {};
    if (phone !== undefined)        updates.phone = phone.trim();
    if (facebook !== undefined)     updates.facebook = facebook.trim();
    if (instagram !== undefined)    updates.instagram = instagram.trim();
    if (address !== undefined)      updates.address = address.trim();
    if (mapEmbedCode !== undefined) updates.mapEmbedCode = mapEmbedCode;

    // Perform an upsert: update the singleton document if it exists, otherwise create it.
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
