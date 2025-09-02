import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const useCourses = (params?: {
  page?: number;
  limit?: number;
  level?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => apiClient.getCourses(params),
    keepPreviousData: true,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => apiClient.getCourseById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: any) => apiClient.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Cours créé avec succès !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création du cours');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      apiClient.updateCourse(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Cours mis à jour !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Cours supprimé !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression');
    },
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => apiClient.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      queryClient.invalidateQueries(['courses']);
      toast.success('Inscription réussie !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    },
  });
};

export const useUserEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: () => apiClient.getUserEnrollments(),
  });
};