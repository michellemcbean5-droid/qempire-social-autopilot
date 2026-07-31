import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface SonProps {
  size?: number;
  animated?: boolean;
  style?: any;
}

export default function SonCharacter({ size = 160, animated = true, style }: SonProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // Bouncy idle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Waving arm
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Blinking
    const blinkLoop = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 100, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.delay(3000),
      ]).start(() => blinkLoop());
    };
    blinkLoop();
  }, []);

  const armRotation = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-25deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { transform: [{ translateY: bounceAnim }] },
      ]}
    >
      <Svg width={size} height={size * 1.15} viewBox="0 0 160 185">
        <Defs>
          <LinearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#4169E1" />
            <Stop offset="100%" stopColor="#1E3A8A" />
          </LinearGradient>
          <LinearGradient id="shortsGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
          <RadialGradient id="sonSkin" cx="50%" cy="40%" r="50%">
            <Stop offset="0%" stopColor="#8B5A2B" />
            <Stop offset="100%" stopColor="#5C3A1E" />
          </RadialGradient>
        </Defs>

        {/* Legs */}
        <Path d="M68,140 L68,175" stroke="#5C3A1E" strokeWidth="10" strokeLinecap="round" />
        <Path d="M92,140 L92,175" stroke="#5C3A1E" strokeWidth="10" strokeLinecap="round" />

        {/* Shoes */}
        <Ellipse cx="68" cy="178" rx="10" ry="5" fill="#EF4444" />
        <Ellipse cx="92" cy="178" rx="10" ry="5" fill="#EF4444" />
        <Path d="M62,176 Q68,173 74,176" stroke="#FFF" strokeWidth="2" fill="none" />
        <Path d="M86,176 Q92,173 98,176" stroke="#FFF" strokeWidth="2" fill="none" />

        {/* Shorts */}
        <Path d="M55,120 L55,145 Q80,150 105,145 L105,120 Z" fill="url(#shortsGrad)" />

        {/* Shirt */}
        <Path d="M50,85 L50,125 Q80,130 110,125 L110,85 Q80,80 50,85" fill="url(#shirtGrad)" />

        {/* Shirt design - Q logo */}
        <Circle cx="80" cy="105" r="12" fill="#FFF" opacity="0.9" />
        <Path d="M75,100 Q80,95 85,100 Q85,108 80,110 Q75,108 75,100" stroke="#4169E1" strokeWidth="2.5" fill="none" />
        <Path d="M83,108 L87,112" stroke="#4169E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Left arm (static) */}
        <Path d="M50,90 Q35,105 30,115" stroke="url(#sonSkin)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <Circle cx="30" cy="115" r="5" fill="url(#sonSkin)" />

        {/* Right arm (waving) */}
        <AnimatedG rotation={armRotation} origin="110,90">
          <Path d="M110,90 Q125,75 135,60" stroke="url(#sonSkin)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <Circle cx="135" cy="60" r="5" fill="url(#sonSkin)" />
        </AnimatedG>

        {/* Neck */}
        <Path d="M74,80 L74,68 L86,68 L86,80" fill="url(#sonSkin)" />

        {/* Head */}
        <Ellipse cx="80" cy="55" rx="20" ry="22" fill="url(#sonSkin)" />

        {/* Face */}
        {/* Eyes with blink */}
        <AnimatedG opacity={blinkAnim}>
          <Ellipse cx="74" cy="52" rx="4" ry="3.5" fill="#FFF" />
          <Ellipse cx="86" cy="52" rx="4" ry="3.5" fill="#FFF" />
          <Circle cx="74.5" cy="52" r="2" fill="#4A2C17" />
          <Circle cx="86.5" cy="52" r="2" fill="#4A2C17" />
          <Circle cx="75" cy="51.5" r="0.8" fill="#FFF" />
          <Circle cx="87" cy="51.5" r="0.8" fill="#FFF" />
        </AnimatedG>

        {/* Smile */}
        <Path d="M75,62 Q80,67 85,62" stroke="#4A2C17" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Cheeks */}
        <Ellipse cx="72" cy="58" rx="3" ry="2" fill="#FF69B4" opacity="0.25" />
        <Ellipse cx="88" cy="58" rx="3" ry="2" fill="#FF69B4" opacity="0.25" />

        {/* Hair - short curly */}
        <Path
          d="M60,42 Q65,30 80,28 Q95,30 100,42 Q102,50 98,55 Q95,50 90,48 Q85,52 80,50 Q75,52 70,48 Q65,50 62,55 Q58,50 60,42"
          fill="#1A1A1A"
        />
        <Path d="M65,35 Q70,30 75,33" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M85,33 Q90,30 95,35" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M70,32 Q75,28 80,31" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Sparkle effects */}
        <Path d="M40,40 L42,45 L47,47 L42,49 L40,54 L38,49 L33,47 L38,45 Z" fill="#FFD700" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </Path>
        <Path d="M120,35 L121,38 L124,39 L121,40 L120,43 L119,40 L116,39 L119,38 Z" fill="#FFD700" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
        </Path>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
