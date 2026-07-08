import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Post {
  id: string;
  batchId: string;
  platformId: string;
  platformName: string;
  content: string;
  hashtags: string[];
  imageDescription?: string;
  mediaUrls?: string[];
  characterCount: number;
  engagementScore: number;
  status: 'draft' | 'queued' | 'publishing' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentState {
  posts: Post[];
  queue: Post[];
  history: Post[];
  isGenerating: boolean;
  isPublishing: boolean;
  generationProgress: number;
  error: string | null;
  
  // Actions
  addPosts: (posts: Post[]) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  removePost: (id: string) => void;
  queuePost: (id: string) => void;
  publishPost: (id: string) => Promise<void>;
  publishBatch: (batchId: string) => Promise<void>;
  setGenerating: (isGenerating: boolean, progress?: number) => void;
  setPublishing: (isPublishing: boolean) => void;
  clearQueue: () => void;
  getQueue: () => Post[];
  getHistory: () => Post[];
  getStats: () => { total: number; published: number; failed: number; queued: number; draft: number };
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      posts: [],
      queue: [],
      history: [],
      isGenerating: false,
      isPublishing: false,
      generationProgress: 0,
      error: null,

      addPosts: (posts) => {
        set(state => ({
          posts: [...state.posts, ...posts],
          queue: [...state.queue, ...posts.filter(p => p.status === 'queued')],
        }));
      },

      updatePost: (id, updates) => {
        set(state => ({
          posts: state.posts.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
          queue: state.queue.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
          history: state.history.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
        }));
      },

      removePost: (id) => {
        set(state => ({
          posts: state.posts.filter(p => p.id !== id),
          queue: state.queue.filter(p => p.id !== id),
          history: state.history.filter(p => p.id !== id),
        }));
      },

      queuePost: (id) => {
        const post = get().posts.find(p => p.id === id);
        if (post) {
          set(state => ({
            queue: [...state.queue, { ...post, status: 'queued' as const }],
          }));
        }
      },

      publishPost: async (id) => {
        set({ isPublishing: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          set(state => ({
            posts: state.posts.map(p => 
              p.id === id 
                ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
                : p
            ),
            queue: state.queue.filter(p => p.id !== id),
            history: [...state.history, state.posts.find(p => p.id === id)!].filter(Boolean),
            isPublishing: false,
          }));
        } catch (error) {
          set({ error: 'Failed to publish post', isPublishing: false });
        }
      },

      publishBatch: async (batchId) => {
        set({ isPublishing: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const batchPosts = get().posts.filter(p => p.batchId === batchId);
          
          set(state => ({
            posts: state.posts.map(p => 
              p.batchId === batchId 
                ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
                : p
            ),
            queue: state.queue.filter(p => p.batchId !== batchId),
            history: [...state.history, ...batchPosts],
            isPublishing: false,
          }));
        } catch (error) {
          set({ error: 'Failed to publish batch', isPublishing: false });
        }
      },

      setGenerating: (isGenerating, progress = 0) => {
        set({ isGenerating, generationProgress: progress });
      },

      setPublishing: (isPublishing) => {
        set({ isPublishing });
      },

      clearQueue: () => {
        set({ queue: [] });
      },

      getQueue: () => get().queue,
      getHistory: () => get().history,
      
      getStats: () => {
        const { posts } = get();
        return {
          total: posts.length,
          published: posts.filter(p => p.status === 'published').length,
          failed: posts.filter(p => p.status === 'failed').length,
          queued: posts.filter(p => p.status === 'queued').length,
          draft: posts.filter(p => p.status === 'draft').length,
        };
      },
    }),
    {
      name: 'content-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
