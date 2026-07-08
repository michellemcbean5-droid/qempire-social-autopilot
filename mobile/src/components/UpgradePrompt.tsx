import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Surface, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { SUBSCRIPTION_LIMITS } from '@/constants/config';

interface UpgradePromptProps {
  visible: boolean;
  onDismiss: () => void;
  feature?: string;
}

export default function UpgradePrompt({ visible, onDismiss, feature }: UpgradePromptProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentTier } = useSubscriptionStore();

  const handleUpgrade = () => {
    onDismiss();
    navigation.navigate('Subscription');
  };

  const nextTier = currentTier === 'free' ? 'basic' : 
                   currentTier === 'basic' ? 'pro' : 'elite';
  
  const nextTierConfig = SUBSCRIPTION_LIMITS[nextTier as keyof typeof SUBSCRIPTION_LIMITS];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          ✨ Upgrade Required
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogText}>
            {feature 
              ? `The "${feature}" feature requires a higher tier plan.`
              : 'This feature is not available in your current plan.'
            }
          </Text>
          
          <Surface style={styles.tierCard}>
            <Text style={styles.tierName}>
              {nextTier.toUpperCase()} Plan
            </Text>
            <Text style={styles.tierPrice}>
              {nextTierConfig.priceDisplay}
            </Text>
            <Text style={styles.tierDescription}>
              {nextTier === 'basic' && 'Perfect for small businesses getting started with social automation'}
              {nextTier === 'pro' && 'Advanced features for growing brands and content creators'}
              {nextTier === 'elite' && 'Maximum power for agencies and enterprises with full API access'}
            </Text>
            
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>
                ✅ {nextTierConfig.maxPlatforms} connected platforms
              </Text>
              <Text style={styles.featureItem}>
                ✅ {nextTierConfig.maxPostsPerDay} posts per day
              </Text>
              <Text style={styles.featureItem}>
                ✅ {nextTierConfig.aiGenerationsPerDay} AI generations per day
              </Text>
              {nextTierConfig.autopilotEnabled && (
                <Text style={styles.featureItem}>
                  ✅ Autopilot scheduling
                </Text>
              )}
              {nextTierConfig.advancedAnalytics && (
                <Text style={styles.featureItem}>
                  ✅ Advanced analytics
                </Text>
              )}
              {nextTierConfig.apiAccess && (
                <Text style={styles.featureItem}>
                  ✅ API access
                </Text>
              )}
            </View>
          </Surface>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.textSecondary}>
            Maybe Later
          </Button>
          <Button 
            onPress={handleUpgrade} 
            textColor={colors.warmGold}
            buttonColor={colors.warmGold + '20'}
            style={styles.upgradeButton}
          >
            Upgrade Now
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.midnightNavy,
  },
  dialogTitle: {
    color: colors.softWhite,
    fontWeight: '700',
  },
  dialogText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  tierCard: {
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.warmGold,
    marginBottom: spacing.xs,
  },
  tierPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  tierDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.xs,
  },
  featureItem: {
    fontSize: 14,
    color: colors.softWhite,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
  },
});
