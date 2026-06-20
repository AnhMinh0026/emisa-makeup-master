const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Course = require('../models/Course');

const uploadToCloudinary = (buffer, folder = 'emisa-courses') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err.message);
  }
};

/**
 * Creates a new course.
 * Route: POST /api/courses
 */
const createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body };
    courseData.isHidden = courseData.isHidden === 'true' || courseData.isHidden === true;

    if (req.file) {
      const cloudResult = await uploadToCloudinary(req.file.buffer, 'emisa-courses');
      courseData.imageUrl = cloudResult.secure_url;
      courseData.publicId = cloudResult.public_id;
    } else if (!courseData.imageUrl) {
      // Allow passing imageUrl as string as fallback if file is missing but URL is provided.
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const course = await Course.create(courseData);
    return res.status(201).json({ message: 'Course created successfully.', course });
  } catch (error) {
    console.error('[createCourse]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Retrieves a list of courses.
 * Route: GET /api/courses
 * Supports optional `?admin=true` query parameter to include hidden courses.
 */
const getCourses = async (req, res) => {
  try {
    const { admin } = req.query;
    const filter = admin === 'true' ? {} : { isHidden: false };
    
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    console.error('[getCourses]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Retrieves a single course by ID.
 * Route: GET /api/courses/:id
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    return res.status(200).json({ course });
  } catch (error) {
    console.error('[getCourseById]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Updates an existing course.
 * Route: PUT /api/courses/:id
 */
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const updates = { ...req.body };
    if (updates.isHidden !== undefined) {
      updates.isHidden = updates.isHidden === 'true' || updates.isHidden === true;
    }

    if (req.file) {
      const oldPublicId = course.publicId;
      const cloudResult = await uploadToCloudinary(req.file.buffer, 'emisa-courses');
      updates.imageUrl = cloudResult.secure_url;
      updates.publicId = cloudResult.public_id;

      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    
    return res.status(200).json({ message: 'Course updated successfully.', course: updatedCourse });
  } catch (error) {
    console.error('[updateCourse]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Deletes a course.
 * Route: DELETE /api/courses/:id
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (course.publicId) {
      await deleteFromCloudinary(course.publicId);
    }

    await Course.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('[deleteCourse]', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
