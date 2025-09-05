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
  login: (user: User, token?: string) => void;
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
        if (token) {
          apiClient.setToken(token);
          localStorage.setItem('mlda-token', token);
        }
        set({ user, token: token ?? get().token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('mlda-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        const token = localStorage.getItem('mlda-token');
        if (token) {
          apiClient.setToken(token);
          // Keep existing user from persisted state if present
          set({ token, isAuthenticated: !!get().user });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'mlda-auth',
    }
  )
);