import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BrandProfile {
  url: string;
  brandName: string;
  description: string;
  keywords: string[];
  tone: string;
  productsServices: string[];
  targetAudience: string;
  contentThemes: string[];
  colorScheme: string[];
  socialLinks: { platform: string; url: string }[];
  lastAnalyzed: string;
}

interface BrandState {
  profile: BrandProfile | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Actions
  setProfile: (profile: BrandProfile) => void;
  clearProfile: () => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (updates: Partial<BrandProfile>) => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set, get) => ({
      profile: null,
      isAnalyzing: false,
      analysisError: null,

      setProfile: (profile) => {
        set({ profile, isAnalyzing: false, analysisError: null });
      },

      clearProfile: () => {
        set({ profile: null, isAnalyzing: false, analysisError: null });
      },

      setAnalyzing: (isAnalyzing) => {
        set({ isAnalyzing, analysisError: null });
      },

      setError: (error) => {
        set({ analysisError: error, isAnalyzing: false });
      },

      updateProfile: (updates) => {
        const { profile } = get();
        if (profile) {
          set({ profile: { ...profile, ...updates } });
        }
      },
    }),
    {
      name: 'brand-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
