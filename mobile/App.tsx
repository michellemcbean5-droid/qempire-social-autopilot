import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { theme } from '@/constants/theme';
import Navigation from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import { initializeDeepLinks } from '@/utils/deepLinks';
import { registerForPushNotifications } from '@/utils/notifications';

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
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  const [appReady, setAppReady] = React.useState(false);
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

  if (!appReady) {
    return null; // Splash screen handles this
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <Navigation />
            <StatusBar style="light" />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
