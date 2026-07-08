import { Platform } from 'react-native';

export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api'
  : 'https://api.qempireai.com/api';

export const HF_API_BASE = 'https://api-inference.huggingface.co';
export const HF_MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.3';
export const HF_FALLBACK_MODEL = 'HuggingFaceH4/zephyr-7b-beta';

export const APP_CONFIG = {
  name: 'Q-Empire Social Autopilot',
  version: '1.0.0',
  buildNumber: '1',
  supportEmail: 'support@qempireai.com',
  supportPhone: '(928) 490-0209',
  website: 'https://qempireai.com',
  github: 'https://github.com/michellemcbean5-droid/qempire-social-autopilot',
  privacyPolicy: 'https://qempireai.com/privacy',
  termsOfService: 'https://qempireai.com/terms',
};

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ELITE: 'elite',
} as const;

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxPlatforms: 3,
    maxPostsPerDay: 5,
    aiGenerationsPerDay: 10,
    analyticsRetention: 7, // days
    autopilotEnabled: false,
    customSchedules: false,
    advancedAnalytics: false,
    apiAccess: false,
    prioritySupport: false,
    teamMembers: 1,
    price: 0,
    priceDisplay: 'Free',
  },
  [SUBSCRIPTION_TIERS.BASIC]: {
    maxPlatforms: 10,
    maxPostsPerDay: 25,
    aiGenerationsPerDay: 50,
    analyticsRetention: 30,
    autopilotEnabled: true,
    customSchedules: true,
    advancedAnalytics: false,
    apiAccess: false,
    prioritySupport: false,
    teamMembers: 1,
    price: 19.99,
    priceDisplay: '$19.99/mo',
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    maxPlatforms: 25,
    maxPostsPerDay: 100,
    aiGenerationsPerDay: 200,
    analyticsRetention: 90,
    autopilotEnabled: true,
    customSchedules: true,
    advancedAnalytics: true,
    apiAccess: true,
    prioritySupport: true,
    teamMembers: 3,
    price: 49.99,
    priceDisplay: '$49.99/mo',
  },
  [SUBSCRIPTION_TIERS.ELITE]: {
    maxPlatforms: 25,
    maxPostsPerDay: 500,
    aiGenerationsPerDay: 1000,
    analyticsRetention: 365,
    autopilotEnabled: true,
    customSchedules: true,
    advancedAnalytics: true,
    apiAccess: true,
    prioritySupport: true,
    teamMembers: 10,
    price: 199.99,
    priceDisplay: '$199.99/mo',
  },
};

export const AD_CONFIG = {
  enabled: true,
  bannerUnitId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID
  }),
  interstitialUnitId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  }),
  rewardedUnitId: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  }),
  interstitialFrequency: 5, // Show every 5 actions
};

export const CACHE_CONFIG = {
  brandProfileTTL: 24 * 60 * 60 * 1000, // 24 hours
  platformListTTL: 60 * 60 * 1000, // 1 hour
  analyticsTTL: 5 * 60 * 1000, // 5 minutes
  contentQueueTTL: 60 * 1000, // 1 minute
  maxCacheSize: 50 * 1024 * 1024, // 50MB
};

export const DEEP_LINKS = {
  prefix: 'qempire://',
  schemes: ['qempire', 'https'],
  paths: {
    dashboard: 'dashboard',
    platforms: 'platforms',
    content: 'content',
    analytics: 'analytics',
    settings: 'settings',
    subscription: 'subscription',
    promo: 'promo/:code',
    referral: 'referral/:code',
  },
};

export const NOTIFICATION_CONFIG = {
  categories: [
    { identifier: 'post_success', name: 'Post Published', importance: Notifications.AndroidImportance.HIGH },
    { identifier: 'post_failure', name: 'Post Failed', importance: Notifications.AndroidImportance.HIGH },
    { identifier: 'autopilot_complete', name: 'Autopilot Complete', importance: Notifications.AndroidImportance.DEFAULT },
    { identifier: 'subscription', name: 'Subscription', importance: Notifications.AndroidImportance.DEFAULT },
    { identifier: 'system', name: 'System', importance: Notifications.AndroidImportance.LOW },
  ],
};

export const ANALYTICS_EVENTS = {
  // User events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_ONBOARDING_COMPLETE: 'user_onboarding_complete',
  
  // Content events
  CONTENT_GENERATED: 'content_generated',
  CONTENT_PUBLISHED: 'content_published',
  CONTENT_EDITED: 'content_edited',
  CONTENT_SCHEDULED: 'content_scheduled',
  
  // Platform events
  PLATFORM_CONNECTED: 'platform_connected',
  PLATFORM_DISCONNECTED: 'platform_disconnected',
  
  // Subscription events
  SUBSCRIPTION_VIEWED: 'subscription_viewed',
  SUBSCRIPTION_SELECTED: 'subscription_selected',
  SUBSCRIPTION_PURCHASED: 'subscription_purchased',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  PROMO_CODE_USED: 'promo_code_used',
  REFERRAL_SENT: 'referral_sent',
  REFERRAL_COMPLETED: 'referral_completed',
  
  // AI events
  AI_GENERATION_USED: 'ai_generation_used',
  AI_SUGGESTION_ACCEPTED: 'ai_suggestion_accepted',
  AI_SUGGESTION_REJECTED: 'ai_suggestion_rejected',
  
  // Ad events
  AD_IMPRESSION: 'ad_impression',
  AD_CLICKED: 'ad_clicked',
  REWARDED_AD_COMPLETED: 'rewarded_ad_completed',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  SYNC_ERROR: 'sync_error',
};

export const PLATFORM_REGISTRY_MOBILE = {
  facebook: { name: 'Facebook', emoji: '📘', maxChars: 63206, supportsImages: true, supportsVideo: true },
  instagram: { name: 'Instagram', emoji: '📸', maxChars: 2200, supportsImages: true, supportsVideo: true },
  twitter: { name: 'X/Twitter', emoji: '🐦', maxChars: 280, supportsImages: true, supportsVideo: true },
  linkedin: { name: 'LinkedIn', emoji: '💼', maxChars: 3000, supportsImages: true, supportsVideo: true },
  tiktok: { name: 'TikTok', emoji: '🎵', maxChars: 2200, supportsImages: false, supportsVideo: true },
  pinterest: { name: 'Pinterest', emoji: '📌', maxChars: 500, supportsImages: true, supportsVideo: true },
  youtube: { name: 'YouTube', emoji: '▶️', maxChars: 5000, supportsImages: true, supportsVideo: true },
  reddit: { name: 'Reddit', emoji: '🔴', maxChars: 40000, supportsImages: true, supportsVideo: true },
  threads: { name: 'Threads', emoji: '🧵', maxChars: 500, supportsImages: true, supportsVideo: true },
  tumblr: { name: 'Tumblr', emoji: '📝', maxChars: 4096, supportsImages: true, supportsVideo: true },
  medium: { name: 'Medium', emoji: '✍️', maxChars: 100000, supportsImages: true, supportsVideo: false },
  mastodon: { name: 'Mastodon', emoji: '🐘', maxChars: 500, supportsImages: true, supportsVideo: true },
  discord: { name: 'Discord', emoji: '💬', maxChars: 2000, supportsImages: true, supportsVideo: true },
  telegram: { name: 'Telegram', emoji: '✈️', maxChars: 4096, supportsImages: true, supportsVideo: true },
  whatsapp: { name: 'WhatsApp', emoji: '📱', maxChars: 4096, supportsImages: true, supportsVideo: true },
  snapchat: { name: 'Snapchat', emoji: '👻', maxChars: 250, supportsImages: true, supportsVideo: true },
  bluesky: { name: 'Bluesky', emoji: '🦋', maxChars: 300, supportsImages: true, supportsVideo: false },
  wordpress: { name: 'WordPress', emoji: '🌐', maxChars: 100000, supportsImages: true, supportsVideo: true },
  blogger: { name: 'Blogger', emoji: '📰', maxChars: 100000, supportsImages: true, supportsVideo: true },
  mix: { name: 'Mix', emoji: '🔀', maxChars: 500, supportsImages: true, supportsVideo: false },
  quora: { name: 'Quora', emoji: '❓', maxChars: 10000, supportsImages: true, supportsVideo: false },
  vk: { name: 'VK', emoji: '🔵', maxChars: 15895, supportsImages: true, supportsVideo: true },
  weibo: { name: 'Weibo', emoji: '🇨🇳', maxChars: 2000, supportsImages: true, supportsVideo: true },
  line: { name: 'LINE', emoji: '💚', maxChars: 5000, supportsImages: true, supportsVideo: true },
  kakao: { name: 'KakaoTalk', emoji: '💛', maxChars: 2000, supportsImages: true, supportsVideo: true },
};
