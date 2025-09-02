const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/email.service');

const prisma = new PrismaClient();

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        status: true
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    // Send enrollment confirmation email
    await emailService.sendCourseEnrollmentEmail(req.user, course);

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            level: true,
            duration: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

module.exports = {
  enrollInCourse,
  getUserEnrollments
};