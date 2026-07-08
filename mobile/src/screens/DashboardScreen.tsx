import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ProgressBar,
  Divider,
  List,
  Avatar,
  Badge,
  Text,
  IconButton,
  Surface,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { usePlatformStore } from '@/store/platformStore';
import { useContentStore } from '@/store/contentStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { theme, colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { SUBSCRIPTION_LIMITS } from '@/constants/config';
import SkeletonDashboard from '@/components/SkeletonDashboard';
import UpgradePrompt from '@/components/UpgradePrompt';

const screenWidth = Dimensions.get('window').width - 32;

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const { platforms, getConnectedCount } = usePlatformStore();
  const { getStats, queue } = useContentStore();
  const { currentTier, getLimits } = useSubscriptionStore();
  const { unreadCount } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const stats = getStats();
  const connectedCount = getConnectedCount();
  const limits = getLimits();
  const tierColor = currentTier === 'elite' ? colors.tierElite : 
                    currentTier === 'pro' ? colors.tierPro :
                    currentTier === 'basic' ? colors.tierBasic : colors.tierFree;

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  if (loading) {
    return <SkeletonDashboard />;
  }

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [45, 62, 38, 75, 55, 82, 68],
    }],
  };

  const platformData = {
    labels: ['FB', 'IG', 'X', 'LI', 'TT'],
    datasets: [{
      data: [120, 85, 95, 60, 40],
    }],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.royalBlue} />
      }
    >
      {/* Header Section */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back, {user?.name || 'User'}!</Text>
            <Text style={styles.subGreeting}>Your social empire is running smoothly</Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon="bell"
              size={24}
              iconColor={colors.softWhite}
              onPress={() => navigation.navigate('Notifications')}
            />
            {unreadCount > 0 && (
              <Badge style={styles.badge}>{unreadCount}</Badge>
            )}
          </View>
        </View>
        
        <View style={styles.tierBadge}>
          <Chip 
            style={[styles.tierChip, { backgroundColor: tierColor + '20', borderColor: tierColor }]}
            textStyle={{ color: tierColor, fontWeight: '700' }}
          >
            {currentTier.toUpperCase()} PLAN
          </Chip>
          <Text style={styles.tierPrice}>{limits.priceDisplay}</Text>
        </View>
      </Surface>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{connectedCount}</Text>
            <Text style={styles.statLabel}>Connected Platforms</Text>
            <ProgressBar 
              progress={connectedCount / limits.maxPlatforms} 
              color={colors.royalBlue}
              style={styles.progressBar}
            />
            <Text style={styles.statLimit}>{connectedCount}/{limits.maxPlatforms} max</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.published}</Text>
            <Text style={styles.statLabel}>Posts Published</Text>
            <ProgressBar 
              progress={stats.published / limits.maxPostsPerDay} 
              color={colors.success}
              style={styles.progressBar}
            />
            <Text style={styles.statLimit}>Today: {stats.published}/{limits.maxPostsPerDay}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{queue.length}</Text>
            <Text style={styles.statLabel}>In Queue</Text>
            <ProgressBar 
              progress={queue.length / 20} 
              color={colors.warning}
              style={styles.progressBar}
            />
            <Text style={styles.statLimit}>Ready to publish</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
            <ProgressBar 
              progress={1} 
              color={colors.electricPurple}
              style={styles.progressBar}
            />
            <Text style={styles.statLimit}>All time</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Charts Section */}
      {limits.advancedAnalytics && (
        <>
          <Card style={styles.chartCard}>
            <Card.Title title="Engagement Trend" titleStyle={styles.chartTitle} />
            <Card.Content>
              <LineChart
                data={engagementData}
                width={screenWidth}
                height={180}
                chartConfig={{
                  backgroundColor: colors.midnightNavy,
                  backgroundGradientFrom: colors.midnightNavy,
                  backgroundGradientTo: colors.deepObsidian,
                  decimalPlaces: 0,
                  color: () => colors.royalBlue,
                  labelColor: () => colors.textSecondary,
                  style: { borderRadius: borderRadius.lg },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: colors.neonAqua,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </Card.Content>
          </Card>

          <Card style={styles.chartCard}>
            <Card.Title title="Platform Performance" titleStyle={styles.chartTitle} />
            <Card.Content>
              <BarChart
                data={platformData}
                width={screenWidth}
                height={180}
                chartConfig={{
                  backgroundColor: colors.midnightNavy,
                  backgroundGradientFrom: colors.midnightNavy,
                  backgroundGradientTo: colors.deepObsidian,
                  decimalPlaces: 0,
                  color: () => colors.electricPurple,
                  labelColor: () => colors.textSecondary,
                  style: { borderRadius: borderRadius.lg },
                }}
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Title title="Quick Actions" titleStyle={styles.chartTitle} />
        <Card.Content>
          <View style={styles.actionGrid}>
            <Button
              mode="contained"
              icon="web"
              onPress={() => navigation.navigate('WebsiteAnalysis')}
              style={styles.actionButton}
              buttonColor={colors.royalBlue}
            >
              Analyze Website
            </Button>
            <Button
              mode="contained"
              icon="auto-fix"
              onPress={() => navigation.navigate('GenerateContent')}
              style={styles.actionButton}
              buttonColor={colors.electricPurple}
            >
              Generate Content
            </Button>
            <Button
              mode="contained"
              icon="rocket-launch"
              onPress={() => navigation.navigate('AutopilotConfig')}
              style={styles.actionButton}
              buttonColor={colors.neonAqua}
              textColor={colors.deepObsidian}
            >
              Configure Autopilot
            </Button>
            <Button
              mode="outlined"
              icon="crown"
              onPress={() => setShowUpgrade(true)}
              style={styles.actionButton}
              textColor={colors.warmGold}
            >
              Upgrade Plan
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Card.Title title="Recent Activity" titleStyle={styles.chartTitle} />
        <Card.Content>
          {queue.length === 0 ? (
            <Paragraph style={styles.emptyText}>No posts in queue. Generate content to get started!</Paragraph>
          ) : (
            queue.slice(0, 5).map(post => (
              <List.Item
                key={post.id}
                title={post.platformName}
                description={post.content.substring(0, 60) + '...'}
                left={props => (
                  <Avatar.Icon {...props} icon="file-document" size={40} style={{ backgroundColor: colors.royalBlue + '30' }} />
                )}
                right={props => (
                  <Chip {...props} style={{ backgroundColor: colors.warning + '20' }} textStyle={{ color: colors.warning }}>
                    Queued
                  </Chip>
                )}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
              />
            ))
          )}
        </Card.Content>
      </Card>

      <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  header: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierChip: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
  },
  tierPrice: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statLimit: {
    fontSize: 10,
    color: colors.textMuted,
  },
  chartCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  chartTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  chart: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
  },
  actionsCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: borderRadius.md,
  },
  activityCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  listTitle: {
    color: colors.softWhite,
    fontWeight: '600',
  },
  listDescription: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
