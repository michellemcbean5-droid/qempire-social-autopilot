import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { theme } from '@/constants/theme';

// Auth Screens
import OnboardingScreen from '@/screens/OnboardingScreen';
import LoginScreen from '@/screens/LoginScreen';

// Main Tab Screens
import DashboardScreen from '@/screens/DashboardScreen';
import PlatformsScreen from '@/screens/PlatformsScreen';
import ContentScreen from '@/screens/ContentScreen';
import AnalyticsScreen from '@/screens/AnalyticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';

// Stack Screens
import WebsiteAnalysisScreen from '@/screens/WebsiteAnalysisScreen';
import PlatformDetailScreen from '@/screens/PlatformDetailScreen';
import GenerateContentScreen from '@/screens/GenerateContentScreen';
import PostEditorScreen from '@/screens/PostEditorScreen';
import AutopilotConfigScreen from '@/screens/AutopilotConfigScreen';
import NotificationScreen from '@/screens/NotificationScreen';
import SubscriptionScreen from '@/screens/SubscriptionScreen';
import PromoCodeScreen from '@/screens/PromoCodeScreen';
import ReferralScreen from '@/screens/ReferralScreen';
import AIFeaturesScreen from '@/screens/AIFeaturesScreen';
import SupportScreen from '@/screens/SupportScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  MainTabs: undefined;
  WebsiteAnalysis: undefined;
  PlatformDetail: { platformId: string };
  GenerateContent: { platformIds?: string[] };
  PostEditor: { postId: string; batchId?: string };
  AutopilotConfig: undefined;
  Notifications: undefined;
  Subscription: { source?: string };
  PromoCode: undefined;
  Referral: undefined;
  AIFeatures: undefined;
  Support: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Platforms: undefined;
  Content: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const { tier } = useSubscriptionStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Platforms':
              iconName = focused ? 'share-social' : 'share-social-outline';
              break;
            case 'Content':
              iconName = focused ? 'create' : 'create-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 4,
          paddingTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Platforms"
        component={PlatformsScreen}
        options={{ title: 'Platforms' }}
      />
      <Tab.Screen
        name="Content"
        component={ContentScreen}
        options={{ title: 'Content' }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            {!hasCompletedOnboarding ? (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
            ) : null}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WebsiteAnalysis"
              component={WebsiteAnalysisScreen}
              options={{ title: 'Analyze Website' }}
            />
            <Stack.Screen
              name="PlatformDetail"
              component={PlatformDetailScreen}
              options={{ title: 'Platform Details' }}
            />
            <Stack.Screen
              name="GenerateContent"
              component={GenerateContentScreen}
              options={{ title: 'Generate Content' }}
            />
            <Stack.Screen
              name="PostEditor"
              component={PostEditorScreen}
              options={{ title: 'Edit Post' }}
            />
            <Stack.Screen
              name="AutopilotConfig"
              component={AutopilotConfigScreen}
              options={{ title: 'Autopilot Settings' }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={{ title: 'Notifications' }}
            />
            <Stack.Screen
              name="Subscription"
              component={SubscriptionScreen}
              options={{ title: 'Subscription' }}
            />
            <Stack.Screen
              name="PromoCode"
              component={PromoCodeScreen}
              options={{ title: 'Promo Code' }}
            />
            <Stack.Screen
              name="Referral"
              component={ReferralScreen}
              options={{ title: 'Refer & Earn' }}
            />
            <Stack.Screen
              name="AIFeatures"
              component={AIFeaturesScreen}
              options={{ title: 'AI Features' }}
            />
            <Stack.Screen
              name="Support"
              component={SupportScreen}
              options={{ title: 'Help & Support' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
