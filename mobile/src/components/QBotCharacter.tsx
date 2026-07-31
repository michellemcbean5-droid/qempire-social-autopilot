import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, LinearGradient, Stop, RadialGradient, Rect } from 'react-native-svg';

interface QBotProps {
  size?: number;
  animated?: boolean;
  style?: any;
  mood?: 'happy' | 'thinking' | 'working' | 'celebrating';
}

export default function QBotCharacter({ size = 180, animated = true, style, mood = 'happy' }: QBotProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const eyeGlow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!animated) return;

    // Floating hover
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 10, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Gentle rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 3, duration: 2000, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -3, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Pulse glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Eye glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(eyeGlow, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(eyeGlow, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [-3, 3],
    outputRange: ['-3deg', '3deg'],
  });

  const moodColors = {
    happy: { eye: '#00FF00', mouth: 'smile' },
    thinking: { eye: '#FFD700', mouth: 'neutral' },
    working: { eye: '#00FFFF', mouth: 'focused' },
    celebrating: { eye: '#FF69B4', mouth: 'bigsmile' },
  };

  const currentMood = moodColors[mood];

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [
            { translateY: floatAnim },
            { rotate: rotation },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <Svg width={size} height={size * 1.1} viewBox="0 0 180 200">
        <Defs>
          <LinearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#1a1a3e" />
            <Stop offset="50%" stopColor="#0d0d2b" />
            <Stop offset="100%" stopColor="#0a0a1a" />
          </LinearGradient>
          <LinearGradient id="botHead" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2a2a5e" />
            <Stop offset="100%" stopColor="#1a1a3e" />
          </LinearGradient>
          <LinearGradient id="antennaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00FFFF" />
            <Stop offset="100%" stopColor="#008B8B" />
          </LinearGradient>
          <RadialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={currentMood.eye} stopOpacity="1" />
            <Stop offset="100%" stopColor={currentMood.eye} stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="chestGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#4169E1" />
            <Stop offset="50%" stopColor="#BF00FF" />
            <Stop offset="100%" stopColor="#00FFFF" />
          </LinearGradient>
        </Defs>

        {/* Shadow */}
        <Ellipse cx="90" cy="195" rx="50" ry="8" fill="#000" opacity="0.3">
          <animate attributeName="rx" values="50;45;50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.2;0.3" dur="3s" repeatCount="indefinite" />
        </Ellipse>

        {/* Body */}
        <Path
          d="M50,100 Q45,160 55,185 Q90,195 125,185 Q135,160 130,100 Z"
          fill="url(#botBody)"
          stroke="#2a2a5e"
          strokeWidth="2"
        />

        {/* Body panel lines */}
        <Path d="M55,130 Q90,135 125,130" stroke="#2a2a5e" strokeWidth="1" fill="none" />
        <Path d="M58,155 Q90,160 122,155" stroke="#2a2a5e" strokeWidth="1" fill="none" />

        {/* Chest Q Logo */}
        <Circle cx="90" cy="140" r="18" fill="url(#chestGlow)" opacity="0.9" />
        <Path d="M84,134 Q90,129 96,134 Q96,142 90,145 Q84,142 84,134" stroke="#FFF" strokeWidth="2" fill="none" />
        <Path d="M93,143 L97,147" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

        {/* Chest glow pulse */}
        <Circle cx="90" cy="140" r="22" fill="url(#chestGlow)" opacity="0.2">
          <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
        </Circle>

        {/* Shoulders */}
        <Ellipse cx="35" cy="105" rx="18" ry="12" fill="url(#botBody)" stroke="#2a2a5e" strokeWidth="2" />
        <Ellipse cx="145" cy="105" rx="18" ry="12" fill="url(#botBody)" stroke="#2a2a5e" strokeWidth="2" />

        {/* Arms */}
        <Path d="M25,105 Q15,130 20,155" stroke="url(#botBody)" strokeWidth="12" strokeLinecap="round" fill="none" />
        <Path d="M155,105 Q165,130 160,155" stroke="url(#botBody)" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <Circle cx="20" cy="158" r="8" fill="#2a2a5e" />
        <Circle cx="160" cy="158" r="8" fill="#2a2a5e" />

        {/* Head */}
        <Path
          d="M55,40 Q50,90 55,100 Q90,108 125,100 Q130,90 125,40 Q90,25 55,40"
          fill="url(#botHead)"
          stroke="#3a3a6e"
          strokeWidth="2"
        />

        {/* Face screen */}
        <Path
          d="M62,48 Q58,85 62,92 Q90,98 118,92 Q122,85 118,48 Q90,42 62,48"
          fill="#0a0a1a"
          stroke="#00FFFF"
          strokeWidth="1.5"
        />

        {/* Eyes */}
        <AnimatedG opacity={eyeGlow}>
          <Circle cx="78" cy="68" r="8" fill={currentMood.eye} />
          <Circle cx="102" cy="68" r="8" fill={currentMood.eye} />
          <Circle cx="78" cy="66" r="3" fill="#FFF" opacity="0.8" />
          <Circle cx="102" cy="66" r="3" fill="#FFF" opacity="0.8" />
        </AnimatedG>

        {/* Eye glow halos */}
        <Circle cx="78" cy="68" r="14" fill="url(#eyeGlow)" opacity="0.3" />
        <Circle cx="102" cy="68" r="14" fill="url(#eyeGlow)" opacity="0.3" />

        {/* Mouth */}
        {currentMood.mouth === 'smile' && (
          <Path d="M82,82 Q90,88 98,82" stroke={currentMood.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {currentMood.mouth === 'bigsmile' && (
          <Path d="M80,80 Q90,92 100,80" stroke={currentMood.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {currentMood.mouth === 'neutral' && (
          <Path d="M85,84 L95,84" stroke={currentMood.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {currentMood.mouth === 'focused' && (
          <Path d="M85,82 L90,86 L95,82" stroke={currentMood.eye} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Antenna */}
        <Path d="M90,28 L90,12" stroke="#3a3a6e" strokeWidth="3" strokeLinecap="round" />
        <Circle cx="90" cy="8" r="6" fill="url(#antennaGrad)">
          <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="90" cy="8" r="12" fill="#00FFFF" opacity="0.15">
          <animate attributeName="r" values="12;16;12" dur="1s" repeatCount="indefinite" />
        </Circle>

        {/* Ear / side panels */}
        <Rect x="48" y="55" width="6" height="20" rx="3" fill="#2a2a5e" stroke="#3a3a6e" strokeWidth="1" />
        <Rect x="126" y="55" width="6" height="20" rx="3" fill="#2a2a5e" stroke="#3a3a6e" strokeWidth="1" />

        {/* Data particles floating around */}
        <Circle cx="30" cy="50" r="2" fill="#00FFFF" opacity="0.6">
          <animate attributeName="cy" values="50;30;50" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="150" cy="70" r="2" fill="#BF00FF" opacity="0.5">
          <animate attributeName="cy" values="70;50;70" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="40" cy="170" r="1.5" fill="#4169E1" opacity="0.4">
          <animate attributeName="cy" values="170;150;170" dur="2s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="140" cy="160" r="1.5" fill="#00FF00" opacity="0.4">
          <animate attributeName="cy" values="160;140;160" dur="2.8s" repeatCount="indefinite" />
        </Circle>
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
