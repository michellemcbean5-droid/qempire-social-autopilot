import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
      ]).start(() => { onAnimationComplete?.(); });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.deepObsidian, colors.midnightNavy, '#1a0a3e']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.iconContainer}>
              <Ionicons name="rocket" size={80} color={colors.neonAqua} />
            </View>
          </Animated.View>
          <Text style={styles.title}>Q-Empire</Text>
          <Text style={styles.subtitle}>Social Autopilot</Text>
          <Text style={styles.tagline}>Posts to 25 platforms while you sleep</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AI-Powered</Text>
            </View>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeTextSecondary}>v1.0.0</Text>
            </View>
          </View>
        </Animated.View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Q-Empire AI Automation Division</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    width: 120, height: 120, borderRadius: borderRadius.xxl,
    backgroundColor: 'rgba(0, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.neonAqua, marginBottom: spacing.xl,
  },
  title: { fontSize: 42, fontWeight: '800', color: colors.softWhite, letterSpacing: -1 },
  subtitle: { fontSize: 20, fontWeight: '600', color: colors.royalBlue, marginTop: spacing.xs, letterSpacing: 2, textTransform: 'uppercase' },
  tagline: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center', paddingHorizontal: spacing.xl },
  badgeContainer: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  badge: { backgroundColor: colors.royalBlue + '30', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.royalBlue + '50' },
  badgeSecondary: { backgroundColor: colors.electricPurple + '30', borderColor: colors.electricPurple + '50' },
  badgeText: { color: colors.royalBlue, fontSize: 12, fontWeight: '700' },
  badgeTextSecondary: { color: colors.electricPurple, fontSize: 12, fontWeight: '700' },
  footer: { position: 'absolute', bottom: spacing.xxl },
  footerText: { color: colors.textMuted, fontSize: 12 },
});
