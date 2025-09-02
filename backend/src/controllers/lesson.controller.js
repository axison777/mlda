const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user has access to course
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Students need to be enrolled
    if (req.user.role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    }

    // Teachers can only see their own course lessons
    if (req.user.role === 'TEACHER' && course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these lessons' });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
        ...(req.user.role === 'STUDENT' && { isPublished: true })
      },
      include: {
        quizzes: {
          select: {
            id: true,
            title: true,
            timeLimit: true,
            passingScore: true,
            _count: {
              select: { questions: true }
            }
          }
        },
        progress: req.user.role === 'STUDENT' ? {
          where: { userId: req.user.id },
          select: {
            completed: true,
            timeSpent: true,
            completedAt: true
          }
        } : false
      },
      orderBy: { order: 'asc' }
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacherId: true
          }
        },
        quizzes: {
          include: {
            questions: {
              select: {
                id: true,
                question: true,
                options: true,
                order: true
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        progress: req.user.role === 'STUDENT' ? {
          where: { userId: req.user.id }
        } : false
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check permissions
    if (req.user.role === 'STUDENT') {
      if (!lesson.isPublished) {
        return res.status(403).json({ message: 'Lesson not available' });
      }

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: lesson.course.id
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    }

    if (req.user.role === 'TEACHER' && lesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this lesson' });
    }

    res.json({ lesson });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      message: 'Error fetching lesson',
      error: error.message
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const { courseId, ...lessonData } = req.body;

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'TEACHER' && course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId
      }
    });

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      message: 'Error creating lesson',
      error: error.message
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: { teacherId: true }
        }
      }
    });

    if (!existingLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.user.role === 'TEACHER' && existingLesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updates
    });

    res.json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      message: 'Error updating lesson',
      error: error.message
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: { teacherId: true }
        }
      }
    });

    if (!existingLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.user.role === 'TEACHER' && existingLesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this lesson' });
    }

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      message: 'Error deleting lesson',
      error: error.message
    });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};