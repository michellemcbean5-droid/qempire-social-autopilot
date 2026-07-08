import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Surface,
  Chip,
  IconButton,
  HelperText,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    clearError();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setValidationError('Please enter your password');
      return;
    }

    if (isSignUp && password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    await login(email, password);
    if (!error) {
      navigation.navigate('MainTabs');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login
    console.log(`Social login with ${provider}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>👑</Text>
          </View>
          <Text style={styles.logoTitle}>Q-Empire</Text>
          <Text style={styles.logoSubtitle}>Social Autopilot</Text>
        </View>

        {/* Form */}
        <Surface style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isSignUp 
              ? 'Start automating your social media today'
              : 'Sign in to manage your social empire'
            }
          </Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError(); setValidationError(''); }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            style={styles.input}
            textColor={colors.softWhite}
            left={<TextInput.Icon icon="email" color={colors.textSecondary} />}
            error={!!validationError || !!error}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); setValidationError(''); }}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType={isSignUp ? 'newPassword' : 'password'}
            style={styles.input}
            textColor={colors.softWhite}
            left={<TextInput.Icon icon="lock" color={colors.textSecondary} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                color={colors.textSecondary}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!validationError || !!error}
          />

          {/* Error Messages */}
          {(validationError || error) && (
            <HelperText type="error" visible={true} style={styles.errorText}>
              {validationError || error}
            </HelperText>
          )}

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            buttonColor={colors.royalBlue}
            textColor={colors.softWhite}
            icon={isSignUp ? 'account-plus' : 'login'}
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          {/* Toggle Sign In/Up */}
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => { setIsSignUp(!isSignUp); clearError(); setValidationError(''); }}
          >
            <Text style={styles.toggleText}>
              {isSignUp 
                ? 'Already have an account? '
                : "Don't have an account? "
              }
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>

          <Divider style={styles.divider}>
            <Text style={styles.dividerText}>or continue with</Text>
          </Divider>

          {/* Social Login */}
          <View style={styles.socialButtons}>
            <Button
              mode="outlined"
              onPress={() => handleSocialLogin('google')}
              style={styles.socialButton}
              textColor={colors.softWhite}
              icon="google"
            >
              Google
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleSocialLogin('apple')}
              style={styles.socialButton}
              textColor={colors.softWhite}
              icon="apple"
            >
              Apple
            </Button>
          </View>

          {/* Demo Mode */}
          <Button
            mode="text"
            onPress={() => navigation.navigate('MainTabs')}
            style={styles.demoButton}
            textColor={colors.textSecondary}
            icon="test-tube"
          >
            Try Demo Mode
          </Button>
        </Surface>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.royalBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.softWhite,
  },
  logoSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formContainer: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
  submitButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  toggleLink: {
    color: colors.royalBlue,
    fontWeight: '700',
  },
  divider: {
    marginVertical: spacing.lg,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: colors.midnightNavy,
    paddingHorizontal: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  demoButton: {
    marginTop: spacing.md,
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
