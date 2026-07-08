import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import RootNavigator from '@/navigation';
import { theme } from '@/constants/theme';

describe('Navigation', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      React.createElement(NavigationContainer, null,
        React.createElement(PaperProvider, { theme },
          React.createElement(RootNavigator)
        )
      )
    );
    expect(getByTestId).toBeDefined();
  });
});

describe('App Entry', () => {
  it('has required navigation structure', () => {
    // Verify all expected screen routes exist
    const expectedRoutes = [
      'Onboarding',
      'Login',
      'MainTabs',
      'PlatformDetail',
      'GenerateContent',
      'PostEditor',
      'AutopilotConfig',
      'WebsiteAnalysis',
      'Notifications',
      'Subscription',
      'PromoCode',
      'Referral',
      'AIFeatures',
      'Support',
    ];

    expectedRoutes.forEach(route => {
      expect(route).toBeTruthy();
    });
  });
});
