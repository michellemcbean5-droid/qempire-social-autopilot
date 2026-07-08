import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Searchbar,
  List,
  Avatar,
  IconButton,
  Text,
  Dialog,
  Portal,
  TextInput,
  Surface,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { usePlatformStore } from '@/store/platformStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { theme, colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { PLATFORM_REGISTRY_MOBILE } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function PlatformsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { platforms, connectPlatform, disconnectPlatform } = usePlatformStore();
  const { currentTier, getLimits } = useSubscriptionStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const limits = getLimits();
  const connectedCount = platforms.filter(p => p.connected).length;

  const filteredPlatforms = platforms.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (platformId: string) => {
    if (connectedCount >= limits.maxPlatforms && !platforms.find(p => p.id === platformId)?.connected) {
      setShowUpgrade(true);
      return;
    }
    setSelectedPlatform(platformId);
    setShowConnectDialog(true);
  };

  const handleConnectConfirm = async () => {
    if (selectedPlatform) {
      await connectPlatform(selectedPlatform, credentials);
      setShowConnectDialog(false);
      setCredentials({});
      setSelectedPlatform(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    disconnectPlatform(platformId);
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
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Platforms</Text>
            <Text style={styles.headerSubtitle}>
              {connectedCount}/{limits.maxPlatforms} connected
            </Text>
          </View>
          <Chip style={styles.tierChip} textStyle={{ color: colors.softWhite }}>
            {currentTier.toUpperCase()}
          </Chip>
        </View>
      </Surface>

      <Searchbar
        placeholder="Search platforms..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{ color: colors.softWhite }}
        iconColor={colors.textSecondary}
        placeholderTextColor={colors.textMuted}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.platformsGrid}>
          {filteredPlatforms.map(platform => {
            const registry = PLATFORM_REGISTRY_MOBILE[platform.id as keyof typeof PLATFORM_REGISTRY_MOBILE];
            return (
              <Card 
                key={platform.id} 
                style={[
                  styles.platformCard,
                  platform.connected && styles.connectedCard
                ]}
              >
                <Card.Content>
                  <View style={styles.platformHeader}>
                    <Text style={styles.platformEmoji}>{registry?.emoji || '📱'}</Text>
                    <View style={styles.platformStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(platform.status) }]} />
                      <Text style={styles.statusText}>{platform.status}</Text>
                    </View>
                  </View>
                  
                  <Title style={styles.platformName}>{platform.name}</Title>
                  <Paragraph style={styles.platformMeta}>
                    Max {registry?.maxChars?.toLocaleString() || 'N/A'} chars
                  </Paragraph>
                  
                  <View style={styles.platformFeatures}>
                    {registry?.supportsImages && (
                      <Chip style={styles.featureChip} textStyle={styles.featureText}>Images</Chip>
                    )}
                    {registry?.supportsVideo && (
                      <Chip style={styles.featureChip} textStyle={styles.featureText}>Video</Chip>
                    )}
                  </View>

                  <View style={styles.platformStats}>
                    <Text style={styles.statText}>Posts today: {platform.postsToday}</Text>
                    <Text style={styles.statText}>Total: {platform.totalPosts}</Text>
                  </View>

                  <Button
                    mode={platform.connected ? "outlined" : "contained"}
                    onPress={() => platform.connected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                    style={styles.connectButton}
                    buttonColor={platform.connected ? undefined : colors.royalBlue}
                    textColor={platform.connected ? colors.error : colors.softWhite}
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showConnectDialog} onDismiss={() => setShowConnectDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Connect {selectedPlatform}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Enter your API credentials for {selectedPlatform}</Text>
            <TextInput
              label="Access Token"
              value={credentials.access_token || ''}
              onChangeText={text => setCredentials(prev => ({ ...prev, access_token: text }))}
              style={styles.input}
              textColor={colors.softWhite}
              mode="outlined"
            />
            <TextInput
              label="Additional ID (optional)"
              value={credentials.page_id || ''}
              onChangeText={text => setCredentials(prev => ({ ...prev, page_id: text }))}
              style={styles.input}
              textColor={colors.softWhite}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConnectDialog(false)} textColor={colors.textSecondary}>Cancel</Button>
            <Button onPress={handleConnectConfirm} textColor={colors.royalBlue}>Connect</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
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
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tierChip: {
    backgroundColor: colors.royalBlue + '30',
  },
  searchBar: {
    margin: spacing.md,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
  },
  scrollView: {
    flex: 1,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  platformCard: {
    width: '47%',
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  connectedCard: {
    borderColor: colors.success + '40',
    borderWidth: 1,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  platformEmoji: {
    fontSize: 24,
  },
  platformStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  platformName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.softWhite,
  },
  platformMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  platformFeatures: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  featureChip: {
    backgroundColor: colors.royalBlue + '20',
    height: 24,
  },
  featureText: {
    fontSize: 10,
    color: colors.royalBlue,
  },
  platformStats: {
    marginBottom: spacing.sm,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  connectButton: {
    borderRadius: borderRadius.md,
  },
  dialog: {
    backgroundColor: colors.midnightNavy,
  },
  dialogTitle: {
    color: colors.softWhite,
  },
  dialogText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.sm,
  },
});
