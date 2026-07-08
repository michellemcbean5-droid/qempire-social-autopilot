import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  Chip,
  Card,
  IconButton,
  Divider,
  List,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

const AI_FEATURES = [
  {
    id: 'content_generation',
    name: 'AI Content Generation',
    description: 'Generate unique, platform-optimized content using Hugging Face transformer models',
    icon: 'auto-fix',
    tier: 'free',
    available: true,
  },
  {
    id: 'brand_analysis',
    name: 'AI Brand Analysis',
    description: 'Analyze your website to extract brand voice, keywords, and tone',
    icon: 'web',
    tier: 'free',
    available: true,
  },
  {
    id: 'engagement_prediction',
    name: 'Engagement Prediction',
    description: 'AI predicts engagement scores for each generated post',
    icon: 'chart-line',
    tier: 'free',
    available: true,
  },
  {
    id: 'hashtag_generation',
    name: 'AI Hashtag Generation',
    description: 'Automatically generate relevant hashtags for each platform',
    icon: 'pound',
    tier: 'free',
    available: true,
  },
  {
    id: 'image_description',
    name: 'AI Image Description',
    description: 'Generate AI image descriptions for your posts',
    icon: 'image',
    tier: 'free',
    available: true,
  },
  {
    id: 'sentiment_analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze sentiment of your content before posting',
    icon: 'emoticon',
    tier: 'basic',
    available: false,
  },
  {
    id: 'competitor_analysis',
    name: 'AI Competitor Analysis',
    description: 'Compare your content against competitors',
    icon: 'account-search',
    tier: 'pro',
    available: false,
  },
  {
    id: 'optimal_timing',
    name: 'Optimal Posting Time',
    description: 'AI recommends best times to post for maximum engagement',
    icon: 'clock-check',
    tier: 'pro',
    available: false,
  },
  {
    id: 'content_variations',
    name: 'Content Variations',
    description: 'Generate multiple variations of the same post',
    icon: 'layers-triple',
    tier: 'pro',
    available: false,
  },
  {
    id: 'trend_detection',
    name: 'Trend Detection',
    description: 'AI detects trending topics in your industry',
    icon: 'trending-up',
    tier: 'elite',
    available: false,
  },
  {
    id: 'ab_testing',
    name: 'A/B Testing',
    description: 'Automatically test different content variations',
    icon: 'test-tube',
    tier: 'elite',
    available: false,
  },
  {
    id: 'custom_model',
    name: 'Custom AI Model',
    description: 'Train a custom AI model on your brand voice',
    icon: 'brain',
    tier: 'elite',
    available: false,
  },
];

const TIER_ORDER = ['free', 'basic', 'pro', 'elite'];

export default function AIFeaturesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentTier, canUseFeature } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const getFeatureAvailability = (featureTier: string) => {
    const currentTierIndex = TIER_ORDER.indexOf(currentTier);
    const featureTierIndex = TIER_ORDER.indexOf(featureTier);
    return currentTierIndex >= featureTierIndex;
  };

  const handleFeaturePress = (feature: typeof AI_FEATURES[0]) => {
    if (!getFeatureAvailability(feature.tier)) {
      setSelectedFeature(feature.id);
      setShowUpgrade(true);
      return;
    }

    addNotification({
      type: 'info',
      title: 'AI Feature',
      message: `${feature.name} is available in your plan.`,
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return colors.success;
      case 'basic': return colors.tierBasic;
      case 'pro': return colors.tierPro;
      case 'elite': return colors.tierElite;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>🤖 AI Features</Text>
          <Text style={styles.headerSubtitle}>
            Powered by Hugging Face transformer models
          </Text>
          <Chip 
            style={[styles.tierChip, { backgroundColor: getTierColor(currentTier) + '20' }]}
            textStyle={{ color: getTierColor(currentTier), fontWeight: '700' }}
          >
            {currentTier.toUpperCase()} Plan
          </Chip>
        </Surface>

        {/* AI Model Info */}
        <Card style={styles.modelCard}>
          <Card.Content>
            <View style={styles.modelHeader}>
              <IconButton icon="brain" size={32} iconColor={colors.royalBlue} style={styles.modelIcon} />
              <View>
                <Text style={styles.modelTitle}>AI Model</Text>
                <Text style={styles.modelName}>mistralai/Mistral-7B-Instruct-v0.3</Text>
              </View>
            </View>
            <Text style={styles.modelDescription}>
              Our AI engine uses state-of-the-art transformer models from Hugging Face to generate 
              platform-optimized social media content. The model understands each platform's unique 
              requirements, character limits, and engagement patterns.
            </Text>
            <View style={styles.modelStats}>
              <View style={styles.modelStat}>
                <Text style={styles.modelStatNumber}>25</Text>
                <Text style={styles.modelStatLabel}>Platforms</Text>
              </View>
              <View style={styles.modelStat}>
                <Text style={styles.modelStatNumber}>7B</Text>
                <Text style={styles.modelStatLabel}>Parameters</Text>
              </View>
              <View style={styles.modelStat}>
                <Text style={styles.modelStatNumber}>Free</Text>
                <Text style={styles.modelStatLabel}>API Tier</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Features List */}
        <Text style={styles.sectionTitle}>Available Features</Text>
        
        <View style={styles.featuresList}>
          {AI_FEATURES.map(feature => {
            const isAvailable = getFeatureAvailability(feature.tier);
            const tierColor = getTierColor(feature.tier);
            
            return (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  !isAvailable && styles.featureCardLocked,
                ]}
                onPress={() => handleFeaturePress(feature)}
              >
                <View style={styles.featureHeader}>
                  <View style={[styles.featureIcon, { backgroundColor: isAvailable ? colors.royalBlue + '20' : colors.border }]}>
                    <IconButton
                      icon={feature.icon}
                      size={24}
                      iconColor={isAvailable ? colors.royalBlue : colors.textMuted}
                      style={styles.featureIconButton}
                    />
                  </View>
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureName}>{feature.name}</Text>
                    <Text style={styles.featureDescription} numberOfLines={2}>
                      {feature.description}
                    </Text>
                  </View>
                  <View style={styles.featureStatus}>
                    {isAvailable ? (
                      <Chip style={styles.availableChip} textStyle={styles.availableChipText}>
                        Available
                      </Chip>
                    ) : (
                      <Chip style={[styles.tierChip, { backgroundColor: tierColor + '20' }]} textStyle={{ color: tierColor, fontSize: 10 }}>
                        {feature.tier.toUpperCase()}
                      </Chip>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* API Info */}
        <Card style={styles.apiCard}>
          <Card.Title title="API Integration" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.apiText}>
              All AI features use the Hugging Face Inference API with free tier access 
              (10,000 requests/month). No additional costs or API keys required.
            </Text>
            <Button
              mode="outlined"
              onPress={() => Linking.openURL('https://huggingface.co/inference-api')}
              style={styles.apiButton}
              textColor={colors.royalBlue}
              icon="open-in-new"
            >
              Learn More
            </Button>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tierChip: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  modelCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modelIcon: {
    margin: 0,
    marginRight: spacing.md,
  },
  modelTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.softWhite,
  },
  modelDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  modelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modelStat: {
    alignItems: 'center',
  },
  modelStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.royalBlue,
  },
  modelStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  featureCardLocked: {
    opacity: 0.7,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  featureIconButton: {
    margin: 0,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  featureStatus: {
    marginLeft: spacing.sm,
  },
  availableChip: {
    backgroundColor: colors.success + '20',
    height: 24,
  },
  availableChipText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  apiCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  cardTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  apiText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  apiButton: {
    borderColor: colors.royalBlue,
    borderRadius: borderRadius.md,
  },
});
