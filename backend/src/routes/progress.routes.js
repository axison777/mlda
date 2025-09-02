const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const prisma = new PrismaClient();

// Update lesson progress
router.post('/lesson/:lessonId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { completed, timeSpent } = req.body;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: { id: true }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.course.id
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        completed,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId,
        lessonId,
        completed,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null
      }
    });

    res.json({
      message: 'Progress updated successfully',
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      message: 'Error updating progress',
      error: error.message
    });
  }
});

// Get user progress for a course
router.get('/course/:courseId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId,
        lesson: {
          courseId
        }
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            order: true
          }
        }
      },
      orderBy: {
        lesson: {
          order: 'asc'
        }
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      message: 'Error fetching progress',
      error: error.message
    });
  }
});

module.exports = router;