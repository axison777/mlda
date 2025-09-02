const Joi = require('joi');

// Common validation patterns
const patterns = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }),
  name: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s-']+$/).required()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  role: Joi.string().valid('ADMIN', 'TEACHER', 'STUDENT', 'VISITOR'),
  level: Joi.string().valid('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
  status: Joi.string().valid('DRAFT', 'PENDING', 'PUBLISHED', 'FEATURED', 'ARCHIVED'),
  price: Joi.number().min(0).max(999.99),
  duration: Joi.number().min(1).max(10080), // max 1 week in minutes
  url: Joi.string().uri(),
  id: Joi.string().cuid()
};

// Extended validation schemas
const extendedAuthSchemas = {
  register: Joi.object({
    email: patterns.email,
    password: patterns.password,
    firstName: patterns.name,
    lastName: patterns.name,
    role: patterns.role.default('STUDENT')
  }),
  
  login: Joi.object({
    email: patterns.email,
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: patterns.name.optional(),
    lastName: patterns.name.optional(),
    avatar: patterns.url.optional()
  }).min(1),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: patterns.password
  })
};

const extendedCourseSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    price: patterns.price.default(0),
    level: patterns.level.required(),
    duration: patterns.duration.required(),
    thumbnail: patterns.url.optional()
  }),
  
  update: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(10).max(2000),
    price: patterns.price,
    level: patterns.level,
    duration: patterns.duration,
    status: patterns.status,
    featured: Joi.boolean(),
    thumbnail: patterns.url
  }).min(1),

  enroll: Joi.object({
    courseId: patterns.id.required()
  })
};

const extendedLessonSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(500),
    content: Joi.string().min(10).required(),
    videoUrl: patterns.url,
    duration: patterns.duration.required(),
    order: Joi.number().min(1).required(),
    courseId: patterns.id.required()
  }),
  
  update: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(500),
    content: Joi.string().min(10),
    videoUrl: patterns.url,
    duration: patterns.duration,
    order: Joi.number().min(1),
    isPublished: Joi.boolean()
  }).min(1)
};

const extendedQuizSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(500),
    timeLimit: Joi.number().min(1).max(180), // max 3 hours
    passingScore: Joi.number().min(0).max(100).default(70),
    lessonId: patterns.id.required(),
    questions: Joi.array().items(
      Joi.object({
        question: Joi.string().min(5).required(),
        options: Joi.array().items(Joi.string()).min(2).max(6).required(),
        correctAnswer: Joi.string().required(),
        explanation: Joi.string().max(500)
      })
    ).min(1).max(50).required()
  }),

  attempt: Joi.object({
    answers: Joi.array().items(Joi.string()).required(),
    timeSpent: Joi.number().min(1).required()
  })
};

const paymentSchemas = {
  createIntent: Joi.object({
    courseId: patterns.id.required(),
    amount: patterns.price.required()
  })
};

const announcementSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    content: Joi.string().min(10).required(),
    image: patterns.url,
    targetRole: patterns.role,
    startDate: Joi.date().default(() => new Date()),
    endDate: Joi.date().greater(Joi.ref('startDate'))
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200),
    content: Joi.string().min(10),
    image: patterns.url,
    targetRole: patterns.role,
    isActive: Joi.boolean(),
    startDate: Joi.date(),
    endDate: Joi.date()
  }).min(1)
};

module.exports = {
  patterns,
  authSchemas: extendedAuthSchemas,
  courseSchemas: extendedCourseSchemas,
  lessonSchemas: extendedLessonSchemas,
  quizSchemas: extendedQuizSchemas,
  paymentSchemas,
  announcementSchemas
};