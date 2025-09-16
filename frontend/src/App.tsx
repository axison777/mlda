import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// Layouts
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';

// Dashboard Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UsersManagement } from '@/pages/admin/UsersManagement';
import { CoursesManagement } from '@/pages/admin/CoursesManagement';
import { PaymentsManagement } from '@/pages/admin/PaymentsManagement';
import { AdsManagement } from '@/pages/admin/AdsManagement';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { ProfessorDashboard } from '@/pages/professor/ProfessorDashboard';
import { MyCourses as ProfessorCourses } from '@/pages/professor/MyCourses';
import { CreateCourse } from '@/pages/professor/CreateCourse';
import { LessonsQuiz } from '@/pages/professor/LessonsQuiz';
import { MyStudents } from '@/pages/professor/MyStudents';
import { ProfessorProfile } from '@/pages/professor/ProfessorProfile';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { MyCourses as StudentCourses } from '@/pages/student/MyCourses';
import { ContinueCourse } from '@/pages/student/ContinueCourse';
import { Subscriptions } from '@/pages/student/Subscriptions';
import { StudentProfile } from '@/pages/student/StudentProfile';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="courses" element={<CoursesManagement />} />
            <Route path="payments" element={<PaymentsManagement />} />
            <Route path="ads" element={<AdsManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="/professor/*"
            element={
              <ProtectedRoute requiredRole="professor">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfessorDashboard />} />
            <Route path="courses" element={<ProfessorCourses />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="lessons" element={<LessonsQuiz />} />
            <Route path="students" element={<MyStudents />} />
            <Route path="profile" element={<ProfessorProfile />} />
          </Route>

          <Route
            path="/student/*"
            element={
              <ProtectedRoute requiredRole="student">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="continue" element={<ContinueCourse />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
  );
}

export default App;