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
  ProgressBar,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { usePlatformStore } from '@/store/platformStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { PLATFORM_REGISTRY_MOBILE } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function GenerateContentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { profile } = useBrandStore();
  const { addPosts, setGenerating, isGenerating, generationProgress } = useContentStore();
  const { platforms } = usePlatformStore();
  const { currentTier, getLimits, canUseFeature } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    (route.params as any)?.platformIds || []
  );
  const [contentTheme, setContentTheme] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  const limits = getLimits();
  const connectedPlatforms = platforms.filter(p => p.connected);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Platforms Selected',
        message: 'Please select at least one platform to generate content for.',
      });
      return;
    }

    if (selectedPlatforms.length > limits.maxPlatforms) {
      setShowUpgrade(true);
      return;
    }

    setGenerating(true, 0);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerating(true, Math.random() * 0.8);
    }, 800);

    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      clearInterval(progressInterval);
      setGenerating(true, 1);

      // Generate mock posts
      const posts = selectedPlatforms.map((platformId, index) => {
        const registry = PLATFORM_REGISTRY_MOBILE[platformId as keyof typeof PLATFORM_REGISTRY_MOBILE];
        const platform = platforms.find(p => p.id === platformId);
        
        const templates = [
          `🚀 Exciting news from ${profile?.brandName || 'our brand'}! We're transforming how businesses approach ${contentTheme || 'growth'} with cutting-edge AI solutions. Ready to level up?`,
          `💡 Did you know? ${profile?.brandName || 'We'} help businesses automate their success. Stop working harder — start working smarter with our innovative solutions.`,
          `⚡ The future of ${contentTheme || 'business'} is here. ${profile?.brandName || 'Our brand'} delivers AI-powered solutions that work while you sleep. Join thousands who've already made the switch!`,
          `🎯 ${profile?.brandName || 'Our brand'} — Where innovation meets execution. Our clients see 3x productivity gains in just 30 days. Your turn?`,
        ];

        const content = templates[index % templates.length];
        const hashtags = ['#AI', '#Automation', '#BusinessGrowth', '#Innovation', '#Digital'].slice(0, registry?.hashtags || 5);

        return {
          id: `post_${Date.now()}_${index}`,
          batchId: `batch_${Date.now()}`,
          platformId,
          platformName: registry?.name || platform?.name || platformId,
          content: content.length > (registry?.maxChars || 500) 
            ? content.substring(0, (registry?.maxChars || 500) - 3) + '...'
            : content,
          hashtags,
          characterCount: content.length,
          engagementScore: 0.7 + Math.random() * 0.25,
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      setGeneratedPosts(posts);
      addPosts(posts);
      
      addNotification({
        type: 'success',
        title: 'Content Generated',
        message: `Successfully generated ${posts.length} posts for ${selectedPlatforms.length} platforms.`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate content. Please try again.',
      });
    } finally {
      setGenerating(false, 0);
    }
  };

  const handlePublish = async () => {
    // Navigate to content screen with queue
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Generate Content</Text>
        <Text style={styles.headerSubtitle}>
          AI-powered content for your connected platforms
        </Text>
      </Surface>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Platform Selection */}
        <Card style={styles.card}>
          <Card.Title title="Select Platforms" titleStyle={styles.cardTitle} />
          <Card.Content>
            {connectedPlatforms.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔗</Text>
                <Text style={styles.emptyTitle}>No platforms connected</Text>
                <Text style={styles.emptyText}>
                  Connect platforms first to generate content for them.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('MainTabs')}
                  style={styles.emptyButton}
                  buttonColor={colors.royalBlue}
                >
                  Go to Platforms
                </Button>
              </View>
            ) : (
              <View style={styles.platformsGrid}>
                {connectedPlatforms.map(platform => {
                  const registry = PLATFORM_REGISTRY_MOBILE[platform.id as keyof typeof PLATFORM_REGISTRY_MOBILE];
                  const isSelected = selectedPlatforms.includes(platform.id);
                  
                  return (
                    <TouchableOpacity
                      key={platform.id}
                      style={[
                        styles.platformOption,
                        isSelected && styles.platformOptionSelected,
                      ]}
                      onPress={() => togglePlatform(platform.id)}
                    >
                      <Text style={styles.platformEmoji}>{registry?.emoji || '📱'}</Text>
                      <Text style={styles.platformName}>{platform.name}</Text>
                      {isSelected && (
                        <IconButton icon="check-circle" size={20} iconColor={colors.success} style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Content Theme */}
        <Card style={styles.card}>
          <Card.Title title="Content Theme" titleStyle={styles.cardTitle} />
          <Card.Content>
            <TextInput
              label="Theme (optional)"
              value={contentTheme}
              onChangeText={setContentTheme}
              mode="outlined"
              placeholder="e.g., product launch, industry tips, success story"
              style={styles.input}
              textColor={colors.softWhite}
              disabled={isGenerating}
            />
            <HelperText type="info" visible={true}>
              Specify a theme to guide the AI content generation. Leave blank for general brand content.
            </HelperText>
          </Card.Content>
        </Card>

        {/* Generation Progress */}
        {isGenerating && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.progressTitle}>Generating AI Content...</Text>
              <ProgressBar
                progress={generationProgress}
                color={colors.electricPurple}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {Math.round(generationProgress * 100)}% complete
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Generated Posts Preview */}
        {generatedPosts.length > 0 && !isGenerating && (
          <Card style={styles.card}>
            <Card.Title 
              title={`Generated Posts (${generatedPosts.length})`} 
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              {generatedPosts.map(post => {
                const registry = PLATFORM_REGISTRY_MOBILE[post.platformId as keyof typeof PLATFORM_REGISTRY_MOBILE];
                return (
                  <Surface key={post.id} style={styles.postPreview}>
                    <View style={styles.postHeader}>
                      <Text style={styles.postEmoji}>{registry?.emoji || '📱'}</Text>
                      <Text style={styles.postPlatform}>{post.platformName}</Text>
                      <Chip style={styles.scoreChip} textStyle={styles.scoreText}>
                        {Math.round(post.engagementScore * 100)}% score
                      </Chip>
                    </View>
                    <Text style={styles.postContent} numberOfLines={3}>
                      {post.content}
                    </Text>
                    <View style={styles.postMeta}>
                      <Text style={styles.metaText}>{post.characterCount} chars</Text>
                      <Text style={styles.metaText}>
                        {post.hashtags.slice(0, 3).join(' ')}
                      </Text>
                    </View>
                  </Surface>
                );
              })}

              <Button
                mode="contained"
                onPress={handlePublish}
                style={styles.publishButton}
                buttonColor={colors.success}
                icon="send"
              >
                Add to Queue
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Generate Button */}
      {!isGenerating && generatedPosts.length === 0 && (
        <Surface style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleGenerate}
            disabled={selectedPlatforms.length === 0 || isGenerating}
            style={styles.generateButton}
            buttonColor={colors.electricPurple}
            textColor={colors.softWhite}
            icon="auto-fix"
          >
            Generate Content for {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
          </Button>
        </Surface>
      )}

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  platformOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.deepObsidian,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '45%',
    flex: 1,
  },
  platformOptionSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  platformEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  platformName: {
    flex: 1,
    fontSize: 14,
    color: colors.softWhite,
    fontWeight: '600',
  },
  checkIcon: {
    margin: 0,
  },
  input: {
    backgroundColor: colors.deepObsidian,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  postPreview: {
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  postPlatform: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.softWhite,
  },
  scoreChip: {
    backgroundColor: colors.success + '20',
    height: 24,
  },
  scoreText: {
    color: colors.success,
    fontSize: 10,
  },
  postContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  publishButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.softWhite,
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
  footer: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    ...shadows.md,
  },
  generateButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
});
