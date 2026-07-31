import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Path, Rect, G, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Meet Your AI Crew',
    description: 'Q-Bot, Mermaid, and Son work together to analyze your brand and create stunning content across all 25 platforms.',
    character: 'all',
    accent: colors.electricBlue,
  },
  {
    id: 2,
    title: 'Autopilot Mode',
    description: 'Set your schedule once and let Q-Bot handle the rest. Your content goes live while you focus on what matters most.',
    character: 'bot',
    accent: colors.hotPink,
  },
  {
    id: 3,
    title: 'Track Everything',
    description: 'Real-time analytics across all platforms. See what works, optimize your strategy, and grow faster than ever.',
    character: 'mermaid',
    accent: colors.electricYellow,
  },
  {
    id: 4,
    title: '25 Platforms, One App',
    description: 'Facebook, Instagram, X, TikTok, LinkedIn, and 20 more. All connected, all automated, all in one place.',
    character: 'son',
    accent: colors.neonGreen,
  },
];

// Character SVG Components
const QBotSVG = ({ scale = 1.5 }: { scale?: number }) => (
  <Svg width={100 * scale} height={120 * scale} viewBox="0 0 100 120">
    <Defs>
      <SvgGradient id="botBody" x1="0" y1="0" x2="60" y2="50">
        <Stop offset="0" stopColor={colors.electricBlue} />
        <Stop offset="1" stopColor={colors.electricPurple} />
      </SvgGradient>
    </Defs>
    <Rect x="20" y="5" width="4" height="15" fill={colors.electricYellow} rx="2" />
    <Circle cx="22" cy="-2" r="6" fill={colors.hotPink} />
    <Rect x="0" y="20" width="60" height="50" rx="15" fill="url(#botBody)" />
    <Circle cx="18" cy="40" r="8" fill={colors.electricYellow} />
    <Circle cx="19" cy="39" r="4" fill={colors.deepObsidian} />
    <Circle cx="42" cy="40" r="8" fill={colors.electricYellow} />
    <Circle cx="43" cy="39" r="4" fill={colors.deepObsidian} />
    <Rect x="-8" y="50" width="8" height="25" rx="4" fill="url(#botBody)" transform="rotate(-20, -4, 62)" />
    <Rect x="60" y="50" width="8" height="25" rx="4" fill="url(#botBody)" transform="rotate(20, 64, 62)" />
  </Svg>
);

const MermaidSVG = ({ scale = 1.5 }: { scale?: number }) => (
  <Svg width={120 * scale} height={140 * scale} viewBox="0 0 120 140">
    <Defs>
      <SvgGradient id="hairGrad" x1="25" y1="0" x2="75" y2="30">
        <Stop offset="0" stopColor="#FFD700" />
        <Stop offset="0.5" stopColor="#FFA500" />
        <Stop offset="1" stopColor="#FF8C00" />
      </SvgGradient>
      <SvgGradient id="mermaidBody" x1="35" y1="52" x2="65" y2="92">
        <Stop offset="0" stopColor={colors.hotPink} />
        <Stop offset="1" stopColor="#FF6B9D" />
      </SvgGradient>
      <SvgGradient id="tailGrad" x1="10" y1="92" x2="90" y2="125">
        <Stop offset="0" stopColor={colors.electricBlue} />
        <Stop offset="1" stopColor={colors.electricPurple} />
      </SvgGradient>
    </Defs>
    <Ellipse cx="50" cy="15" rx="25" ry="20" fill="url(#hairGrad)" />
    <Circle cx="50" cy="35" r="18" fill="#8B4513" />
    <Circle cx="42" cy="32" r="5" fill="white" />
    <Circle cx="43" cy="32" r="2.5" fill="#4A2C00" />
    <Circle cx="58" cy="32" r="5" fill="white" />
    <Circle cx="59" cy="32" r="2.5" fill="#4A2C00" />
    <Path d="M 42 42 Q 50 48 58 42" stroke="#FF69B4" strokeWidth="2" fill="none" />
    <Rect x="35" y="52" width="30" height="40" rx="15" fill="url(#mermaidBody)" />
    <Path d="M 35 92 Q 20 110 10 125 Q 30 120 50 115 Q 40 105 35 92" fill="url(#tailGrad)" />
    <Path d="M 65 92 Q 80 110 90 125 Q 70 120 50 115 Q 60 105 65 92" fill="url(#tailGrad)" />
    <Ellipse cx="50" cy="118" rx="20" ry="8" fill={colors.electricYellow} />
  </Svg>
);

const SonSVG = ({ scale = 1.5 }: { scale?: number }) => (
  <Svg width={80 * scale} height={100 * scale} viewBox="0 0 80 100">
    <Defs>
      <SvgGradient id="shirtGrad" x1="15" y1="30" x2="45" y2="65">
        <Stop offset="0" stopColor={colors.electricYellow} />
        <Stop offset="1" stopColor="#FFA500" />
      </SvgGradient>
    </Defs>
    <Circle cx="30" cy="15" r="15" fill="#CD853F" />
    <Ellipse cx="30" cy="5" rx="12" ry="8" fill="#FFD700" />
    <Circle cx="24" cy="14" r="3" fill="#4A2C00" />
    <Circle cx="36" cy="14" r="3" fill="#4A2C00" />
    <Path d="M 25 20 Q 30 24 35 20" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
    <Rect x="15" y="30" width="30" height="35" rx="5" fill="url(#shirtGrad)" />
    <Rect x="17" y="62" width="26" height="25" rx="3" fill="#4169E1" />
    <Rect x="14" y="85" width="12" height="8" rx="3" fill={colors.hotPink} />
    <Rect x="34" y="85" width="12" height="8" rx="3" fill={colors.hotPink} />
  </Svg>
);

const AllCharacters = () => (
  <View style={styles.allCharsContainer}>
    <View style={styles.charLeft}>
      <MermaidSVG scale={1.2} />
    </View>
    <View style={styles.charCenter}>
      <QBotSVG scale={1.2} />
    </View>
    <View style={styles.charRight}>
      <SonSVG scale={1.2} />
    </View>
  </View>
);

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { completeOnboarding } = useAuthStore();

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderCharacter = (character: string) => {
    switch (character) {
      case 'bot': return <QBotSVG scale={2} />;
      case 'mermaid': return <MermaidSVG scale={2} />;
      case 'son': return <SonSVG scale={2} />;
      case 'all': return <AllCharacters />;
      default: return <QBotSVG scale={2} />;
    }
  };

  return (
    <LinearGradient
      colors={[colors.deepObsidian, colors.midnightNavy, '#1a0a3e']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.characterContainer}>
              {renderCharacter(slide.character)}
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: slide.accent }]}>
                {slide.title}
              </Text>
              <Text style={styles.description}>
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [
                colors.textSecondary,
                slides[index].accent,
                colors.textSecondary,
              ],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: dotColor,
                  },
                ]}
              />
            );
          })}
        </View>

        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: slides[currentIndex].accent }]}
          labelStyle={styles.nextButtonLabel}
          icon={currentIndex === slides.length - 1 ? 'rocket-launch' : 'arrow-right'}
        >
          {currentIndex === slides.length - 1 ? 'Launch Q-Empire' : 'Next'}
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  characterContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  allCharsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 200,
  },
  charLeft: {
    transform: [{ translateX: -20 }],
  },
  charCenter: {
    transform: [{ translateY: -20 }],
    zIndex: 2,
  },
  charRight: {
    transform: [{ translateX: 20 }],
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  nextButton: {
    borderRadius: borderRadius.xl,
    paddingVertical: 6,
    shadowColor: colors.electricBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.deepObsidian,
  },
});
