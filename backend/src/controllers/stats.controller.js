const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      popularCourses
    ] = await Promise.all([
      // Total users by role
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
        where: { isActive: true }
      }),
      
      // Total courses by status
      prisma.course.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      
      // Total enrollments
      prisma.enrollment.count(),
      
      // Total revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'succeeded' }
      }),
      
      // Recent users (last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Most popular courses
      prisma.course.findMany({
        take: 5,
        include: {
          _count: {
            select: { enrollments: true }
          },
          teacher: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        }
      })
    ]);

    const stats = {
      users: {
        total: totalUsers.reduce((sum, role) => sum + role._count.id, 0),
        byRole: totalUsers.reduce((acc, role) => {
          acc[role.role.toLowerCase()] = role._count.id;
          return acc;
        }, {}),
        recent: recentUsers
      },
      courses: {
        total: totalCourses.reduce((sum, status) => sum + status._count.id, 0),
        byStatus: totalCourses.reduce((acc, status) => {
          acc[status.status.toLowerCase()] = status._count.id;
          return acc;
        }, {})
      },
      enrollments: {
        total: totalEnrollments
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        currency: 'EUR'
      },
      popularCourses
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [
      myCourses,
      totalStudents,
      totalRevenue,
      recentEnrollments
    ] = await Promise.all([
      // Teacher's courses
      prisma.course.findMany({
        where: { teacherId },
        include: {
          _count: {
            select: {
              lessons: true,
              enrollments: true
            }
          }
        }
      }),
      
      // Total students across all courses
      prisma.enrollment.count({
        where: {
          course: {
            teacherId
          }
        }
      }),
      
      // Revenue from teacher's courses
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'succeeded',
          // This would need a relation through enrollments
        }
      }),
      
      // Recent enrollments
      prisma.enrollment.findMany({
        take: 10,
        where: {
          course: {
            teacherId
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          course: {
            select: {
              title: true
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      })
    ];
    )

    const stats = {
      courses: {
        total: myCourses.length,
        published: myCourses.filter(c => c.status === 'PUBLISHED').length,
        draft: myCourses.filter(c => c.status === 'DRAFT').length
      },
      students: {
        total: totalStudents
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        currency: 'EUR'
      },
      recentEnrollments,
      courseDetails: myCourses
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({
      message: 'Error fetching teacher statistics',
      error: error.message
    });
  }
};

const getStudentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      enrollments,
      completedLessons,
      quizAttempts,
      totalTimeSpent
    ] = await Promise.all([
      // Student enrollments
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              level: true,
              _count: {
                select: { lessons: true }
              }
            }
          }
        }
      }),
      
      // Completed lessons
      prisma.progress.count({
        where: {
          userId,
          completed: true
        }
      }),
      
      // Quiz attempts
      prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              title: true,
              lesson: {
                select: {
                  title: true,
                  course: {
                    select: {
                      title: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { attemptedAt: 'desc' },
        take: 10
      }),
      
      // Total time spent
      prisma.progress.aggregate({
        _sum: { timeSpent: true },
        where: { userId }
      })
    ];
    )

    const stats = {
      enrollments: {
        total: enrollments.length,
        courses: enrollments
      },
      progress: {
        completedLessons,
        totalTimeSpent: totalTimeSpent._sum.timeSpent || 0
      },
      quizzes: {
        totalAttempts: quizAttempts.length,
        averageScore: quizAttempts.length > 0 
          ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length 
          : 0,
        recentAttempts: quizAttempts
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      message: 'Error fetching student statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  getTeacherStats,
  getStudentStats
};