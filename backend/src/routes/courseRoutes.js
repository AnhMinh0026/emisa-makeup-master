const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const upload = require('../middlewares/upload');

/* --- POST /api/courses ---
 * Creates a new course.
 */
router.post('/', upload.single('image'), createCourse);

/* --- GET /api/courses ---
 * Fetches all courses. Supports ?admin=true to include hidden courses.
 */
router.get('/', getCourses);

/* --- GET /api/courses/:id ---
 * Fetches a single course by ID.
 */
router.get('/:id', getCourseById);

/* --- PUT /api/courses/:id ---
 * Updates a course.
 */
router.put('/:id', upload.single('image'), updateCourse);

/* --- DELETE /api/courses/:id ---
 * Deletes a course.
 */
router.delete('/:id', deleteCourse);

module.exports = router;
