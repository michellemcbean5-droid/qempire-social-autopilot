import React, { useState } from 'react';
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
  List,
  Avatar,
  IconButton,
  Text,
  Surface,
  Divider,
  DataTable,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

import { RootStackParamList } from '@/navigation';
import { useContentStore } from '@/store/contentStore';
import { usePlatformStore } from '@/store/platformStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { theme, colors, spacing, borderRadius, shadows } from '@/constants/theme';
import UpgradePrompt from '@/components/UpgradePrompt';
import SkeletonAnalytics from '@/components/SkeletonAnalytics';

const screenWidth = Dimensions.get('window').width - 32;

export default function AnalyticsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, getStats } = useContentStore();
  const { platforms } = usePlatformStore();
  const { currentTier, getLimits, canUseFeature } = useSubscriptionStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const limits = getLimits();
  const stats = getStats();
  const hasAdvancedAnalytics = canUseFeature('advancedAnalytics');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Sample data for charts
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [120, 145, 98, 167, 134, 189, 156],
      color: () => colors.royalBlue,
    }],
  };

  const platformData = {
    labels: ['FB', 'IG', 'X', 'LI', 'TT'],
    datasets: [{
      data: [450, 380, 290, 210, 340],
    }],
  };

  const pieData = [
    { name: 'Facebook', population: 450, color: '#1877F2', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'Instagram', population: 380, color: '#E4405F', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'X/Twitter', population: 290, color: '#1DA1F2', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'LinkedIn', population: 210, color: '#0A66C2', legendFontColor: colors.textSecondary, legendFontSize: 12 },
    { name: 'TikTok', population: 340, color: '#000000', legendFontColor: colors.textSecondary, legendFontSize: 12 },
  ];

  const chartConfig = {
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
  };

  if (!hasAdvancedAnalytics) {
    return (
      <View style={styles.container}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your social media performance</Text>
        </Surface>
        
        <Card style={styles.upgradeCard}>
          <Card.Content>
            <Text style={styles.upgradeIcon}>📊</Text>
            <Text style={styles.upgradeTitle}>Advanced Analytics</Text>
            <Text style={styles.upgradeText}>
              Upgrade to Pro or Elite to unlock detailed analytics, engagement tracking, 
              and performance insights across all your platforms.
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowUpgrade(true)}
              style={styles.upgradeButton}
              buttonColor={colors.warmGold}
              textColor={colors.deepObsidian}
            >
              Upgrade to Unlock
            </Button>
          </Card.Content>
        </Card>

        <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.royalBlue} />
      }
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>
              {stats.published} posts published | {stats.total} total
            </Text>
          </View>
          <View style={styles.timeRangeSelector}>
            {(['7d', '30d', '90d'] as const).map(range => (
              <Button
                key={range}
                mode={timeRange === range ? 'contained' : 'text'}
                onPress={() => setTimeRange(range)}
                style={styles.timeButton}
                buttonColor={timeRange === range ? colors.royalBlue : undefined}
                textColor={timeRange === range ? colors.softWhite : colors.textSecondary}
                compact
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </View>
        </View>
      </Surface>

      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewNumber}>1,890</Text>
            <Text style={styles.overviewLabel}>Total Impressions</Text>
            <Text style={styles.overviewChange}>+12.5% vs last period</Text>
          </Card.Content>
        </Card>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewNumber}>342</Text>
            <Text style={styles.overviewLabel}>Engagements</Text>
            <Text style={styles.overviewChange}>+8.3% vs last period</Text>
          </Card.Content>
        </Card>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewNumber}>18.1%</Text>
            <Text style={styles.overviewLabel}>Engagement Rate</Text>
            <Text style={styles.overviewChange}>+2.1% vs last period</Text>
          </Card.Content>
        </Card>
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text style={styles.overviewNumber}>67</Text>
            <Text style={styles.overviewLabel}>Link Clicks</Text>
            <Text style={styles.overviewChange}>+5.7% vs last period</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Engagement Chart */}
      <Card style={styles.chartCard}>
        <Card.Title title="Engagement Trend" titleStyle={styles.chartTitle} />
        <Card.Content>
          <LineChart
            data={engagementData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Platform Performance */}
      <Card style={styles.chartCard}>
        <Card.Title title="Platform Performance" titleStyle={styles.chartTitle} />
        <Card.Content>
          <BarChart
            data={platformData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Platform Distribution */}
      <Card style={styles.chartCard}>
        <Card.Title title="Platform Distribution" titleStyle={styles.chartTitle} />
        <Card.Content>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Top Performing Posts */}
      <Card style={styles.tableCard}>
        <Card.Title title="Top Performing Posts" titleStyle={styles.chartTitle} />
        <Card.Content>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title textStyle={styles.tableHeaderText}>Platform</DataTable.Title>
              <DataTable.Title textStyle={styles.tableHeaderText}>Engagement</DataTable.Title>
              <DataTable.Title textStyle={styles.tableHeaderText}>Reach</DataTable.Title>
              <DataTable.Title textStyle={styles.tableHeaderText}>Rate</DataTable.Title>
            </DataTable.Header>
            
            {posts.slice(0, 5).map(post => (
              <DataTable.Row key={post.id} style={styles.tableRow}>
                <DataTable.Cell textStyle={styles.tableCell}>{post.platformName}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.tableCell}>{Math.round(post.engagementScore * 100)}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.tableCell}>{Math.round(post.engagementScore * 500)}</DataTable.Cell>
                <DataTable.Cell textStyle={styles.tableCell}>{(post.engagementScore * 20).toFixed(1)}%</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
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
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  timeButton: {
    borderRadius: borderRadius.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  overviewCard: {
    width: '47%',
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  overviewChange: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
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
  tableCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  tableHeader: {
    backgroundColor: colors.deepObsidian,
  },
  tableHeaderText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  tableRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  tableCell: {
    color: colors.softWhite,
  },
  upgradeCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  upgradeIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  upgradeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
  },
});
