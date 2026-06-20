const Category = require('../models/Category');
const Image = require('../models/Image');

/* --- Helper: URL Slug Generation --- */
/**
 * Generates a URL-safe slug from a given string.
 *
 * @param {string} name - The original string.
 * @returns {string} The formatted URL-safe slug.
 */
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // Remove non-alphanumeric characters, preserving spaces and hyphens.
    .replace(/\s+/g, '-')            // Replace spaces with hyphens.
    .replace(/-+/g, '-');            // Collapse multiple consecutive hyphens into a single hyphen.

/**
 * Creates a new category.
 * Route: POST /api/categories
 *
 * @param {import('express').Request} req - The Express request object containing name and optional slug.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the newly created category.
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const resolvedSlug = slug ? slug.toLowerCase().trim() : generateSlug(name);

    // Prevent creation of duplicate slugs.
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

/**
 * Retrieves all categories.
 * Route: GET /api/categories
 * Each category is enriched with an `imageCount` representing the number of associated images.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the list of enriched categories.
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Concurrently fetch the image count associated with each category.
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

/**
 * Updates an existing category by ID.
 * Route: PUT /api/categories/:id
 *
 * @param {import('express').Request} req - The Express request object containing the category ID and fields to update.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the updated category.
 */
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

    // Verify slug uniqueness when updating to a new slug.
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

/**
 * Deletes a category by ID.
 * Route: DELETE /api/categories/:id
 * The deletion is blocked if any images are still associated with the category.
 *
 * @param {import('express').Request} req - The Express request object containing the category ID.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<Object>} JSON response confirming the deletion.
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Enforce strict validation: prevent deletion if the category is still associated with any images.
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
