import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Platform {
  id: string;
  name: string;
  emoji: string;
  connected: boolean;
  credentials?: Record<string, string>;
  lastPostAt?: string;
  status: 'active' | 'error' | 'disconnected' | 'rate_limited';
  errorMessage?: string;
  postsToday: number;
  totalPosts: number;
}

interface PlatformState {
  platforms: Platform[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPlatforms: (platforms: Platform[]) => void;
  connectPlatform: (id: string, credentials: Record<string, string>) => Promise<void>;
  disconnectPlatform: (id: string) => void;
  updatePlatformStatus: (id: string, status: Platform['status'], errorMessage?: string) => void;
  incrementPostCount: (id: string) => void;
  resetDailyCounts: () => void;
  getConnectedCount: () => number;
  getActiveCount: () => number;
  initializePlatforms: () => Promise<void>;
}

const DEFAULT_PLATFORMS: Platform[] = [
  { id: 'facebook', name: 'Facebook', emoji: '📘', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'instagram', name: 'Instagram', emoji: '📸', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'twitter', name: 'X/Twitter', emoji: '🐦', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'pinterest', name: 'Pinterest', emoji: '📌', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'youtube', name: 'YouTube', emoji: '▶️', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'reddit', name: 'Reddit', emoji: '🔴', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'threads', name: 'Threads', emoji: '🧵', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'tumblr', name: 'Tumblr', emoji: '📝', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'medium', name: 'Medium', emoji: '✍️', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'mastodon', name: 'Mastodon', emoji: '🐘', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'discord', name: 'Discord', emoji: '💬', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'telegram', name: 'Telegram', emoji: '✈️', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'whatsapp', name: 'WhatsApp', emoji: '📱', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'snapchat', name: 'Snapchat', emoji: '👻', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'bluesky', name: 'Bluesky', emoji: '🦋', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'wordpress', name: 'WordPress', emoji: '🌐', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'blogger', name: 'Blogger', emoji: '📰', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'mix', name: 'Mix', emoji: '🔀', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'quora', name: 'Quora', emoji: '❓', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'vk', name: 'VK', emoji: '🔵', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'weibo', name: 'Weibo', emoji: '🇨🇳', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'line', name: 'LINE', emoji: '💚', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
  { id: 'kakao', name: 'KakaoTalk', emoji: '💛', connected: false, status: 'disconnected', postsToday: 0, totalPosts: 0 },
];

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      platforms: DEFAULT_PLATFORMS,
      isLoading: false,
      error: null,

      setPlatforms: (platforms) => set({ platforms }),

      connectPlatform: async (id, credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API connection
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          set(state => ({
            platforms: state.platforms.map(p => 
              p.id === id 
                ? { ...p, connected: true, status: 'active', credentials, errorMessage: undefined }
                : p
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to connect platform', isLoading: false });
        }
      },

      disconnectPlatform: (id) => {
        set(state => ({
          platforms: state.platforms.map(p => 
            p.id === id 
              ? { ...p, connected: false, status: 'disconnected', credentials: undefined }
              : p
          ),
        }));
      },

      updatePlatformStatus: (id, status, errorMessage) => {
        set(state => ({
          platforms: state.platforms.map(p => 
            p.id === id ? { ...p, status, errorMessage } : p
          ),
        }));
      },

      incrementPostCount: (id) => {
        set(state => ({
          platforms: state.platforms.map(p => 
            p.id === id 
              ? { ...p, postsToday: p.postsToday + 1, totalPosts: p.totalPosts + 1 }
              : p
          ),
        }));
      },

      resetDailyCounts: () => {
        set(state => ({
          platforms: state.platforms.map(p => ({ ...p, postsToday: 0 })),
        }));
      },

      getConnectedCount: () => {
        return get().platforms.filter(p => p.connected).length;
      },

      getActiveCount: () => {
        return get().platforms.filter(p => p.status === 'active').length;
      },

      initializePlatforms: async () => {
        // Load from storage or API
        const stored = await AsyncStorage.getItem('platform-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.state?.platforms) {
            set({ platforms: parsed.state.platforms });
          }
        }
      },
    }),
    {
      name: 'platform-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
