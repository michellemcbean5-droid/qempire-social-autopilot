import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Surface,
  Chip,
  Card,
  IconButton,
  HelperText,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { usePlatformStore } from '@/store/platformStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { PLATFORM_REGISTRY_MOBILE } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function PlatformDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { platforms, connectPlatform, disconnectPlatform } = usePlatformStore();
  const { currentTier, getLimits } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const platformId = (route.params as any)?.platformId;
  const platform = platforms.find(p => p.id === platformId);
  
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const limits = getLimits();
  const connectedCount = platforms.filter(p => p.connected).length;
  const registry = PLATFORM_REGISTRY_MOBILE[platformId as keyof typeof PLATFORM_REGISTRY_MOBILE];

  if (!platform || !registry) {
    return (
      <View style={styles.container}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>Platform Not Found</Text>
          <Text style={styles.headerSubtitle}>The requested platform does not exist.</Text>
        </Surface>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          buttonColor={colors.royalBlue}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const handleConnect = () => {
    if (connectedCount >= limits.maxPlatforms && !platform.connected) {
      setShowUpgrade(true);
      return;
    }
    setShowConnectDialog(true);
  };

  const handleConnectConfirm = async () => {
    setIsConnecting(true);
    try {
      await connectPlatform(platform.id, credentials);
      addNotification({
        type: 'success',
        title: 'Platform Connected',
        message: `${platform.name} has been successfully connected.`,
      });
      setShowConnectDialog(false);
      setCredentials({});
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: `Failed to connect ${platform.name}. Please check your credentials.`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectPlatform(platform.id);
    addNotification({
      type: 'info',
      title: 'Platform Disconnected',
      message: `${platform.name} has been disconnected.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'error': return colors.error;
      case 'rate_limited': return colors.warning;
      default: return colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.platformEmoji}>{registry.emoji}</Text>
            <View style={styles.headerInfo}>
              <Text style={styles.platformName}>{platform.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(platform.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(platform.status) }]}>
                  {platform.status}
                </Text>
              </View>
            </View>
          </View>
        </Surface>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{platform.postsToday}</Text>
              <Text style={styles.statLabel}>Posts Today</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{platform.totalPosts}</Text>
              <Text style={styles.statLabel}>Total Posts</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{registry.maxChars.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Max Chars</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Features */}
        <Card style={styles.featuresCard}>
          <Card.Title title="Platform Features" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.featureRow}>
              <IconButton icon="image" size={20} iconColor={registry.supportsImages ? colors.success : colors.textMuted} />
              <Text style={styles.featureText}>
                Images {registry.supportsImages ? 'Supported' : 'Not Supported'}
              </Text>
            </View>
            <View style={styles.featureRow}>
              <IconButton icon="video" size={20} iconColor={registry.supportsVideo ? colors.success : colors.textMuted} />
              <Text style={styles.featureText}>
                Video {registry.supportsVideo ? 'Supported' : 'Not Supported'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Connection Status */}
        <Card style={styles.connectionCard}>
          <Card.Content>
            <View style={styles.connectionHeader}>
              <Text style={styles.connectionTitle}>
                {platform.connected ? 'Connected' : 'Not Connected'}
              </Text>
              <Chip
                style={[
                  styles.connectionChip,
                  { backgroundColor: platform.connected ? colors.success + '20' : colors.error + '20' }
                ]}
                textStyle={{ color: platform.connected ? colors.success : colors.error }}
              >
                {platform.connected ? 'Active' : 'Inactive'}
              </Chip>
            </View>

            {platform.connected ? (
              <Button
                mode="outlined"
                onPress={handleDisconnect}
                style={styles.disconnectButton}
                textColor={colors.error}
                icon="link-off"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={handleConnect}
                style={styles.connectButton}
                buttonColor={colors.royalBlue}
                icon="link"
              >
                Connect Platform
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  featuresCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: 14,
    color: colors.softWhite,
  },
  connectionCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.softWhite,
  },
  connectionChip: {
    borderRadius: borderRadius.full,
  },
  connectButton: {
    borderRadius: borderRadius.md,
  },
  disconnectButton: {
    borderRadius: borderRadius.md,
    borderColor: colors.error,
  },
  backButton: {
    margin: spacing.lg,
    borderRadius: borderRadius.md,
  },
});
