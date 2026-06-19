const Category = require('../models/Category');
const Image = require('../models/Image');

// ─── Helper: generate a URL-safe slug from a name string ─────────────────────
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric (except spaces/hyphens)
    .replace(/\s+/g, '-')            // replace spaces with hyphens
    .replace(/-+/g, '-');            // collapse multiple hyphens

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/categories
// Body: { name, slug? }
// ─────────────────────────────────────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const resolvedSlug = slug ? slug.toLowerCase().trim() : generateSlug(name);

    // Guard against duplicate slugs
    const existing = await Category.findOne({ slug: resolvedSlug });
    if (existing) {
      return res.status(409).json({
        message: `A category with the slug "${resolvedSlug}" already exists.`,
      });
    }

    const category = await Category.create({ name: name.trim(), slug: resolvedSlug });
    return res.status(201).json({ message: 'Category created.', category });
  } catch (error) {
    console.error('[createCategory]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/categories
// Returns all categories, each enriched with an `imageCount` field.
// ─────────────────────────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Attach imageCount to each category in parallel
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const imageCount = await Image.countDocuments({ category: cat.slug });
        return { ...cat.toObject(), imageCount };
      })
    );

    return res.status(200).json({ count: enriched.length, categories: enriched });
  } catch (error) {
    console.error('[getCategories]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/categories/:id
// Body: { name?, slug? }
// ─────────────────────────────────────────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const { name, slug } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (slug !== undefined) updates.slug = slug.toLowerCase().trim();

    // If slug is changing, check for conflicts
    if (updates.slug && updates.slug !== category.slug) {
      const conflict = await Category.findOne({ slug: updates.slug });
      if (conflict) {
        return res.status(409).json({
          message: `A category with the slug "${updates.slug}" already exists.`,
        });
      }
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Category updated.', category: updated });
  } catch (error) {
    console.error('[updateCategory]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/categories/:id
// Blocked if any images are still using this category's slug.
// ─────────────────────────────────────────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // STRICT VALIDATION: refuse deletion if images exist in this category
    const count = await Image.countDocuments({ category: category.slug });
    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete category. There are ${count} image${count !== 1 ? 's' : ''} attached to it.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Category deleted.' });
  } catch (error) {
    console.error('[deleteCategory]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
