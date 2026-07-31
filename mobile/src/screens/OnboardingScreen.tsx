import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import MermaidCharacter from '@/components/MermaidCharacter';
import SonCharacter from '@/components/SonCharacter';
import QBotCharacter from '@/components/QBotCharacter';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  character: 'mermaid' | 'son' | 'qbot' | 'all';
  characterMood?: 'happy' | 'thinking' | 'working' | 'celebrating';
  icon: string;
  accentColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'Welcome to Q-Empire',
    subtitle: 'Your Social Media Command Center',
    description: 'Meet your AI-powered team that handles all 25 social platforms while you focus on what matters most.',
    character: 'all',
    icon: 'rocket',
    accentColor: colors.royalBlue,
  },
  {
    id: 'ai-power',
    title: 'AI Content Generation',
    subtitle: 'Smart Posts, Every Time',
    description: 'Q-Bot analyzes your brand voice and creates unique, platform-optimized content for each network automatically.',
    character: 'qbot',
    characterMood: 'working',
    icon: 'sparkles',
    accentColor: colors.neonAqua,
  },
  {
    id: 'autopilot',
    title: 'True Autopilot Mode',
    subtitle: 'Set It & Sleep On It',
    description: 'Schedule posts across all platforms. The mermaid handles the flow while your son watches the magic happen.',
    character: 'mermaid',
    icon: 'time',
    accentColor: colors.electricPurple,
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    subtitle: 'Know What Works',
    description: 'Track engagement, reach, and performance across all 25 platforms from one beautiful dashboard.',
    character: 'son',
    icon: 'stats-chart',
    accentColor: colors.warmGold,
  },
  {
    id: 'ready',
    title: 'Ready to Launch?',
    subtitle: 'Your Empire Awaits',
    description: 'Connect your platforms, set your schedule, and let Q-Empire handle the rest. Your social media runs itself.',
    character: 'all',
    icon: 'checkmark-circle',
    accentColor: colors.success,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { completeOnboarding } = useAuthStore();

  const animateTransition = (direction: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * width, duration: 0, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      animateTransition(-1);
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      animateTransition(1);
      setCurrentIndex(currentIndex - 1);
      scrollRef.current?.scrollTo({ x: (currentIndex - 1) * width, animated: true });
    }
  };

  const renderCharacter = (slide: OnboardingSlide) => {
    switch (slide.character) {
      case 'mermaid':
        return <MermaidCharacter size={width * 0.45} animated={true} />;
      case 'son':
        return <SonCharacter size={width * 0.4} animated={true} />;
      case 'qbot':
        return <QBotCharacter size={width * 0.42} animated={true} mood={slide.characterMood || 'happy'} />;
      case 'all':
        return (
          <View style={styles.allCharacters}>
            <SonCharacter size={width * 0.25} animated={true} style={{ marginRight: -20 }} />
            <QBotCharacter size={width * 0.28} animated={true} mood="celebrating" style={{ zIndex: 1 }} />
            <MermaidCharacter size={width * 0.26} animated={true} style={{ marginLeft: -20 }} />
          </View>
        );
      default:
        return null;
    }
  };

  const slide = SLIDES[currentIndex];
  const progress = (currentIndex + 1) / SLIDES.length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A1A', '#0D0D2B', '#1a0a3e']}
        style={styles.gradient}
      >
        {/* Top progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={slide.accentColor}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {currentIndex + 1} / {SLIDES.length}
          </Text>
        </View>

        {/* Skip button */}
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Character area */}
          <View style={styles.characterArea}>
            <View style={[styles.characterGlow, { backgroundColor: slide.accentColor + '15' }]}>
              {renderCharacter(slide)}
            </View>
          </View>

          {/* Text content */}
          <Surface style={styles.textCard}>
            <View style={[styles.iconContainer, { backgroundColor: slide.accentColor + '20' }]}>
              <Ionicons name={slide.icon as any} size={28} color={slide.accentColor} />
            </View>

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={[styles.subtitle, { color: slide.accentColor }]}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {/* Feature highlights */}
            {slide.id === 'ai-power' && (
              <View style={styles.featureRow}>
                <FeatureBadge icon="logo-facebook" label="Facebook" color="#1877F2" />
                <FeatureBadge icon="logo-instagram" label="Instagram" color="#E4405F" />
                <FeatureBadge icon="logo-twitter" label="X/Twitter" color="#1DA1F2" />
              </View>
            )}
            {slide.id === 'autopilot' && (
              <View style={styles.featureRow}>
                <FeatureBadge icon="calendar" label="Daily" color={colors.success} />
                <FeatureBadge icon="repeat" label="Weekly" color={colors.warning} />
                <FeatureBadge icon="cog" label="Custom" color={colors.info} />
              </View>
            )}
            {slide.id === 'analytics' && (
              <View style={styles.featureRow}>
                <FeatureBadge icon="eye" label="Reach" color={colors.royalBlue} />
                <FeatureBadge icon="heart" label="Engagement" color={colors.electricPurple} />
                <FeatureBadge icon="trending-up" label="Growth" color={colors.neonAqua} />
              </View>
            )}
          </Surface>
        </Animated.View>

        {/* Navigation buttons */}
        <View style={styles.navContainer}>
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && [
                    styles.dotActive,
                    { backgroundColor: slide.accentColor },
                  ],
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            {currentIndex > 0 && (
              <Button
                mode="outlined"
                onPress={goToPrev}
                style={styles.prevButton}
                textColor={colors.textSecondary}
              >
                Back
              </Button>
            )}
            <Button
              mode="contained"
              onPress={goToNext}
              style={[
                styles.nextButton,
                { backgroundColor: slide.accentColor },
              ]}
              textColor="#FFF"
              icon={currentIndex === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'}
            >
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function FeatureBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={[styles.featureBadge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
      <Ionicons name={icon as any} size={14} color={color} />
      <Text style={[styles.featureBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceVariant,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 10,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  characterArea: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  characterGlow: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCharacters: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  navContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceVariant,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  prevButton: {
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    flex: 1,
  },
  nextButton: {
    borderRadius: borderRadius.lg,
    flex: 1.5,
  },
});
