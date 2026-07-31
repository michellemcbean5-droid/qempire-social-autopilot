import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';

import { colors, spacing, borderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

// Animated SVG Components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedG = Animated.createAnimatedComponent(G);

const QBotCharacter = ({ scaleAnim }: { scaleAnim: Animated.Value }) => (
  <AnimatedG
    style={{
      transform: [
        { translateX: 120 },
        { translateY: 20 },
        { scale: scaleAnim },
      ],
    }}
  >
    {/* Antenna */}
    <Rect x="28" y="-15" width="4" height="15" fill={colors.electricYellow} rx="2" />
    <Circle cx="30" cy="-18" r="6" fill={colors.hotPink}>
      <AnimatedG>
        <Circle cx="30" cy="-18" r="6" fill={colors.hotPink} />
      </AnimatedG>
    </Circle>
    {/* Body */}
    <Rect x="0" y="0" width="60" height="50" rx="15" fill="url(#botGradient)" />
    {/* Eyes */}
    <Circle cx="18" cy="20" r="8" fill={colors.electricYellow} />
    <Circle cx="19" cy="19" r="4" fill={colors.deepObsidian} />
    <Circle cx="42" cy="20" r="8" fill={colors.electricYellow} />
    <Circle cx="43" cy="19" r="4" fill={colors.deepObsidian} />
    {/* Arms */}
    <Rect x="-8" y="30" width="8" height="25" rx="4" fill="url(#botGradient)" transform="rotate(-20, -4, 42)" />
    <Rect x="60" y="30" width="8" height="25" rx="4" fill="url(#botGradient)" transform="rotate(20, 64, 42)" />
  </AnimatedG>
);

const MermaidCharacter = ({ swayAnim }: { swayAnim: Animated.Value }) => (
  <AnimatedG
    style={{
      transform: [
        { translateX: 30 },
        { translateY: 10 },
        { rotate: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) },
      ],
    }}
  >
    {/* Hair - Blonde flowing */}
    <Ellipse cx="50" cy="15" rx="25" ry="20" fill="url(#hairGradient)" />
    <Ellipse cx="45" cy="20" rx="20" ry="15" fill="url(#hairGradient2)" />
    <Ellipse cx="55" cy="18" rx="18" ry="16" fill="url(#hairGradient3)" />
    {/* Face - Dark skin */}
    <Circle cx="50" cy="35" r="18" fill="#8B4513" />
    {/* Eyes */}
    <Circle cx="42" cy="32" r="5" fill="white" />
    <Circle cx="43" cy="32" r="2.5" fill="#4A2C00" />
    <Circle cx="58" cy="32" r="5" fill="white" />
    <Circle cx="59" cy="32" r="2.5" fill="#4A2C00" />
    {/* Smile */}
    <Path d="M 42 42 Q 50 48 58 42" stroke="#FF69B4" strokeWidth="2" fill="none" />
    {/* Body */}
    <Rect x="35" y="52" width="30" height="40" rx="15" fill="url(#mermaidBodyGradient)" />
    {/* Tail */}
    <Path d="M 35 92 Q 20 110 10 125 Q 30 120 50 115 Q 40 105 35 92" fill="url(#tailGradient)" />
    <Path d="M 65 92 Q 80 110 90 125 Q 70 120 50 115 Q 60 105 65 92" fill="url(#tailGradient2)" />
    {/* Tail fin detail */}
    <Ellipse cx="50" cy="118" rx="20" ry="8" fill="url(#tailFinGradient)" />
  </AnimatedG>
);

const SonCharacter = ({ bounceAnim }: { bounceAnim: Animated.Value }) => (
  <AnimatedG
    style={{
      transform: [
        { translateX: 100 },
        { translateY: bounceAnim },
      ],
    }}
  >
    {/* Head */}
    <Circle cx="30" cy="15" r="15" fill="#CD853F" />
    {/* Hair */}
    <Ellipse cx="30" cy="5" rx="12" ry="8" fill="#FFD700" />
    <Ellipse cx="25" cy="8" rx="8" ry="6" fill="#FFA500" />
    {/* Eyes */}
    <Circle cx="24" cy="14" r="3" fill="#4A2C00" />
    <Circle cx="36" cy="14" r="3" fill="#4A2C00" />
    {/* Smile */}
    <Path d="M 25 20 Q 30 24 35 20" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
    {/* Shirt */}
    <Rect x="15" y="30" width="30" height="35" rx="5" fill="url(#shirtGradient)" />
    {/* Pants */}
    <Rect x="17" y="62" width="26" height="25" rx="3" fill="#4169E1" />
    {/* Shoes */}
    <Rect x="14" y="85" width="12" height="8" rx="3" fill={colors.hotPink} />
    <Rect x="34" y="85" width="12" height="8" rx="3" fill={colors.hotPink} />
  </AnimatedG>
);

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;
  const botFloatAnim = useRef(new Animated.Value(0)).current;
  const mermaidSwayAnim = useRef(new Animated.Value(0)).current;
  const sonBounceAnim = useRef(new Animated.Value(0)).current;
  const titleGlowAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 15 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + Math.random() * 100),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }))
  ).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();

    // Q-Bot floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(botFloatAnim, { toValue: -15, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(botFloatAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Mermaid swaying
    Animated.loop(
      Animated.sequence([
        Animated.timing(mermaidSwayAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(mermaidSwayAnim, { toValue: -1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Son bouncing
    Animated.loop(
      Animated.sequence([
        Animated.timing(sonBounceAnim, { toValue: -10, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(sonBounceAnim, { toValue: 0, duration: 600, easing: Easing.bounce, useNativeDriver: true }),
        Animated.delay(400),
      ])
    ).start();

    // Title glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(titleGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    // Particles
    particleAnims.forEach((particle, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.parallel([
            Animated.timing(particle.y, { toValue: -50, duration: 4000 + Math.random() * 2000, useNativeDriver: true }),
            Animated.timing(particle.opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(particle.opacity, { toValue: 0, duration: 500, delay: 3000, useNativeDriver: true }),
          ]),
        ])
      ).start();
    });

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
      ]).start(() => { onAnimationComplete?.(); });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const particleColors = [colors.electricYellow, colors.hotPink, colors.electricBlue, colors.neonAqua];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.deepObsidian, colors.midnightNavy, '#1a0a3e', '#0a1a2e']}
        style={styles.gradient}
      >
        {/* Floating Particles */}
        {particleAnims.map((particle, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
                backgroundColor: particleColors[i % particleColors.length],
              },
            ]}
          />
        ))}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Character Scene */}
          <View style={styles.characterScene}>
            <Svg width={width} height={200} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient id="botGradient" x1="0" y1="0" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.electricBlue} />
                  <Stop offset="1" stopColor={colors.electricPurple} />
                </LinearGradient>
                <LinearGradient id="hairGradient" x1="25" y1="0" x2="75" y2="30" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFD700" />
                  <Stop offset="0.5" stopColor="#FFA500" />
                  <Stop offset="1" stopColor="#FF8C00" />
                </LinearGradient>
                <LinearGradient id="hairGradient2" x1="25" y1="5" x2="65" y2="25" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFD700" />
                  <Stop offset="1" stopColor="#FFA500" />
                </LinearGradient>
                <LinearGradient id="hairGradient3" x1="37" y1="2" x2="73" y2="28" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFA500" />
                  <Stop offset="1" stopColor="#FF8C00" />
                </LinearGradient>
                <LinearGradient id="mermaidBodyGradient" x1="35" y1="52" x2="65" y2="92" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.hotPink} />
                  <Stop offset="1" stopColor="#FF6B9D" />
                </LinearGradient>
                <LinearGradient id="tailGradient" x1="10" y1="92" x2="50" y2="125" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.electricBlue} />
                  <Stop offset="1" stopColor={colors.electricPurple} />
                </LinearGradient>
                <LinearGradient id="tailGradient2" x1="50" y1="92" x2="90" y2="125" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.electricPurple} />
                  <Stop offset="1" stopColor={colors.electricBlue} />
                </LinearGradient>
                <LinearGradient id="tailFinGradient" x1="30" y1="110" x2="70" y2="126" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.electricYellow} />
                  <Stop offset="1" stopColor="#FFD700" />
                </LinearGradient>
                <LinearGradient id="shirtGradient" x1="15" y1="30" x2="45" y2="65" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.electricYellow} />
                  <Stop offset="1" stopColor="#FFA500" />
                </LinearGradient>
              </Defs>

              <MermaidCharacter swayAnim={mermaidSwayAnim} />
              <SonCharacter bounceAnim={sonBounceAnim} />
              <QBotCharacter scaleAnim={botFloatAnim} />
            </Svg>
          </View>

          <Text style={styles.title}>Q-Empire</Text>
          <Text style={styles.subtitle}>Social Autopilot</Text>
          <Text style={styles.tagline}>Posts to 25 platforms while you sleep</Text>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgePrimary]}>
              <Text style={styles.badgeText}>🤖 AI-Powered</Text>
            </View>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeTextSecondary}>v1.0.0</Text>
            </View>
            <View style={[styles.badge, styles.badgeTertiary]}>
              <Text style={styles.badgeTextTertiary}>25 Platforms</Text>
            </View>
          </View>

          {/* Animated loading indicator */}
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.loadingDot,
                  {
                    backgroundColor: i === 0 ? colors.electricYellow : i === 1 ? colors.hotPink : colors.electricBlue,
                    transform: [{
                      scale: titleGlowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    }],
                    opacity: titleGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ]}
              />
            ))}
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
  content: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  characterScene: {
    width: width,
    height: 200,
    marginBottom: spacing.xl,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.softWhite,
    letterSpacing: -1,
    textShadowColor: colors.electricBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.electricBlue,
    marginTop: spacing.xs,
    letterSpacing: 3,
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
    paddingHorizontal: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgePrimary: {
    backgroundColor: colors.electricBlue + '25',
    borderColor: colors.electricBlue + '50',
  },
  badgeSecondary: {
    backgroundColor: colors.hotPink + '25',
    borderColor: colors.hotPink + '50',
  },
  badgeTertiary: {
    backgroundColor: colors.electricYellow + '25',
    borderColor: colors.electricYellow + '50',
  },
  badgeText: {
    color: colors.electricBlue,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextSecondary: {
    color: colors.hotPink,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextTertiary: {
    color: colors.electricYellow,
    fontSize: 12,
    fontWeight: '700',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xl,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
