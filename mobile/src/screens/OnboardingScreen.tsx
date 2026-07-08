import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  Chip,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'AI-Powered Social Media',
    subtitle: 'Generate platform-optimized content with cutting-edge AI',
    description: 'Our AI engine analyzes your brand and creates unique, engaging posts for up to 25 social media platforms.',
    icon: '🤖',
    color: colors.royalBlue,
  },
  {
    id: '2',
    title: 'Autopilot Scheduling',
    subtitle: 'Set it and forget it',
    description: 'Configure your posting schedule once. The AI will generate and publish content automatically while you sleep.',
    icon: '🚀',
    color: colors.electricPurple,
  },
  {
    id: '3',
    title: '25 Platforms',
    subtitle: 'One app, complete coverage',
    description: 'From Facebook to TikTok, LinkedIn to Bluesky — connect all your social accounts in one place.',
    icon: '🌐',
    color: colors.neonAqua,
  },
  {
    id: '4',
    title: 'Analytics Dashboard',
    subtitle: 'Track what matters',
    description: 'Monitor engagement, reach, and performance across all platforms with real-time analytics.',
    icon: '📊',
    color: colors.warmGold,
  },
  {
    id: '5',
    title: 'Ready to Start?',
    subtitle: 'Your social empire awaits',
    description: 'Join thousands of businesses automating their social media success with Q-Empire.',
    icon: '👑',
    color: colors.royalBlue,
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { completeOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.navigate('Login');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderSlide = ({ item, index }: { item: typeof ONBOARDING_SLIDES[0]; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.slide, { transform: [{ scale }], opacity }]}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {ONBOARDING_SLIDES.map((item, index) => (
          <View key={item.id} style={styles.slideContainer}>
            {renderSlide({ item, index })}
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentIndex === index ? colors.royalBlue : colors.border,
                width: currentIndex === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* CTA Button */}
      <Surface style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.ctaButton}
          buttonColor={colors.royalBlue}
          textColor={colors.softWhite}
          icon={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'rocket-launch' : 'arrow-right'}
        >
          {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  slideContainer: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.royalBlue,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  footer: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadows.md,
  },
  ctaButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
});
