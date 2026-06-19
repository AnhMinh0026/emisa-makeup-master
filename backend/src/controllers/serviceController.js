const ServicePackage = require('../models/ServicePackage');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/services
// Body: { name, price, description, category, isHidden? }
// ─────────────────────────────────────────────────────────────────────────────
const createService = async (req, res) => {
  try {
    const { name, price, description, category, isHidden, order } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'name, price, and category are required.' });
    }

    const service = await ServicePackage.create({
      name: name.trim(),
      price: price.trim(),
      description: description?.trim() ?? '',
      category,
      isHidden: isHidden ?? false,
      order: order ?? 0,
    });

    return res.status(201).json({ message: 'Service package created.', service });
  } catch (error) {
    console.error('[createService]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/services
// Query params:
//   category=makeup|course  — filter by category
//   admin=true              — return all (including hidden); else filter hidden out
// ─────────────────────────────────────────────────────────────────────────────
const getServices = async (req, res) => {
  try {
    const { category, admin } = req.query;
    const isAdmin = admin === 'true';

    const filter = {};
    if (category) filter.category = category;
    if (!isAdmin) filter.isHidden = false; // public: skip hidden packages

    const services = await ServicePackage.find(filter).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({ count: services.length, services });
  } catch (error) {
    console.error('[getServices]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/services/:id
// Body: any subset of { name, price, description, category, isHidden, order }
// ─────────────────────────────────────────────────────────────────────────────
const updateService = async (req, res) => {
  try {
    const service = await ServicePackage.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service package not found.' });
    }

    const updates = {};
    const { name, price, description, category, isHidden, order } = req.body;

    if (name !== undefined)        updates.name        = name.trim();
    if (price !== undefined)       updates.price       = price.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined)    updates.category    = category;
    if (isHidden !== undefined)    updates.isHidden    = isHidden;
    if (order !== undefined)       updates.order       = order;

    const updated = await ServicePackage.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Service package updated.', service: updated });
  } catch (error) {
    console.error('[updateService]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/services/:id
// ─────────────────────────────────────────────────────────────────────────────
const deleteService = async (req, res) => {
  try {
    const service = await ServicePackage.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service package not found.' });
    }
    return res.status(200).json({ message: 'Service package deleted.' });
  } catch (error) {
    console.error('[deleteService]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { createService, getServices, updateService, deleteService };
