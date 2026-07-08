import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_LIMITS } from '@/constants/config';
import { validatePromoCode, validateMasterCode } from './authStore';

export type Tier = 'free' | 'basic' | 'pro' | 'elite';

interface SubscriptionState {
  currentTier: Tier;
  isPremium: boolean;
  trialEndDate: string | null;
  promoCodeApplied: string | null;
  discountApplied: number;
  expiryDate: string | null;
  autoRenew: boolean;
  
  // Actions
  setTier: (tier: Tier) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  applyMasterCode: (code: string) => { success: boolean; message: string };
  cancelSubscription: () => void;
  toggleAutoRenew: () => void;
  checkExpiry: () => boolean;
  initializeSubscription: () => Promise<void>;
  getLimits: () => typeof SUBSCRIPTION_LIMITS[Tier];
  canUseFeature: (feature: keyof typeof SUBSCRIPTION_LIMITS[Tier]) => boolean | number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      currentTier: 'free',
      isPremium: false,
      trialEndDate: null,
      promoCodeApplied: null,
      discountApplied: 0,
      expiryDate: null,
      autoRenew: true,

      setTier: (tier: Tier) => {
        const isPremium = tier !== 'free';
        const expiryDate = isPremium 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
          : null;
        
        set({ 
          currentTier: tier, 
          isPremium,
          expiryDate,
        });
      },

      applyPromoCode: (code: string) => {
        const promo = validatePromoCode(code);
        if (!promo.valid) {
          return { success: false, message: 'Invalid promo code' };
        }

        const expiryDate = new Date(Date.now() + (promo.duration || 30) * 24 * 60 * 60 * 1000).toISOString();
        
        set({
          currentTier: promo.tier || 'basic',
          isPremium: true,
          promoCodeApplied: code,
          discountApplied: promo.discount || 0,
          expiryDate,
          trialEndDate: expiryDate,
        });

        return { 
          success: true, 
          message: `Promo code applied! ${promo.tier} tier activated for ${promo.duration} days.` 
        };
      },

      applyMasterCode: (code: string) => {
        if (!validateMasterCode(code)) {
          return { success: false, message: 'Invalid master code' };
        }

        set({
          currentTier: 'elite',
          isPremium: true,
          promoCodeApplied: 'MASTER',
          discountApplied: 1,
          expiryDate: null, // Never expires
          autoRenew: true,
        });

        return { success: true, message: 'Master access granted! Elite tier unlocked permanently.' };
      },

      cancelSubscription: () => {
        set({
          currentTier: 'free',
          isPremium: false,
          expiryDate: null,
          autoRenew: false,
        });
      },

      toggleAutoRenew: () => {
        set(state => ({ autoRenew: !state.autoRenew }));
      },

      checkExpiry: () => {
        const { expiryDate } = get();
        if (!expiryDate) return true;
        
        const isExpired = new Date(expiryDate) < new Date();
        if (isExpired) {
          set({
            currentTier: 'free',
            isPremium: false,
            expiryDate: null,
          });
        }
        return !isExpired;
      },

      initializeSubscription: async () => {
        // Check if stored subscription is expired
        get().checkExpiry();
      },

      getLimits: () => {
        return SUBSCRIPTION_LIMITS[get().currentTier];
      },

      canUseFeature: (feature) => {
        const limits = get().getLimits();
        const value = limits[feature];
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value > 0;
        return false;
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
