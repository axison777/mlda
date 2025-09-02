const request = require('supertest');
const app = require('../src/server');

describe('Course Endpoints', () => {
  let adminToken, teacherToken, studentToken;
  let teacherId;

  beforeEach(async () => {
    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      });
    adminToken = adminResponse.body.token;

    // Create teacher user
    const teacherResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'teacher@test.com',
        password: 'password123',
        firstName: 'Teacher',
        lastName: 'User',
        role: 'TEACHER'
      });
    teacherToken = teacherResponse.body.token;
    teacherId = teacherResponse.body.user.id;

    // Create student user
    const studentResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'student@test.com',
        password: 'password123',
        firstName: 'Student',
        lastName: 'User'
      });
    studentToken = studentResponse.body.token;
  });

  describe('POST /api/courses', () => {
    it('should allow teacher to create course', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'A test course for learning German',
        price: 49.99,
        level: 'A1',
        duration: 120
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Course created successfully');
      expect(response.body.course.title).toBe(courseData.title);
      expect(response.body.course.teacherId).toBe(teacherId);
    });

    it('should reject course creation by student', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'A test course',
        level: 'A1',
        duration: 120
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(courseData)
        .expect(403);

      expect(response.body.message).toContain('Insufficient permissions');
    });
  });

  describe('GET /api/courses', () => {
    beforeEach(async () => {
      // Create a test course
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Published Course',
          description: 'A published course',
          level: 'A1',
          duration: 120
        });
    });

    it('should return courses for authenticated users', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('courses');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.courses)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(401);

      expect(response.body.message).toBe('Access token required');
    });
  });
});