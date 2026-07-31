import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface MermaidProps {
  size?: number;
  animated?: boolean;
  style?: any;
}

export default function MermaidCharacter({ size = 200, animated = true, style }: MermaidProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const hairWave = useRef(new Animated.Value(0)).current;
  const tailWave = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 15, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Hair waving
    Animated.loop(
      Animated.sequence([
        Animated.timing(hairWave, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(hairWave, { toValue: -1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Tail swaying
    Animated.loop(
      Animated.sequence([
        Animated.timing(tailWave, { toValue: 8, duration: 1800, useNativeDriver: true }),
        Animated.timing(tailWave, { toValue: -8, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Gentle scale pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.02, duration: 3000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const hairRotation = hairWave.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  const tailRotation = tailWave.interpolate({
    inputRange: [-8, 8],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [
            { translateY: floatAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Svg width={size} height={size * 1.2} viewBox="0 0 200 240">
        <Defs>
          <LinearGradient id="tailGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00CED1" />
            <Stop offset="50%" stopColor="#20B2AA" />
            <Stop offset="100%" stopColor="#008B8B" />
          </LinearGradient>
          <LinearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF8DC" />
            <Stop offset="30%" stopColor="#FFD700" />
            <Stop offset="70%" stopColor="#DAA520" />
            <Stop offset="100%" stopColor="#B8860B" />
          </LinearGradient>
          <RadialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
            <Stop offset="0%" stopColor="#8B5A2B" />
            <Stop offset="50%" stopColor="#6B4226" />
            <Stop offset="100%" stopColor="#4A2C17" />
          </RadialGradient>
          <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Glow aura */}
        <Circle cx="100" cy="120" r="90" fill="url(#glowGrad)" />

        {/* Tail */}
        <AnimatedG rotation={tailRotation} origin="100,160">
          <Path
            d="M85,140 Q70,170 60,200 Q50,220 40,230 Q55,225 70,220 Q85,215 100,210 Q115,215 130,220 Q145,225 160,230 Q150,220 140,200 Q130,170 115,140 Z"
            fill="url(#tailGrad)"
            stroke="#008B8B"
            strokeWidth="1"
          />
          {/* Tail fins */}
          <Path d="M40,230 Q20,240 30,250 Q45,245 55,235" fill="#00CED1" opacity="0.8" />
          <Path d="M160,230 Q180,240 170,250 Q155,245 145,235" fill="#00CED1" opacity="0.8" />
          {/* Tail scales pattern */}
          <Circle cx="80" cy="170" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="95" cy="175" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="110" cy="170" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="75" cy="190" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="90" cy="195" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="105" cy="195" r="3" fill="#00FFFF" opacity="0.4" />
          <Circle cx="120" cy="190" r="3" fill="#00FFFF" opacity="0.4" />
        </AnimatedG>

        {/* Body / Torso */}
        <Path
          d="M85,100 Q80,120 85,140 L115,140 Q120,120 115,100 Z"
          fill="url(#skinGrad)"
        />

        {/* Shell top */}
        <Path
          d="M80,95 Q100,75 120,95 Q110,105 100,100 Q90,105 80,95"
          fill="#FF6B9D"
          stroke="#FF1493"
          strokeWidth="1"
        />
        <Path d="M90,85 Q100,80 110,85" fill="#FF69B4" opacity="0.6" />

        {/* Arms */}
        <Path d="M80,105 Q60,115 55,125" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <Path d="M120,105 Q140,115 145,125" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <Circle cx="55" cy="125" r="5" fill="url(#skinGrad)" />
        <Circle cx="145" cy="125" r="5" fill="url(#skinGrad)" />

        {/* Neck */}
        <Path d="M92,95 L92,80 L108,80 L108,95" fill="url(#skinGrad)" />

        {/* Head */}
        <Ellipse cx="100" cy="65" rx="22" ry="25" fill="url(#skinGrad)" />

        {/* Face features */}
        {/* Eyes */}
        <Ellipse cx="92" cy="62" rx="5" ry="4" fill="#FFF" />
        <Ellipse cx="108" cy="62" rx="5" ry="4" fill="#FFF" />
        <Circle cx="93" cy="62" r="2.5" fill="#4A2C17" />
        <Circle cx="109" cy="62" r="2.5" fill="#4A2C17" />
        <Circle cx="93.5" cy="61.5" r="1" fill="#FFF" />
        <Circle cx="109.5" cy="61.5" r="1" fill="#FFF" />

        {/* Eyelashes */}
        <Path d="M87,58 Q85,55 83,54" stroke="#4A2C17" strokeWidth="1.5" fill="none" />
        <Path d="M90,57 Q88,53 86,52" stroke="#4A2C17" strokeWidth="1.5" fill="none" />
        <Path d="M113,58 Q115,55 117,54" stroke="#4A2C17" strokeWidth="1.5" fill="none" />
        <Path d="M110,57 Q112,53 114,52" stroke="#4A2C17" strokeWidth="1.5" fill="none" />

        {/* Smile */}
        <Path d="M94,72 Q100,78 106,72" stroke="#4A2C17" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <Ellipse cx="88" cy="70" rx="4" ry="2.5" fill="#FF69B4" opacity="0.3" />
        <Ellipse cx="112" cy="70" rx="4" ry="2.5" fill="#FF69B4" opacity="0.3" />

        {/* Hair - flowing blonde */}
        <AnimatedG rotation={hairRotation} origin="100,40">
          {/* Main hair mass */}
          <Path
            d="M78,45 Q70,30 80,20 Q100,10 120,20 Q130,30 122,45 Q130,60 125,80 Q120,100 115,110 Q100,115 85,110 Q80,100 75,80 Q70,60 78,45"
            fill="url(#hairGrad)"
          />
          {/* Hair strands flowing */}
          <Path d="M75,50 Q60,70 55,90 Q50,110 58,125" stroke="url(#hairGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <Path d="M125,50 Q140,70 145,90 Q150,110 142,125" stroke="url(#hairGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <Path d="M80,35 Q65,50 60,75" stroke="url(#hairGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Path d="M120,35 Q135,50 140,75" stroke="url(#hairGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <Path d="M85,25 Q75,40 70,60" stroke="url(#hairGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <Path d="M115,25 Q125,40 130,60" stroke="url(#hairGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Hair highlight */}
          <Path d="M85,30 Q100,22 115,30" stroke="#FFF8DC" strokeWidth="3" fill="none" opacity="0.6" />
        </AnimatedG>

        {/* Starfish hair accessory */}
        <Path
          d="M115,25 L118,20 L123,22 L120,27 L122,32 L117,30 L112,32 L114,27 L110,22 L115,25"
          fill="#FF69B4"
          stroke="#FF1493"
          strokeWidth="0.5"
        />

        {/* Bubble particles */}
        <Circle cx="60" cy="50" r="3" fill="#00FFFF" opacity="0.5">
          <animate attributeName="cy" values="50;30;50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="140" cy="80" r="2" fill="#00FFFF" opacity="0.4">
          <animate attributeName="cy" values="80;60;80" dur="2.5s" repeatCount="indefinite" />
        </Circle>
        <Circle cx="50" cy="100" r="2.5" fill="#00FFFF" opacity="0.3">
          <animate attributeName="cy" values="100;70;100" dur="3.5s" repeatCount="indefinite" />
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
