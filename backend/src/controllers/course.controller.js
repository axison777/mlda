const courseService = require('../services/course.service');
const logger = require('../utils/logger');

const getCourses = async (req, res) => {
  try {
    const { page, limit, level, status, featured, search } = req.query;
    
    const filters = { level, status, featured, search };
    const pagination = { page, limit };
    
    const result = await courseService.findCourses(
      filters, 
      pagination, 
      req.user.role, 
      req.user.id
    );

    res.json(result);
  } catch (error) {
    logger.error('Get courses error', error);
    res.status(500).json({
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseService.findCourseById(id, req.user.role, req.user.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found or not available'
      });
    }

    res.json({ course });
  } catch (error) {
    logger.error('Get course error', error);
    res.status(500).json({
      message: 'Error fetching course',
      error: error.message
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body, req.user.id);

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    logger.error('Create course error', error);
    res.status(500).json({
      message: 'Error creating course',
      error: error.message
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseService.updateCourse(id, req.body, req.user.role, req.user.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ message: error.message });
    }
    
    logger.error('Update course error', error);
    res.status(500).json({
      message: 'Error updating course',
      error: error.message
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await courseService.deleteCourse(id, req.user.role, req.user.id);

    if (!result) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    res.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ message: error.message });
    }
    
    logger.error('Delete course error', error);
    res.status(500).json({
      message: 'Error deleting course',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};