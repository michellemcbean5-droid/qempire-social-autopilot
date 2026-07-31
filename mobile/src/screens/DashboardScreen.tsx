import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, Card, Button, Avatar, Badge, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

const { width } = Dimensions.get('window');

const AnimatedCard = Animated.createAnimatedComponent(Card);

const PLATFORM_DATA = [
  { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', posts: 142, status: 'active' },
  { name: 'Instagram', icon: 'logo-instagram', color: '#E4405F', posts: 98, status: 'active' },
  { name: 'X / Twitter', icon: 'logo-twitter', color: '#1DA1F2', posts: 215, status: 'active' },
  { name: 'LinkedIn', icon: 'logo-linkedin', color: '#0A66C2', posts: 67, status: 'active' },
  { name: 'TikTok', icon: 'musical-notes', color: '#000000', posts: 45, status: 'active' },
];

const STATS_DATA = [
  { label: 'Posts This Month', value: '2.4K', icon: 'document-text', color: colors.electricBlue, trend: '+34%' },
  { label: 'Total Reach', value: '89K', icon: 'eye', color: colors.hotPink, trend: '+52%' },
  { label: 'Engagements', value: '12.3K', icon: 'heart', color: colors.electricYellow, trend: '+28%' },
  { label: 'Platforms Active', value: '18/25', icon: 'link', color: colors.neonGreen, trend: '+3 new' },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { tier } = useSubscriptionStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnims = useRef(STATS_DATA.map(() => new Animated.Value(0.8))).current;
  const platformAnims = useRef(PLATFORM_DATA.map(() => new Animated.Value(0))).current;
  const autopilotPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Stagger stat cards
    Animated.stagger(100,
      scaleAnims.map(anim =>
        Animated.spring(anim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
      )
    ).start();

    // Stagger platform items
    Animated.stagger(80,
      platformAnims.map(anim =>
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })
      )
    ).start();

    // Autopilot pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(autopilotPulse, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(autopilotPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const getTierColor = () => {
    switch (tier) {
      case 'elite': return colors.warmGold;
      case 'pro': return colors.electricPurple;
      case 'basic': return colors.electricBlue;
      default: return colors.textSecondary;
    }
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'elite': return '👑';
      case 'pro': return '💎';
      case 'basic': return '⭐';
      default: return '🆓';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[
        styles.header,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]]}>
        <View>
          <Text style={styles.greeting}>Good Evening 👋</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Q-Empire </Text>
            <LinearGradient
              colors={[colors.electricYellow, colors.hotPink]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextBg}
            >
              <Text style={styles.titleGradient}>Dashboard</Text>
            </LinearGradient>
          </View>
        </View>
        <View style={styles.profileSection}>
          <Avatar.Text
            size={44}
            label={getTierIcon()}
            style={{ backgroundColor: getTierColor() + '30' }}
            labelStyle={{ fontSize: 20 }}
          />
          <Badge style={[styles.tierBadge, { backgroundColor: getTierColor() }]}>
            {tier?.toUpperCase() || 'FREE'}
          </Badge>
        </View>
      </Animated.View>

      {/* Autopilot Status Card */}
      <Animated.View style={[
        { transform: [{ scale: autopilotPulse }] },
        { marginHorizontal: spacing.md, marginBottom: spacing.lg }
      ]}>
        <LinearGradient
          colors={[colors.electricBlue + '20', colors.electricPurple + '15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.autopilotCard}
        >
          <View style={styles.autopilotHeader}>
            <View style={styles.autopilotTitleRow}>
              <Ionicons name="rocket" size={24} color={colors.electricBlue} />
              <Text style={styles.autopilotTitle}>Autopilot</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.autopilotInfo}>
            Next post in <Text style={styles.highlight}>2h 14m</Text> • 18 platforms connected • <Text style={styles.highlight}>847 posts</Text> queued
          </Text>
          <View style={styles.progressContainer}>
            <ProgressBar progress={0.72} color={colors.electricBlue} style={styles.progressBar} />
            <Text style={styles.progressText}>72% of daily quota used</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {STATS_DATA.map((stat, index) => (
          <Animated.View
            key={stat.label}
            style={[
              styles.statCard,
              { transform: [{ scale: scaleAnims[index] }] }
            ]}
          >
            <LinearGradient
              colors={[stat.color + '15', stat.color + '05']}
              style={styles.statGradient}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '25' }]}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statTrend, { color: stat.color }]}>↑ {stat.trend}</Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>

      {/* Connected Platforms */}
      <View style={styles.sectionHeader}>
        <Ionicons name="share-social" size={20} color={colors.electricBlue} />
        <Text style={styles.sectionTitle}>Connected Platforms</Text>
      </View>

      <View style={styles.platformList}>
        {PLATFORM_DATA.map((platform, index) => (
          <Animated.View
            key={platform.name}
            style={[
              { opacity: platformAnims[index] },
              { transform: [{ translateX: platformAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) }] }
            ]}
          >
            <TouchableOpacity
              style={styles.platformItem}
              onPress={() => navigation.navigate('PlatformDetail', { platformId: platform.name.toLowerCase() })}
              activeOpacity={0.7}
            >
              <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                <Ionicons
                  name={platform.icon as any}
                  size={24}
                  color={platform.color}
                />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformStatus}>● Active • {platform.posts} posts this week</Text>
              </View>
              <View style={styles.platformToggle}>
                <View style={[styles.toggleActive, { backgroundColor: colors.success }]}>
                  <View style={styles.toggleKnob} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Ionicons name="flash" size={20} color={colors.electricYellow} />
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('GenerateContent')}
        >
          <LinearGradient
            colors={[colors.hotPink, colors.electricPurple]}
            style={styles.actionGradient}
          >
            <Ionicons name="create" size={28} color="white" />
            <Text style={styles.actionText}>Generate</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('WebsiteAnalysis')}
        >
          <LinearGradient
            colors={[colors.electricBlue, colors.deepObsidian]}
            style={styles.actionGradient}
          >
            <Ionicons name="globe" size={28} color="white" />
            <Text style={styles.actionText}>Analyze</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AutopilotConfig')}
        >
          <LinearGradient
            colors={[colors.electricYellow, colors.hotPink]}
            style={styles.actionGradient}
          >
            <Ionicons name="time" size={28} color="white" />
            <Text style={styles.actionText}>Schedule</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
  },
  gradientTextBg: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  titleGradient: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.deepObsidian,
  },
  profileSection: {
    alignItems: 'center',
  },
  tierBadge: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
  },
  autopilotCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.electricBlue + '30',
  },
  autopilotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  autopilotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autopilotTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  autopilotInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  highlight: {
    color: colors.electricYellow,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.deepObsidian,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: 10,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: (width - spacing.md * 2 - 10) / 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  statGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.softWhite,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statTrend: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
  },
  platformList: {
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  platformIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.softWhite,
  },
  platformStatus: {
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
  platformToggle: {
    width: 48,
    alignItems: 'center',
  },
  toggleActive: {
    width: 48,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 10,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  actionGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100,
  },
});
