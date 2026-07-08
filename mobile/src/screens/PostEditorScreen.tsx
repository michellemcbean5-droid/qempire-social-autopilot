import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useContentStore } from '@/store/contentStore';
import { usePlatformStore } from '@/store/platformStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { PLATFORM_REGISTRY_MOBILE } from '@/constants/config';

export default function PostEditorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { posts, updatePost, removePost } = useContentStore();
  const { platforms } = usePlatformStore();
  const { addNotification } = useNotificationStore();
  
  const postId = (route.params as any)?.postId;
  const post = posts.find(p => p.id === postId);
  
  const [content, setContent] = useState(post?.content || '');
  const [hashtags, setHashtags] = useState(post?.hashtags.join(' ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(post?.content.length || 0);
  const [error, setError] = useState('');

  if (!post) {
    return (
      <View style={styles.container}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>Post Not Found</Text>
          <Text style={styles.headerSubtitle}>The post you're looking for doesn't exist.</Text>
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

  const registry = PLATFORM_REGISTRY_MOBILE[post.platformId as keyof typeof PLATFORM_REGISTRY_MOBILE];
  const maxChars = registry?.maxChars || 5000;
  const isOverLimit = charCount > maxChars;

  const handleContentChange = (text: string) => {
    setContent(text);
    setCharCount(text.length);
    setError('');
  };

  const handleSave = async () => {
    if (isOverLimit) {
      setError(`Content exceeds ${maxChars} character limit for ${post.platformName}`);
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updatePost(post.id, {
        content,
        hashtags: hashtags.split(' ').filter(h => h.startsWith('#')),
        characterCount: content.length,
      });

      addNotification({
        type: 'success',
        title: 'Post Updated',
        message: `Your post for ${post.platformName} has been updated.`,
      });

      navigation.goBack();
    } catch (err) {
      setError('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    removePost(post.id);
    addNotification({
      type: 'info',
      title: 'Post Deleted',
      message: `Post for ${post.platformName} has been removed.`,
    });
    navigation.goBack();
  };

  const getCharCountColor = () => {
    const ratio = charCount / maxChars;
    if (ratio > 0.95) return colors.error;
    if (ratio > 0.8) return colors.warning;
    return colors.success;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>✏️ Edit Post</Text>
              <Text style={styles.headerSubtitle}>
                {registry?.emoji || '📱'} {post.platformName}
              </Text>
            </View>
            <IconButton
              icon="delete"
              size={24}
              iconColor={colors.error}
              onPress={handleDelete}
            />
          </View>
        </Surface>

        <Card style={styles.editorCard}>
          <Card.Content>
            {/* Character Counter */}
            <View style={styles.charCounter}>
              <Text style={[styles.charCount, { color: getCharCountColor() }]}>
                {charCount}/{maxChars}
              </Text>
              <View style={[styles.charBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.charFill,
                    {
                      width: `${Math.min((charCount / maxChars) * 100, 100)}%`,
                      backgroundColor: getCharCountColor(),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Content Input */}
            <TextInput
              label="Post Content"
              value={content}
              onChangeText={handleContentChange}
              mode="outlined"
              multiline
              numberOfLines={8}
              style={styles.contentInput}
              textColor={colors.softWhite}
              error={isOverLimit}
              placeholder="Write your post content here..."
              placeholderTextColor={colors.textMuted}
            />

            {error && (
              <HelperText type="error" visible={true}>
                {error}
              </HelperText>
            )}

            {/* Hashtags Input */}
            <TextInput
              label="Hashtags (space separated)"
              value={hashtags}
              onChangeText={setHashtags}
              mode="outlined"
              style={styles.input}
              textColor={colors.softWhite}
              placeholder="#hashtag1 #hashtag2 #hashtag3"
              placeholderTextColor={colors.textMuted}
            />

            <HelperText type="info" visible={true}>
              Separate hashtags with spaces. Include the # symbol.
            </HelperText>

            {/* Preview */}
            <Surface style={styles.preview}>
              <Text style={styles.previewLabel}>Preview</Text>
              <Text style={styles.previewContent}>{content}</Text>
              {hashtags && (
                <Text style={styles.previewHashtags}>{hashtags}</Text>
              )}
            </Surface>

            {/* Engagement Score */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Engagement Score</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreFill,
                    {
                      width: `${post.engagementScore * 100}%`,
                      backgroundColor:
                        post.engagementScore > 0.8
                          ? colors.success
                          : post.engagementScore > 0.5
                          ? colors.warning
                          : colors.error,
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreValue}>
                {Math.round(post.engagementScore * 100)}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            textColor={colors.textSecondary}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving || isOverLimit}
            style={styles.saveButton}
            buttonColor={colors.royalBlue}
            icon="content-save"
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    margin: spacing.lg,
    borderRadius: borderRadius.md,
  },
  editorCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  charCounter: {
    marginBottom: spacing.md,
  },
  charCount: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: spacing.xs,
  },
  charBar: {
    height: 4,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  charFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  contentInput: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.md,
    minHeight: 160,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.sm,
  },
  preview: {
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.royalBlue,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  previewContent: {
    fontSize: 14,
    color: colors.softWhite,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  previewHashtags: {
    fontSize: 14,
    color: colors.royalBlue,
  },
  scoreContainer: {
    marginTop: spacing.md,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  scoreBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  saveButton: {
    flex: 2,
    borderRadius: borderRadius.md,
  },
});
