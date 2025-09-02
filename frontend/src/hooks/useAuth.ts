import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      const userData = {
        id: data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        role: data.user.role.toLowerCase() as any,
        avatar: data.user.avatar,
      };
      
      apiClient.setToken(data.token);
      login(userData);
      
      // Store token separately for API client
      localStorage.setItem('mlda-token', data.token);
      
      toast.success('Connexion réussie !');
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
        role: data.user.role.toLowerCase() as any,
        avatar: data.user.avatar,
      };
      
      apiClient.setToken(data.token);
      login(userData);
      
      localStorage.setItem('mlda-token', data.token);
      
      toast.success('Inscription réussie !');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur d\'inscription');
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: !!user,
    onError: (error: any) => {
      if (error.message.includes('token') || error.message.includes('401')) {
        logout();
        localStorage.removeItem('mlda-token');
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
    localStorage.removeItem('mlda-token');
    queryClient.clear();
    toast.success('Déconnexion réussie');
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    updateProfile: updateProfileMutation.mutate,
    isLoading: loginMutation.isLoading || registerMutation.isLoading,
    profile: profileQuery.data?.user,
  };
};