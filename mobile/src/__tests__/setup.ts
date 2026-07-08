import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.callNativeMethod = () => {};
  return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiSet: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { HIGH: 5, DEFAULT: 3, LOW: 1 },
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn((path) => `qempire://${path}`),
  parse: jest.fn(),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  manifest: {},
  expoConfig: {
    extra: {
      eas: { projectId: 'test-project-id' },
    },
  },
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  return {
    Provider: ({ children }) => children,
    DefaultTheme: {},
    Button: ({ children, onPress, ...props }) => (
      React.createElement(TouchableOpacity, { onPress, testID: props.testID, ...props },
        React.createElement(Text, null, children)
      )
    ),
    TextInput: ({ label, value, onChangeText, ...props }) => (
      React.createElement(View, null,
        React.createElement(Text, null, label),
        React.createElement('input', { value, onChange: (e) => onChangeText?.(e.target.value), ...props })
      )
    ),
    Text: ({ children, ...props }) => React.createElement(Text, props, children),
    Surface: ({ children, ...props }) => React.createElement(View, props, children),
    Card: ({ children, ...props }) => React.createElement(View, props, children),
    Chip: ({ children, ...props }) => React.createElement(View, props, children),
    ProgressBar: ({ progress, ...props }) => React.createElement(View, { testID: 'progress-bar', ...props }),
    IconButton: ({ onPress, ...props }) => React.createElement(TouchableOpacity, { onPress, ...props }),
    HelperText: ({ children, ...props }) => React.createElement(Text, props, children),
    Portal: ({ children }) => children,
    Modal: ({ children, visible }) => visible ? children : null,
    Dialog: ({ children, visible }) => visible ? children : null,
    Snackbar: ({ children, visible }) => visible ? children : null,
    ActivityIndicator: () => React.createElement(View, { testID: 'activity-indicator' }),
    Avatar: { Image: ({ source }) => React.createElement(View, { testID: 'avatar-image' }) },
    List: { 
      Item: ({ title, onPress }) => React.createElement(TouchableOpacity, { onPress }, React.createElement(Text, null, title)),
      Section: ({ children }) => React.createElement(View, null, children),
    },
    DataTable: {
      Header: ({ children }) => React.createElement(View, null, children),
      Title: ({ children }) => React.createElement(Text, null, children),
      Row: ({ children }) => React.createElement(View, null, children),
      Cell: ({ children }) => React.createElement(View, null, children),
    },
    Switch: ({ value, onValueChange }) => React.createElement('input', { type: 'checkbox', checked: value, onChange: (e) => onValueChange?.(e.target.checked) }),
    Checkbox: ({ status, onPress }) => React.createElement(TouchableOpacity, { onPress }, React.createElement(Text, null, status)),
    RadioButton: { Group: ({ children }) => children, Item: ({ label, value }) => React.createElement(View, null, React.createElement(Text, null, label)) },
    Menu: { 
      visible: false,
      onDismiss: jest.fn(),
      anchor: null,
      children: null,
    },
    Divider: () => React.createElement(View, { testID: 'divider' }),
    FAB: ({ onPress, icon }) => React.createElement(TouchableOpacity, { onPress }, React.createElement(Text, null, icon)),
    Banner: ({ children, visible }) => visible ? React.createElement(View, null, children) : null,
    Searchbar: ({ value, onChangeText, ...props }) => React.createElement('input', { value, onChange: (e) => onChangeText?.(e.target.value), ...props }),
    SegmentedButtons: ({ buttons, value, onValueChange }) => (
      React.createElement(View, null,
        buttons.map(btn => React.createElement(TouchableOpacity, { key: btn.value, onPress: () => onValueChange?.(btn.value) }, React.createElement(Text, null, btn.label)))
      )
    ),
  };
});

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null,
  BarChart: () => null,
  PieChart: () => null,
  ProgressChart: () => null,
  ContributionGraph: () => null,
  StackedBarChart: () => null,
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn((callback) => callback()),
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  })
);

// Console error suppression for known warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const suppressed = [
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Animated: `useNativeDriver`',
    'Non-serializable values were found',
  ];
  if (suppressed.some(msg => args[0]?.includes?.(msg))) {
    return;
  }
  originalConsoleError(...args);
};

// Setup test timeout
jest.setTimeout(10000);
