import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type Tier = 'free' | 'basic' | 'pro' | 'elite';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tier: Tier;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (updates: Partial<User>) => void;
  setTier: (tier: Tier) => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

const MASTER_ACCESS_CODE = process.env.MASTER_ACCESS_CODE || 'QEMPIRE-MASTER-2024';
const PROMO_CODES: Record<string, { tier: Tier; duration: number; discount: number }> = {
  'WELCOME50': { tier: 'basic', duration: 30, discount: 0.5 },
  'PROTRIAL': { tier: 'pro', duration: 14, discount: 1.0 },
  'ELITE2024': { tier: 'elite', duration: 7, discount: 0.25 },
  'LAUNCH': { tier: 'pro', duration: 30, discount: 0.3 },
  'FRIEND': { tier: 'basic', duration: 30, discount: 0.2 },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call - replace with real auth
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: 'user_' + Date.now(),
            email,
            name: email.split('@')[0],
            tier: 'free',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      setTier: (tier: Tier) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, tier } });
        }
      },

      initializeAuth: async () => {
        // Check for stored auth state
        const stored = await AsyncStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.state?.user) {
            set({ 
              user: parsed.state.user, 
              isAuthenticated: true,
              hasCompletedOnboarding: parsed.state.hasCompletedOnboarding || false,
            });
          }
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function validateMasterCode(code: string): boolean {
  return code === MASTER_ACCESS_CODE;
}

export function validatePromoCode(code: string): { valid: boolean; tier?: Tier; duration?: number; discount?: number } {
  const upperCode = code.toUpperCase();
  const promo = PROMO_CODES[upperCode];
  if (promo) {
    return { valid: true, ...promo };
  }
  return { valid: false };
}
