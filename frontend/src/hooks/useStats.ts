import { useQuery } from 'react-query';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export const useStats = () => {
  const { user } = useAuthStore();

  const adminStatsQuery = useQuery({
    queryKey: ['stats', 'admin'],
    queryFn: () => apiClient.getAdminStats(),
    enabled: user?.role === 'admin',
  });

  const teacherStatsQuery = useQuery({
    queryKey: ['stats', 'teacher'],
    queryFn: () => apiClient.getTeacherStats(),
    enabled: user?.role === 'professor',
  });

  const studentStatsQuery = useQuery({
    queryKey: ['stats', 'student'],
    queryFn: () => apiClient.getStudentStats(),
    enabled: user?.role === 'student',
  });

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return adminStatsQuery;
      case 'professor':
        return teacherStatsQuery;
      case 'student':
        return studentStatsQuery;
      default:
        return { data: null, isLoading: false, error: null };
    }
  };

  return getStatsForRole();
};