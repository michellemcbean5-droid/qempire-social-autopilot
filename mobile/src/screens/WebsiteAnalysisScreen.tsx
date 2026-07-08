import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Surface,
  Chip,
  IconButton,
  ProgressBar,
  HelperText,
  Card,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useBrandStore } from '@/store/brandStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import UpgradePrompt from '@/components/UpgradePrompt';
import { analyzeWebsite, isValidURL } from '@/api/websiteAnalyzer';

export default function WebsiteAnalysisScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, setProfile, setAnalyzing, setError, isAnalyzing, analysisError } = useBrandStore();
  const { currentTier, getLimits } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [url, setUrl] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [urlError, setUrlError] = useState('');

  const limits = getLimits();

  const validateUrl = (url: string) => {
    return isValidURL(url);
  };

  const handleAnalyze = async () => {
    setUrlError('');
    setError(null);

    if (!url.trim()) {
      setUrlError('Please enter a website URL');
      return;
    }

    let analysisUrl = url.trim();
    if (!analysisUrl.startsWith('http')) {
      analysisUrl = 'https://' + analysisUrl;
    }

    if (!validateUrl(analysisUrl)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progressive analysis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 0.9) {
          clearInterval(progressInterval);
          return 0.9;
        }
        return prev + 0.1;
      });
    }, 500);

    try {
      // Call real AI website analyzer
      const result = await analyzeWebsite(analysisUrl);
      clearInterval(progressInterval);
      setAnalysisProgress(1);

      setProfile({
        url: result.url,
        brandName: result.brandName,
        description: result.description,
        keywords: result.keywords,
        tone: result.tone,
        productsServices: result.productsServices,
        targetAudience: result.targetAudience,
        contentThemes: result.contentThemes,
        colorScheme: result.colorScheme,
        socialLinks: result.socialLinks,
        lastAnalyzed: result.lastAnalyzed,
      });
      
      addNotification({
        type: 'success',
        title: 'Website Analysis Complete',
        message: `AI analyzed ${result.brandName}. Brand profile extracted using Mistral-7B.`,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Website analysis error:', error);
      setError('Failed to analyze website. Please check the URL and try again.');
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: 'Could not analyze the website. Please check the URL and try again.',
      });
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>🔍 Website Analysis</Text>
          <Text style={styles.headerSubtitle}>
            Let AI analyze your website to understand your brand voice
          </Text>
        </Surface>

        {/* URL Input */}
        <Card style={styles.inputCard}>
          <Card.Content>
            <Text style={styles.inputLabel}>Enter your website URL</Text>
            <TextInput
              label="Website URL"
              value={url}
              onChangeText={(text) => { setUrl(text); setUrlError(''); }}
              mode="outlined"
              placeholder="https://yourwebsite.com"
              autoCapitalize="none"
              keyboardType="url"
              style={styles.input}
              textColor={colors.softWhite}
              left={<TextInput.Icon icon="web" color={colors.textSecondary} />}
              error={!!urlError}
              disabled={isAnalyzing}
            />
            {urlError && (
              <HelperText type="error" visible={true}>
                {urlError}
              </HelperText>
            )}
            <HelperText type="info" visible={true}>
              The AI will analyze your website content, extract keywords, and determine your brand tone.
            </HelperText>

            <Button
              mode="contained"
              onPress={handleAnalyze}
              loading={isAnalyzing}
              disabled={isAnalyzing}
              style={styles.analyzeButton}
              buttonColor={colors.royalBlue}
              icon="magnify"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
            </Button>
          </Card.Content>
        </Card>

        {/* Progress */}
        {isAnalyzing && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text style={styles.progressTitle}>Analyzing your website...</Text>
              <ProgressBar
                progress={analysisProgress}
                color={colors.royalBlue}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {Math.round(analysisProgress * 100)}% complete
              </Text>
              <Text style={styles.progressDetail}>
                {analysisProgress < 0.3 && '🔍 Scanning website structure...'}
                {analysisProgress >= 0.3 && analysisProgress < 0.6 && '📝 Extracting content and keywords...'}
                {analysisProgress >= 0.6 && analysisProgress < 0.9 && '🎨 Analyzing brand tone and colors...'}
                {analysisProgress >= 0.9 && '✅ Finalizing brand profile...'}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Results */}
        {profile && !isAnalyzing && (
          <Card style={styles.resultsCard}>
            <Card.Title
              title="Brand Profile"
              subtitle={`Analyzed: ${new Date(profile.lastAnalyzed).toLocaleDateString()}`}
              titleStyle={styles.resultsTitle}
              subtitleStyle={styles.resultsSubtitle}
            />
            <Card.Content>
              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Brand Name</Text>
                <Text style={styles.sectionValue}>{profile.brandName}</Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.sectionValue}>{profile.description}</Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Tone</Text>
                <Chip style={styles.toneChip} textStyle={styles.toneText}>
                  {profile.tone}
                </Chip>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Keywords</Text>
                <View style={styles.keywordsContainer}>
                  {profile.keywords.map(keyword => (
                    <Chip key={keyword} style={styles.keywordChip} textStyle={styles.keywordText}>
                      {keyword}
                    </Chip>
                  ))}
                </View>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Products/Services</Text>
                {profile.productsServices.map(product => (
                  <Text key={product} style={styles.listItem}>• {product}</Text>
                ))}
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Target Audience</Text>
                <Text style={styles.sectionValue}>{profile.targetAudience}</Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionLabel}>Content Themes</Text>
                <View style={styles.keywordsContainer}>
                  {profile.contentThemes.map(theme => (
                    <Chip key={theme} style={styles.themeChip} textStyle={styles.themeText}>
                      {theme}
                    </Chip>
                  ))}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => navigation.navigate('GenerateContent')}
                style={styles.generateButton}
                buttonColor={colors.electricPurple}
                icon="auto-fix"
              >
                Generate Content
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
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
  inputCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.deepObsidian,
  },
  analyzeButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  progressCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
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
  progressDetail: {
    fontSize: 12,
    color: colors.royalBlue,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  resultsCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  resultsTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  resultsSubtitle: {
    color: colors.textSecondary,
  },
  profileSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  sectionValue: {
    fontSize: 16,
    color: colors.softWhite,
    lineHeight: 24,
  },
  toneChip: {
    backgroundColor: colors.royalBlue + '20',
    alignSelf: 'flex-start',
  },
  toneText: {
    color: colors.royalBlue,
    fontWeight: '600',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  keywordChip: {
    backgroundColor: colors.electricPurple + '20',
  },
  keywordText: {
    color: colors.electricPurple,
    fontSize: 12,
  },
  themeChip: {
    backgroundColor: colors.neonAqua + '20',
  },
  themeText: {
    color: colors.neonAqua,
    fontSize: 12,
  },
  listItem: {
    fontSize: 14,
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  generateButton: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
  },
});
