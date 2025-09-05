import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';

export type UserRole = 'admin' | 'professor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        apiClient.setToken(token);
        localStorage.setItem('mlda-token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('mlda-token');
        apiClient.setToken('');
        set({ user: null, token: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = localStorage.getItem('mlda-token');
        if (token) {
          apiClient.setToken(token);
          const existingUser = get().user;
          if (existingUser) {
            set({ token, isAuthenticated: true });
          }
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'mlda-auth',
      partialize: (state) => ({ user: state.user }), // Only persist user, not token
    }
  )
);