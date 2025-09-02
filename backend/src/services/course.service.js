const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class CourseService {
  async findCourses(filters, pagination, userRole, userId) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = this.buildCourseFilters(filters, userRole, userId);

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.course.count({ where })
    ]);

    return {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  buildCourseFilters(filters, userRole, userId) {
    const where = {};

    // Level filter
    if (filters.level) {
      where.level = filters.level.toUpperCase();
    }

    // Status filter based on role
    if (userRole === 'ADMIN') {
      if (filters.status) where.status = filters.status.toUpperCase();
    } else if (userRole === 'TEACHER') {
      where.teacherId = userId;
      if (filters.status) where.status = filters.status.toUpperCase();
    } else {
      where.status = 'PUBLISHED';
    }

    // Featured filter
    if (filters.featured === 'true') {
      where.featured = true;
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return where;
  }

  async findCourseById(id, userRole, userId) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        lessons: {
          where: userRole === 'STUDENT' ? { isPublished: true } : {},
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            isPublished: true,
            _count: {
              select: { quizzes: true }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) return null;

    // Check permissions
    if (course.status !== 'PUBLISHED' && 
        userRole !== 'ADMIN' && 
        course.teacherId !== userId) {
      return null;
    }

    return course;
  }

  async createCourse(courseData, teacherId) {
    return await prisma.course.create({
      data: {
        ...courseData,
        level: courseData.level.toUpperCase(),
        teacherId
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async updateCourse(id, updates, userRole, userId) {
    // Check permissions
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) return null;

    if (userRole === 'TEACHER' && existingCourse.teacherId !== userId) {
      throw new Error('Not authorized to update this course');
    }

    // Teachers cannot change status
    if (userRole === 'TEACHER' && updates.status) {
      delete updates.status;
    }

    return await prisma.course.update({
      where: { id },
      data: updates,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async deleteCourse(id, userRole, userId) {
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) return null;

    if (userRole === 'TEACHER' && existingCourse.teacherId !== userId) {
      throw new Error('Not authorized to delete this course');
    }

    await prisma.course.delete({
      where: { id }
    });

    return true;
  }
}

module.exports = new CourseService();