import * as Linking from 'expo-linking';
import { useEffect } from 'react';

const prefix = 'qempire://';

export const linking = {
  prefixes: [prefix, 'https://qempireai.com'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Login: 'login',
      MainTabs: {
        screens: {
          Dashboard: 'dashboard',
          Platforms: 'platforms',
          Content: 'content',
          Analytics: 'analytics',
          Settings: 'settings',
        },
      },
      WebsiteAnalysis: 'analyze',
      PlatformDetail: 'platform/:platformId',
      GenerateContent: 'generate',
      PostEditor: 'edit/:postId',
      AutopilotConfig: 'autopilot',
      Notifications: 'notifications',
      Subscription: 'subscription',
      PromoCode: 'promo',
      Referral: 'referral/:code',
      AIFeatures: 'ai',
      Support: 'support',
    },
  },
};

export async function initializeDeepLinks() {
  // Handle initial URL
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleDeepLink(initialUrl);
  }

  // Listen for incoming links
  Linking.addEventListener('url', (event) => {
    handleDeepLink(event.url);
  });
}

function handleDeepLink(url: string) {
  console.log('Deep link received:', url);
  
  // Parse the URL and handle navigation
  const { path, queryParams } = Linking.parse(url);
  
  // Handle specific deep link patterns
  if (path?.includes('promo')) {
    // Navigate to promo code screen with code
    const code = queryParams?.code as string;
    console.log('Promo code from deep link:', code);
  }
  
  if (path?.includes('referral')) {
    // Handle referral code
    const referralCode = queryParams?.code as string;
    console.log('Referral code from deep link:', referralCode);
  }
}
