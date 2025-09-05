import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      const userData = {
        id: data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        role: data.user.role.toLowerCase() === 'teacher' ? 'professor' : data.user.role.toLowerCase() as any,
        avatar: data.user.avatar,
      };
      
      apiClient.setToken(data.token);
      login(userData, data.token);
      
      toast.success('Connexion réussie !');
      
      // Redirect based on role
      setTimeout(() => {
        switch (userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'professor':
            navigate('/professor');
            break;
          default:
            navigate('/student');
        }
      }, 100);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur de connexion');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: string;
    }) => apiClient.register(userData),
    onSuccess: (data) => {
      const userData = {
        id: data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        role: data.user.role.toLowerCase() === 'teacher' ? 'professor' : data.user.role.toLowerCase() as any,
        avatar: data.user.avatar,
      };
      
      apiClient.setToken(data.token);
      login(userData, data.token);
      
      toast.success('Inscription réussie !');
      
      // Redirect based on role
      setTimeout(() => {
        switch (userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'professor':
            navigate('/professor');
            break;
          default:
            navigate('/student');
        }
      }, 100);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur d\'inscription');
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: !!user,
    retry: false,
    onError: (error: any) => {
      if (error.message.includes('token') || error.message.includes('401')) {
        logout();
        navigate('/login');
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: any) => apiClient.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success('Profil mis à jour !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur de mise à jour');
    },
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    updateProfile: updateProfileMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    profile: profileQuery.data?.user,
  };
};