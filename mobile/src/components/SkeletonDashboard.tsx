import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Surface, ProgressBar } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function SkeletonDashboard() {
  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <View style={[styles.skeletonLine, { width: '60%', height: 24, marginBottom: 8 }]} />
            <View style={[styles.skeletonLine, { width: '40%', height: 14 }]} />
          </View>
          <View style={[styles.skeletonCircle, { width: 40, height: 40 }]} />
        </View>
        <View style={[styles.skeletonLine, { width: '30%', height: 20, marginTop: 16 }]} />
      </Surface>

      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} style={styles.statCard}>
            <Card.Content>
              <View style={[styles.skeletonLine, { width: '50%', height: 28, marginBottom: 8 }]} />
              <View style={[styles.skeletonLine, { width: '70%', height: 14, marginBottom: 12 }]} />
              <View style={[styles.skeletonLine, { width: '100%', height: 4, marginBottom: 8 }]} />
              <View style={[styles.skeletonLine, { width: '40%', height: 10 }]} />
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={[styles.skeletonLine, { width: '40%', height: 20, marginBottom: 16 }]} />
          <View style={[styles.skeletonBox, { width: '100%', height: 180 }]} />
        </Card.Content>
      </Card>
    </View>
  );
}

export function SkeletonContent() {
  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <View style={[styles.skeletonLine, { width: '50%', height: 24 }]} />
          </View>
          <View style={[styles.skeletonLine, { width: 80, height: 36 }]} />
        </View>
      </Surface>

      <View style={styles.tabBar}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.skeletonLine, { width: '30%', height: 36, borderRadius: 8 }]} />
        ))}
      </View>

      {[1, 2, 3].map((i) => (
        <Card key={i} style={styles.postCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={[styles.skeletonLine, { width: '30%', height: 20 }]} />
              <View style={[styles.skeletonLine, { width: 60, height: 24 }]} />
            </View>
            <View style={[styles.skeletonLine, { width: '100%', height: 16, marginTop: 12 }]} />
            <View style={[styles.skeletonLine, { width: '80%', height: 16, marginTop: 8 }]} />
            <View style={[styles.skeletonLine, { width: '60%', height: 16, marginTop: 8 }]} />
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

export function SkeletonAnalytics() {
  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={[styles.skeletonLine, { width: '40%', height: 24, marginBottom: 8 }]} />
        <View style={[styles.skeletonLine, { width: '60%', height: 14 }]} />
      </Surface>

      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} style={styles.statCard}>
            <Card.Content>
              <View style={[styles.skeletonLine, { width: '60%', height: 28, marginBottom: 8 }]} />
              <View style={[styles.skeletonLine, { width: '50%', height: 14 }]} />
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={[styles.skeletonBox, { width: '100%', height: 200 }]} />
        </Card.Content>
      </Card>
    </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
  chartCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  postCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  tabBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    justifyContent: 'space-around',
  },
  skeletonLine: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  skeletonCircle: {
    backgroundColor: colors.border,
    borderRadius: 20,
  },
  skeletonBox: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.lg,
  },
});
