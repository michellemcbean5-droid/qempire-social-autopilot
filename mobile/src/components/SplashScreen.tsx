import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import MermaidCharacter from './MermaidCharacter';
import SonCharacter from './SonCharacter';
import QBotCharacter from './QBotCharacter';
import { colors, spacing, borderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const botSlide = useRef(new Animated.Value(100)).current;
  const sonSlide = useRef(new Animated.Value(-100)).current;
  const mermaidSlide = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    const entranceSequence = Animated.sequence([
      // Phase 1: Characters fade in from sides
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(sonSlide, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(botSlide, { toValue: 0, duration: 900, useNativeDriver: true, delay: 200 }),
        Animated.timing(mermaidSlide, { toValue: 0, duration: 1000, useNativeDriver: true, delay: 400 }),
      ]),

      // Phase 2: Title and subtitle slide in
      Animated.parallel([
        Animated.timing(titleSlide, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(subtitleSlide, { toValue: 0, duration: 700, useNativeDriver: true, delay: 200 }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),

      // Phase 3: Shimmer effect on title
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmer, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(shimmer, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ),
    ]);

    entranceSequence.start();

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
      ]).start(() => { onAnimationComplete?.(); });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A1A', '#0D0D2B', '#1a0a3e', '#0A0A1A']}
        style={styles.gradient}
      >
        {/* Animated background particles */}
        <View style={styles.particles}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 3) * 25}%`,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3 + i * 0.05],
                  }),
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, -30 - i * 10],
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Characters Row */}
          <View style={styles.charactersRow}>
            <Animated.View style={{ transform: [{ translateX: sonSlide }] }}>
              <SonCharacter size={width * 0.28} animated={true} />
            </Animated.View>

            <Animated.View style={{ transform: [{ translateX: botSlide }] }}>
              <QBotCharacter size={width * 0.32} animated={true} mood="celebrating" />
            </Animated.View>

            <Animated.View style={{ transform: [{ translateY: mermaidSlide }] }}>
              <MermaidCharacter size={width * 0.3} animated={true} />
            </Animated.View>
          </View>

          {/* Title with shimmer */}
          <View style={styles.titleContainer}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            />
            <Animated.Text
              style={[
                styles.title,
                { transform: [{ translateX: titleSlide }] },
              ]}
            >
              Q-Empire
            </Animated.Text>
          </View>

          <Animated.Text
            style={[
              styles.subtitle,
              { transform: [{ translateX: subtitleSlide }] },
            ]}
          >
            Social Autopilot
          </Animated.Text>

          <Animated.Text
            style={[
              styles.tagline,
              { opacity: fadeAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }) },
            ]}
          >
            Posts to 25 platforms while you sleep
          </Animated.Text>

          {/* Character badges */}
          <Animated.View
            style={[
              styles.badgeContainer,
              { opacity: fadeAnim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0, 1] }) },
            ]}
          >
            <View style={[styles.badge, { backgroundColor: colors.royalBlue + '30', borderColor: colors.royalBlue + '50' }]}>
              <Ionicons name="flash" size={14} color={colors.royalBlue} />
              <Text style={[styles.badgeText, { color: colors.royalBlue }]}>AI-Powered</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.electricPurple + '30', borderColor: colors.electricPurple + '50' }]}>
              <Ionicons name="globe" size={14} color={colors.electricPurple} />
              <Text style={[styles.badgeText, { color: colors.electricPurple }]}>25 Platforms</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.neonAqua + '30', borderColor: colors.neonAqua + '50' }]}>
              <Ionicons name="time" size={14} color={colors.neonAqua} />
              <Text style={[styles.badgeText, { color: colors.neonAqua }]}>Autopilot</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            { opacity: fadeAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 0, 1] }) },
          ]}
        >
          <Text style={styles.footerText}>Q-Empire AI Automation Division</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FFFF',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  charactersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  titleContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 100,
    zIndex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.softWhite,
    letterSpacing: -1,
    textShadowColor: colors.royalBlue + '80',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.royalBlue,
    marginTop: spacing.xs,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  versionBadge: {
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
