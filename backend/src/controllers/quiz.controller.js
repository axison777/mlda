const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createQuiz = async (req, res) => {
  try {
    const { lessonId, questions, ...quizData } = req.body;

    // Verify lesson ownership
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: { teacherId: true }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.user.role === 'TEACHER' && lesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add quiz to this lesson' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        lessonId,
        questions: {
          create: questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: index + 1
          }))
        }
      },
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
    });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                teacherId: true
              }
            }
          }
        },
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
            ...(req.user.role !== 'STUDENT' && { correctAnswer: true, explanation: true })
          },
          orderBy: { order: 'asc' }
        },
        attempts: req.user.role === 'STUDENT' ? {
          where: { userId: req.user.id },
          orderBy: { attemptedAt: 'desc' },
          take: 5
        } : false
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check permissions
    if (req.user.role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: quiz.lesson.course.id
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    }

    if (req.user.role === 'TEACHER' && quiz.lesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this quiz' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};

const submitQuizAttempt = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { answers, timeSpent } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        lesson: {
          include: {
            course: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: quiz.lesson.course.id
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const detailedResults = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      detailedResults.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId,
        score,
        answers,
        timeSpent,
        passed
      }
    });

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        attemptId: attempt.id,
        score,
        passed,
        correctAnswers,
        totalQuestions,
        timeSpent,
        passingScore: quiz.passingScore,
        detailedResults
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      message: 'Error submitting quiz',
      error: error.message
    });
  }
};

const getQuizAttempts = async (req, res) => {
  try {
    const { id: quizId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            course: {
              select: { teacherId: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Only teachers can see all attempts, students see only their own
    const where = { quizId };
    if (req.user.role === 'STUDENT') {
      where.userId = req.user.id;
    } else if (req.user.role === 'TEACHER' && quiz.lesson.course.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view quiz attempts' });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { attemptedAt: 'desc' }
    });

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({
      message: 'Error fetching quiz attempts',
      error: error.message
    });
  }
};

module.exports = {
  createQuiz,
  getQuizById,
  submitQuizAttempt,
  getQuizAttempts
};