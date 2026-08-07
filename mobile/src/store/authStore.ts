import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  // User auth
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  hasCompletedOnboarding: boolean;

  // Admin auth
  isAdmin: boolean;
  adminToken: string | null;

  // Actions
  login: (user: any, token: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  initializeAuth: () => Promise<void>;

  // Admin actions
  adminLogin: () => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      hasCompletedOnboarding: false,
      isAdmin: false,
      adminToken: null,

      login: (user, token) => {
        set({ isAuthenticated: true, user, token });
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, token: null, isAdmin: false, adminToken: null });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      initializeAuth: async () => {
        // Check for stored auth state
        // In a real app, validate token with backend
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedAdminToken = await AsyncStorage.getItem('admin_token');

        if (storedAdminToken) {
          set({ isAdmin: true, adminToken: storedAdminToken });
        }

        if (storedToken) {
          // Validate token here in production
          set({ isAuthenticated: true, token: storedToken });
        }
      },

      adminLogin: () => {
        const adminToken = 'admin_' + Date.now();
        AsyncStorage.setItem('admin_token', adminToken);
        set({ isAdmin: true, adminToken, isAuthenticated: true });
      },

      adminLogout: () => {
        AsyncStorage.removeItem('admin_token');
        set({ isAdmin: false, adminToken: null, isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: 'qempire-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
        adminToken: state.adminToken,
      }),
    }
  )
);
