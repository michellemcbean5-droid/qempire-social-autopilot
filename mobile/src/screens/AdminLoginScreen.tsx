import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, Surface, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, borderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

const ADMIN_CREDENTIALS = {
  email: 'admin@qempire.ai',
  password: 'QEmpire2024!',
};

export default function AdminLoginScreen() {
  const navigation = useNavigation();
  const { adminLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email.toLowerCase().trim() === ADMIN_CREDENTIALS.email && 
        password === ADMIN_CREDENTIALS.password) {
      adminLogin();
      setLoading(false);
    } else {
      setError('Invalid admin credentials. Please check email and password.');
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.deepObsidian, colors.midnightNavy, '#1a0a3e']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Admin Badge */}
          <View style={styles.adminBadge}>
            <LinearGradient
              colors={[colors.electricYellow, '#FFA500']}
              style={styles.badgeGradient}
            >
              <Ionicons name="shield-checkmark" size={28} color={colors.deepObsidian} />
            </LinearGradient>
            <Text style={styles.badgeText}>ADMIN PORTAL</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Q-Empire Admin</Text>
          <Text style={styles.subtitle}>
            Secure access for app management, testing, and corrections
          </Text>

          {/* Login Card */}
          <Surface style={styles.card} elevation={4}>
            <Text style={styles.cardTitle}>Administrator Sign In</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TextInput
              label="Admin Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              textColor={colors.softWhite}
              outlineColor={colors.border}
              activeOutlineColor={colors.electricYellow}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" color={colors.textSecondary} />}
              theme={{ colors: { onSurface: colors.softWhite, onSurfaceVariant: colors.textSecondary } }}
            />

            <TextInput
              label="Admin Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              textColor={colors.softWhite}
              outlineColor={colors.border}
              activeOutlineColor={colors.electricYellow}
              secureTextEntry={secureText}
              left={<TextInput.Icon icon="lock" color={colors.textSecondary} />}
              right={
                <TextInput.Icon
                  icon={secureText ? 'eye-off' : 'eye'}
                  color={colors.textSecondary}
                  onPress={() => setSecureText(!secureText)}
                />
              }
              theme={{ colors: { onSurface: colors.softWhite, onSurfaceVariant: colors.textSecondary } }}
            />

            <HelperText type="info" style={styles.helperText}>
              Default: admin@qempire.ai / QEmpire2024!
            </HelperText>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email || !password}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              icon="shield-account"
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </Surface>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
            <Text style={styles.securityText}>
              This portal is encrypted and monitored. Unauthorized access is prohibited.
            </Text>
          </View>

          {/* Version */}
          <Text style={styles.versionText}>Q-Empire Admin v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  adminBadge: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badgeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.electricYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  badgeText: {
    color: colors.electricYellow,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    flex: 1,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.sm,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.electricYellow,
    borderRadius: borderRadius.lg,
    paddingVertical: 4,
  },
  loginButtonLabel: {
    color: colors.deepObsidian,
    fontSize: 16,
    fontWeight: '700',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  securityText: {
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
