const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mlda.de' },
    update: {},
    create: {
      email: 'admin@mlda.de',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'MLDA',
      role: 'ADMIN'
    }
  });

  // Create teacher users
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacher1 = await prisma.user.upsert({
    where: { email: 'hans.mueller@mlda.de' },
    update: {},
    create: {
      email: 'hans.mueller@mlda.de',
      password: teacherPassword,
      firstName: 'Hans',
      lastName: 'Mueller',
      role: 'TEACHER'
    }
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'anna.schmidt@mlda.de' },
    update: {},
    create: {
      email: 'anna.schmidt@mlda.de',
      password: teacherPassword,
      firstName: 'Anna',
      lastName: 'Schmidt',
      role: 'TEACHER'
    }
  });

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 12);
  const student1 = await prisma.user.upsert({
    where: { email: 'marie.dubois@email.com' },
    update: {},
    create: {
      email: 'marie.dubois@email.com',
      password: studentPassword,
      firstName: 'Marie',
      lastName: 'Dubois',
      role: 'STUDENT'
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'pierre.martin@email.com' },
    update: {},
    create: {
      email: 'pierre.martin@email.com',
      password: studentPassword,
      firstName: 'Pierre',
      lastName: 'Martin',
      role: 'STUDENT'
    }
  });

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Allemand pour débutants',
      description: 'Apprenez les bases de la langue allemande avec des méthodes modernes et interactives.',
      price: 49.99,
      level: 'A1',
      duration: 480, // 8 hours
      status: 'PUBLISHED',
      featured: true,
      teacherId: teacher1.id
    }
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      title: 'Grammaire allemande avancée',
      description: 'Perfectionnez votre maîtrise de la grammaire allemande.',
      price: 79.99,
      level: 'B2',
      duration: 360, // 6 hours
      status: 'PUBLISHED',
      teacherId: teacher2.id
    }
  });

  // Create lessons
  const lessons = [
    {
      title: 'Introduction à l\'allemand',
      description: 'Première approche de la langue allemande',
      content: 'Bienvenue dans votre premier cours d\'allemand...',
      duration: 20,
      order: 1,
      isPublished: true,
      courseId: course1.id
    },
    {
      title: 'L\'alphabet allemand',
      description: 'Apprenez à prononcer l\'alphabet allemand',
      content: 'L\'alphabet allemand contient 26 lettres...',
      duration: 15,
      order: 2,
      isPublished: true,
      courseId: course1.id
    },
    {
      title: 'Les salutations',
      description: 'Comment saluer en allemand',
      content: 'Guten Tag, Guten Morgen, Guten Abend...',
      duration: 18,
      order: 3,
      isPublished: true,
      courseId: course1.id
    }
  ];

  for (const lessonData of lessons) {
    await prisma.lesson.create({
      data: lessonData
    });
  }

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course1.id
    }
  });

  // Create announcements
  await prisma.announcement.create({
    data: {
      title: 'Bienvenue sur MLDA !',
      content: 'Nous sommes ravis de vous accueillir sur notre plateforme d\'apprentissage de l\'allemand.',
      targetRole: 'STUDENT',
      isActive: true
    }
  });

  // Create sample products
  await prisma.product.create({
    data: {
      name: 'Manuel d\'allemand A1 - Débutant',
      description: 'Manuel complet pour apprendre les bases de l\'allemand avec exercices et audio.',
      price: 29.99,
      discount: 20,
      discountType: 'percentage',
      images: [
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'
      ],
      category: 'Livres',
      stock: 50
    }
  });

  await prisma.product.create({
    data: {
      name: 'Dictionnaire Allemand-Français',
      description: 'Dictionnaire complet avec plus de 50,000 mots et expressions.',
      price: 45.00,
      images: [
        'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg'
      ],
      category: 'Livres',
      stock: 25
    }
  });

  await prisma.product.create({
    data: {
      name: 'Cartes de vocabulaire allemand',
      description: 'Set de 500 cartes pour mémoriser le vocabulaire essentiel.',
      price: 19.99,
      discount: 5,
      discountType: 'fixed',
      images: [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
      ],
      category: 'Matériel',
      stock: 100
    }
  });
  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@mlda.de / admin123');
  console.log('👨‍🏫 Teacher: hans.mueller@mlda.de / teacher123');
  console.log('👩‍🎓 Student: marie.dubois@email.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });