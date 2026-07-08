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
  ProgressBar,
  List,
  Badge,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { SUBSCRIPTION_LIMITS, SUBSCRIPTION_TIERS } from '@/constants/config';
import { APP_CONFIG } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

const TIER_CONFIG = {
  free: {
    name: 'Free',
    color: colors.tierFree,
    icon: 'star-outline',
    description: 'Get started with basic social media automation',
  },
  basic: {
    name: 'Basic',
    color: colors.tierBasic,
    icon: 'star',
    description: 'Perfect for small businesses and creators',
  },
  pro: {
    name: 'Pro',
    color: colors.tierPro,
    icon: 'crown',
    description: 'Advanced features for growing brands',
  },
  elite: {
    name: 'Elite',
    color: colors.tierElite,
    icon: 'diamond',
    description: 'Maximum power for agencies and enterprises',
  },
};

const FEATURES = [
  { id: 'maxPlatforms', label: 'Connected Platforms', icon: 'share-social' },
  { id: 'maxPostsPerDay', label: 'Posts Per Day', icon: 'send' },
  { id: 'aiGenerationsPerDay', label: 'AI Generations/Day', icon: 'auto-fix' },
  { id: 'analyticsRetention', label: 'Analytics History', icon: 'chart-bar', format: (v: number) => `${v} days` },
  { id: 'autopilotEnabled', label: 'Autopilot Scheduling', icon: 'rocket-launch', boolean: true },
  { id: 'customSchedules', label: 'Custom Schedules', icon: 'calendar', boolean: true },
  { id: 'advancedAnalytics', label: 'Advanced Analytics', icon: 'chart-line', boolean: true },
  { id: 'apiAccess', label: 'API Access', icon: 'code-braces', boolean: true },
  { id: 'prioritySupport', label: 'Priority Support', icon: 'headset', boolean: true },
  { id: 'teamMembers', label: 'Team Members', icon: 'account-group' },
];

export default function SubscriptionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const { currentTier, setTier, applyPromoCode, applyMasterCode, promoCodeApplied, discountApplied } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [selectedTier, setSelectedTier] = useState<string>(currentTier);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier);
    if (tier !== currentTier) {
      setShowUpgrade(true);
    }
  };

  const handleUpgrade = () => {
    setTier(selectedTier as any);
    addNotification({
      type: 'success',
      title: 'Subscription Updated',
      message: `You've upgraded to the ${TIER_CONFIG[selectedTier as keyof typeof TIER_CONFIG]?.name || selectedTier} plan!`,
    });
    setShowUpgrade(false);
  };

  const getFeatureValue = (tier: string, featureId: string) => {
    const limits = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS];
    return limits[featureId as keyof typeof limits];
  };

  const formatFeatureValue = (feature: typeof FEATURES[0], value: any) => {
    if (feature.boolean) {
      return value ? '✅' : '❌';
    }
    if (feature.format) {
      return feature.format(value);
    }
    return value.toString();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>💎 Subscription</Text>
          <Text style={styles.headerSubtitle}>
            Choose the plan that fits your needs
          </Text>
          
          {promoCodeApplied && (
            <Chip style={styles.promoChip} textStyle={styles.promoChipText}>
              🎉 Promo: {promoCodeApplied} ({Math.round((1 - discountApplied) * 100)}% off)
            </Chip>
          )}
        </Surface>

        {/* Current Plan */}
        <Card style={styles.currentPlanCard}>
          <Card.Content>
            <View style={styles.currentPlanHeader}>
              <Text style={styles.currentPlanLabel}>Current Plan</Text>
              <Chip 
                style={[styles.currentTierChip, { backgroundColor: TIER_CONFIG[currentTier as keyof typeof TIER_CONFIG]?.color + '20' }]}
                textStyle={[styles.currentTierText, { color: TIER_CONFIG[currentTier as keyof typeof TIER_CONFIG]?.color }]}
              >
                {TIER_CONFIG[currentTier as keyof typeof TIER_CONFIG]?.name || currentTier}
              </Chip>
            </View>
            <Text style={styles.currentPlanPrice}>
              {SUBSCRIPTION_LIMITS[currentTier as keyof typeof SUBSCRIPTION_LIMITS].priceDisplay}
            </Text>
            <Text style={styles.currentPlanDescription}>
              {TIER_CONFIG[currentTier as keyof typeof TIER_CONFIG]?.description}
            </Text>
          </Card.Content>
        </Card>

        {/* Tier Selection */}
        <Text style={styles.sectionTitle}>Select a Plan</Text>
        
        <View style={styles.tiersContainer}>
          {Object.entries(SUBSCRIPTION_TIERS).map(([tierKey]) => {
            const tier = tierKey as keyof typeof TIER_CONFIG;
            const config = TIER_CONFIG[tier];
            const limits = SUBSCRIPTION_LIMITS[tier];
            const isSelected = selectedTier === tierKey;
            const isCurrent = currentTier === tierKey;

            return (
              <TouchableOpacity
                key={tierKey}
                style={[
                  styles.tierCard,
                  isSelected && styles.tierCardSelected,
                  isCurrent && styles.tierCardCurrent,
                  { borderColor: config.color },
                ]}
                onPress={() => handleSelectTier(tierKey)}
              >
                <View style={styles.tierHeader}>
                  <View style={[styles.tierIcon, { backgroundColor: config.color + '20' }]}>
                    <IconButton icon={config.icon} size={24} iconColor={config.color} style={styles.tierIconButton} />
                  </View>
                  <View style={styles.tierInfo}>
                    <Text style={[styles.tierName, { color: config.color }]}>
                      {config.name}
                    </Text>
                    <Text style={styles.tierPrice}>
                      {limits.priceDisplay}
                    </Text>
                  </View>
                  {isCurrent && (
                    <Chip style={styles.currentChip} textStyle={styles.currentChipText}>
                      Current
                    </Chip>
                  )}
                </View>
                
                <Text style={styles.tierDescription}>{config.description}</Text>

                {/* Quick Features */}
                <View style={styles.tierFeatures}>
                  <View style={styles.tierFeature}>
                    <IconButton icon="share-social" size={16} iconColor={colors.textSecondary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{limits.maxPlatforms} platforms</Text>
                  </View>
                  <View style={styles.tierFeature}>
                    <IconButton icon="send" size={16} iconColor={colors.textSecondary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{limits.maxPostsPerDay} posts/day</Text>
                  </View>
                  <View style={styles.tierFeature}>
                    <IconButton icon="auto-fix" size={16} iconColor={colors.textSecondary} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{limits.aiGenerationsPerDay} AI gen/day</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed Comparison */}
        <Text style={styles.sectionTitle}>Feature Comparison</Text>
        
        <Card style={styles.comparisonCard}>
          <Card.Content>
            {FEATURES.map((feature, index) => (
              <View key={feature.id}>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonFeature}>
                    <IconButton icon={feature.icon} size={20} iconColor={colors.royalBlue} style={styles.comparisonIcon} />
                    <Text style={styles.comparisonLabel}>{feature.label}</Text>
                  </View>
                  
                  <View style={styles.comparisonValues}>
                    {Object.keys(SUBSCRIPTION_TIERS).map(tier => {
                      const value = getFeatureValue(tier, feature.id);
                      const isCurrent = currentTier === tier;
                      const isSelected = selectedTier === tier;
                      
                      return (
                        <View 
                          key={tier} 
                          style={[
                            styles.comparisonValue,
                            (isCurrent || isSelected) && styles.comparisonValueHighlighted
                          ]}
                        >
                          <Text style={[
                            styles.comparisonValueText,
                            isCurrent && styles.comparisonValueCurrent,
                            isSelected && !isCurrent && styles.comparisonValueSelected,
                          ]}>
                            {formatFeatureValue(feature, value)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                {index < FEATURES.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Promo Code */}
        <Button
          mode="text"
          onPress={() => navigation.navigate('PromoCode')}
          style={styles.promoButton}
          textColor={colors.royalBlue}
          icon="tag"
        >
          Have a promo code?
        </Button>

        {/* Referral */}
        <Button
          mode="text"
          onPress={() => navigation.navigate('Referral')}
          style={styles.referralButton}
          textColor={colors.success}
          icon="gift"
        >
          Refer a friend & earn rewards
        </Button>
      </ScrollView>

      {/* Upgrade Button */}
      {selectedTier !== currentTier && (
        <Surface style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleUpgrade}
            style={styles.upgradeButton}
            buttonColor={TIER_CONFIG[selectedTier as keyof typeof TIER_CONFIG]?.color || colors.royalBlue}
            textColor={colors.softWhite}
            icon="crown"
          >
            Upgrade to {TIER_CONFIG[selectedTier as keyof typeof TIER_CONFIG]?.name}
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
  promoChip: {
    marginTop: spacing.sm,
    backgroundColor: colors.warmGold + '20',
    alignSelf: 'flex-start',
  },
  promoChipText: {
    color: colors.warmGold,
    fontWeight: '600',
  },
  currentPlanCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentTierChip: {
    borderRadius: borderRadius.full,
  },
  currentTierText: {
    fontWeight: '700',
  },
  currentPlanPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  currentPlanDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  tiersContainer: {
    gap: spacing.md,
  },
  tierCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  tierCardSelected: {
    borderWidth: 2,
    ...shadows.lg,
  },
  tierCardCurrent: {
    borderWidth: 2,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tierIcon: {
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  tierIconButton: {
    margin: 0,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
  },
  tierPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentChip: {
    backgroundColor: colors.success + '20',
  },
  currentChipText: {
    color: colors.success,
    fontWeight: '700',
  },
  tierDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  tierFeatures: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tierFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comparisonCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  comparisonFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  comparisonIcon: {
    margin: 0,
    marginRight: spacing.sm,
  },
  comparisonLabel: {
    fontSize: 14,
    color: colors.softWhite,
    fontWeight: '600',
  },
  comparisonValues: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  comparisonValue: {
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  comparisonValueHighlighted: {
    backgroundColor: colors.royalBlue + '10',
  },
  comparisonValueText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  comparisonValueCurrent: {
    color: colors.success,
    fontWeight: '700',
  },
  comparisonValueSelected: {
    color: colors.royalBlue,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: colors.border,
  },
  promoButton: {
    marginTop: spacing.sm,
  },
  referralButton: {
    marginBottom: spacing.xl,
  },
  footer: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    ...shadows.md,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
});
