import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { theme } from '@/constants/theme';
import Navigation from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import SplashScreen from '@/components/SplashScreen';
import { initializeDeepLinks } from '@/utils/deepLinks';
import { registerForPushNotifications } from '@/utils/notifications';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const { initializeAuth } = useAuthStore();
  const { initializeSubscription } = useSubscriptionStore();

  React.useEffect(() => {
    async function init() {
      try {
        await initializeAuth();
        await initializeSubscription();
        await registerForPushNotifications();
        await initializeDeepLinks();
      } catch (error) {
        console.warn('Initialization error:', error);
      } finally {
        setAppReady(true);
      }
    }
    init();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && !showSplash) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!appReady) {
    return (
      <View style={styles.loadingContainer} onLayout={onLayoutRootView}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <View style={styles.container} onLayout={onLayoutRootView}>
              {showSplash ? (
                <SplashScreen onAnimationComplete={handleSplashComplete} />
              ) : (
                <Navigation />
              )}
              <StatusBar style="light" />
              <Toast />
            </View>
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
