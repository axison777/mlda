import { create } from 'zustand';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  image: string;
  category: string;
  status: 'published' | 'draft' | 'pending';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'audio' | 'quiz';
  order: number;
}

interface CourseStore {
  courses: Course[];
  lessons: Lesson[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addLesson: (lesson: Lesson) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [
    {
      id: '1',
      title: 'Allemand pour débutants',
      description: 'Apprenez les bases de la langue allemande',
      price: 49,
      level: 'beginner',
      instructor: 'Dr. Mueller',
      duration: '8 semaines',
      students: 245,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg',
      category: 'Langues',
      status: 'published',
    },
    {
      id: '2',
      title: 'Allemand des affaires',
      description: 'Perfectionnez votre allemand professionnel',
      price: 89,
      level: 'advanced',
      instructor: 'Prof. Schmidt',
      duration: '12 semaines',
      students: 156,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
      category: 'Business',
      status: 'published',
    },
  ],
  lessons: [],
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, updates) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      ),
    })),
  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    })),
  addLesson: (lesson) => set((state) => ({ lessons: [...state.lessons, lesson] })),
}));