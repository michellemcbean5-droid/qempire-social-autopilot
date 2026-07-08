import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
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
  Dialog,
  Portal,
  TextInput,
  Surface,
  Divider,
  Menu,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useContentStore } from '@/store/contentStore';
import { usePlatformStore } from '@/store/platformStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useBrandStore } from '@/store/brandStore';
import { theme, colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { PLATFORM_REGISTRY_MOBILE } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';
import SkeletonContent from '@/components/SkeletonContent';

export default function ContentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { posts, queue, getStats, isGenerating, isPublishing, generationProgress } = useContentStore();
  const { platforms } = usePlatformStore();
  const { currentTier, getLimits } = useSubscriptionStore();
  const { profile } = useBrandStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentTheme, setContentTheme] = useState('');
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'drafts'>('queue');

  const limits = getLimits();
  const stats = getStats();
  const connectedPlatforms = platforms.filter(p => p.connected);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleGenerate = () => {
    if (stats.total >= limits.maxPostsPerDay) {
      setShowUpgrade(true);
      return;
    }
    setShowGenerateDialog(true);
  };

  const handleGenerateConfirm = () => {
    // Navigate to generate content screen with selected platforms
    navigation.navigate('GenerateContent', { platformIds: selectedPlatforms });
    setShowGenerateDialog(false);
    setSelectedPlatforms([]);
    setContentTheme('');
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'queue': return queue;
      case 'history': return posts.filter(p => p.status === 'published');
      case 'drafts': return posts.filter(p => p.status === 'draft');
      default: return queue;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Content</Text>
            <Text style={styles.headerSubtitle}>
              {stats.total} posts | {queue.length} queued
            </Text>
          </View>
          <Button
            mode="contained"
            icon="auto-fix"
            onPress={handleGenerate}
            style={styles.generateButton}
            buttonColor={colors.electricPurple}
          >
            Generate
          </Button>
        </View>
      </Surface>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['queue', 'history', 'drafts'] as const).map(tab => (
          <Button
            key={tab}
            mode={activeTab === tab ? 'contained' : 'text'}
            onPress={() => setActiveTab(tab)}
            style={styles.tabButton}
            buttonColor={activeTab === tab ? colors.royalBlue : undefined}
            textColor={activeTab === tab ? colors.softWhite : colors.textSecondary}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.royalBlue} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.published}</Text>
              <Text style={styles.statLabel}>Published</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.queued}</Text>
              <Text style={styles.statLabel}>Queued</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.draft}</Text>
              <Text style={styles.statLabel}>Drafts</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>{stats.failed}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Generation Progress */}
        {isGenerating && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text style={styles.progressTitle}>Generating AI Content...</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${generationProgress * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(generationProgress * 100)}% complete</Text>
            </Card.Content>
          </Card>
        )}

        {/* Publishing Progress */}
        {isPublishing && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text style={styles.progressTitle}>Publishing Posts...</Text>
              <Text style={styles.progressText}>Please wait while we publish your content</Text>
            </Card.Content>
          </Card>
        )}

        {/* Posts List */}
        <View style={styles.postsList}>
          {filteredPosts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No posts here yet</Text>
                <Text style={styles.emptyText}>
                  {activeTab === 'queue' 
                    ? 'Generate content to add posts to your queue'
                    : activeTab === 'history'
                    ? 'Published posts will appear here'
                    : 'Save drafts to edit them later'
                  }
                </Text>
                <Button
                  mode="contained"
                  onPress={handleGenerate}
                  style={styles.emptyButton}
                  buttonColor={colors.royalBlue}
                >
                  Generate Content
                </Button>
              </Card.Content>
            </Card>
          ) : (
            filteredPosts.map(post => {
              const registry = PLATFORM_REGISTRY_MOBILE[post.platformId as keyof typeof PLATFORM_REGISTRY_MOBILE];
              return (
                <Card key={post.id} style={styles.postCard}>
                  <Card.Content>
                    <View style={styles.postHeader}>
                      <View style={styles.postPlatform}>
                        <Text style={styles.platformEmoji}>{registry?.emoji || '📱'}</Text>
                        <Text style={styles.platformName}>{post.platformName}</Text>
                      </View>
                      <Chip 
                        style={[
                          styles.statusChip,
                          { 
                            backgroundColor: 
                              post.status === 'published' ? colors.success + '20' :
                              post.status === 'queued' ? colors.warning + '20' :
                              post.status === 'failed' ? colors.error + '20' :
                              colors.info + '20'
                          }
                        ]}
                        textStyle={{
                          color: 
                            post.status === 'published' ? colors.success :
                            post.status === 'queued' ? colors.warning :
                            post.status === 'failed' ? colors.error :
                            colors.info
                        }}
                      >
                        {post.status}
                      </Chip>
                    </View>

                    <Text style={styles.postContent} numberOfLines={3}>
                      {post.content}
                    </Text>

                    {post.hashtags.length > 0 && (
                      <View style={styles.hashtags}>
                        {post.hashtags.slice(0, 5).map(tag => (
                          <Text key={tag} style={styles.hashtag}>{tag}</Text>
                        ))}
                      </View>
                    )}

                    <View style={styles.postMeta}>
                      <Text style={styles.metaText}>
                        {post.characterCount} chars | Score: {Math.round(post.engagementScore * 100)}%
                      </Text>
                      <Text style={styles.metaText}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.postActions}>
                      <Button
                        mode="outlined"
                        icon="pencil"
                        onPress={() => navigation.navigate('PostEditor', { postId: post.id })}
                        style={styles.actionButton}
                        textColor={colors.royalBlue}
                      >
                        Edit
                      </Button>
                      {post.status === 'queued' && (
                        <Button
                          mode="contained"
                          icon="send"
                          onPress={() => {}}
                          style={styles.actionButton}
                          buttonColor={colors.success}
                        >
                          Publish
                        </Button>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Generate Dialog */}
      <Portal>
        <Dialog visible={showGenerateDialog} onDismiss={() => setShowGenerateDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Generate Content</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Select platforms to generate content for:</Text>
            
            <ScrollView style={styles.platformSelector}>
              {connectedPlatforms.map(platform => {
                const registry = PLATFORM_REGISTRY_MOBILE[platform.id as keyof typeof PLATFORM_REGISTRY_MOBILE];
                return (
                  <TouchableOpacity
                    key={platform.id}
                    style={[
                      styles.platformOption,
                      selectedPlatforms.includes(platform.id) && styles.platformOptionSelected
                    ]}
                    onPress={() => togglePlatform(platform.id)}
                  >
                    <Text style={styles.platformOptionEmoji}>{registry?.emoji || '📱'}</Text>
                    <Text style={styles.platformOptionText}>{platform.name}</Text>
                    {selectedPlatforms.includes(platform.id) && (
                      <IconButton icon="check-circle" size={20} iconColor={colors.success} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TextInput
              label="Content Theme (optional)"
              value={contentTheme}
              onChangeText={setContentTheme}
              style={styles.input}
              textColor={colors.softWhite}
              mode="outlined"
              placeholder="e.g., product launch, tips, success story"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowGenerateDialog(false)} textColor={colors.textSecondary}>Cancel</Button>
            <Button 
              onPress={handleGenerateConfirm} 
              textColor={colors.royalBlue}
              disabled={selectedPlatforms.length === 0}
            >
              Generate
            </Button>
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
  generateButton: {
    borderRadius: borderRadius.md,
  },
  tabBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.midnightNavy,
  },
  tabButton: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  scrollView: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.royalBlue,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  postsList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  postCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  platformEmoji: {
    fontSize: 20,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.softWhite,
  },
  statusChip: {
    height: 24,
  },
  postContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  hashtag: {
    fontSize: 12,
    color: colors.royalBlue,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  emptyCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    margin: spacing.md,
    ...shadows.md,
  },
  emptyIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
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
  platformSelector: {
    maxHeight: 200,
    marginBottom: spacing.md,
  },
  platformOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.deepObsidian,
  },
  platformOptionSelected: {
    backgroundColor: colors.royalBlue + '20',
    borderColor: colors.royalBlue,
    borderWidth: 1,
  },
  platformOptionEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  platformOptionText: {
    flex: 1,
    fontSize: 14,
    color: colors.softWhite,
  },
  input: {
    backgroundColor: colors.deepObsidian,
  },
});
