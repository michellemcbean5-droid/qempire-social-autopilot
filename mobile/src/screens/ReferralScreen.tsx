import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Clipboard,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  Chip,
  Card,
  IconButton,
  ProgressBar,
  Divider,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';

const REFERRAL_REWARDS = [
  { referrals: 1, reward: '7 days Pro trial', icon: 'star' },
  { referrals: 3, reward: '30 days Pro free', icon: 'crown' },
  { referrals: 5, reward: '50% off forever', icon: 'diamond' },
  { referrals: 10, reward: 'Free Elite for life', icon: 'crown-circle' },
];

const MOCK_REFERRALS = [
  { name: 'Sarah M.', date: '2024-01-15', status: 'active', avatar: 'S' },
  { name: 'John D.', date: '2024-01-10', status: 'active', avatar: 'J' },
  { name: 'Emily R.', date: '2024-01-05', status: 'pending', avatar: 'E' },
];

export default function ReferralScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const { currentTier } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [referralCode] = useState(user?.id ? `REF-${user.id.slice(-6).toUpperCase()}` : 'REF-LOADING');
  const [referralCount] = useState(2);
  const [copied, setCopied] = useState(false);

  const referralLink = `${APP_CONFIG.website}/ref/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Q-Empire Social Autopilot! Use my referral code ${referralCode} to get started with AI-powered social media automation. ${referralLink}`,
        title: 'Q-Empire Social Autopilot',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopyCode = () => {
    // Clipboard.setString(referralCode);
    setCopied(true);
    addNotification({
      type: 'success',
      title: 'Code Copied',
      message: 'Referral code copied to clipboard!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    // Clipboard.setString(referralLink);
    setCopied(true);
    addNotification({
      type: 'success',
      title: 'Link Copied',
      message: 'Referral link copied to clipboard!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const nextReward = REFERRAL_REWARDS.find(r => r.referrals > referralCount);
  const progress = nextReward ? (referralCount / nextReward.referrals) : 1;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>🎁 Refer & Earn</Text>
          <Text style={styles.headerSubtitle}>
            Invite friends and unlock amazing rewards
          </Text>
        </Surface>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{referralCount}</Text>
                <Text style={styles.statLabel}>Referrals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {MOCK_REFERRALS.filter(r => r.status === 'active').length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {MOCK_REFERRALS.filter(r => r.status === 'pending').length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            {/* Progress to next reward */}
            {nextReward && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {nextReward.referrals - referralCount} more to unlock
                  </Text>
                  <Text style={styles.progressReward}>{nextReward.reward}</Text>
                </View>
                <ProgressBar
                  progress={progress}
                  color={colors.warmGold}
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>
                  {referralCount} / {nextReward.referrals} referrals
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Referral Code */}
        <Card style={styles.codeCard}>
          <Card.Content>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            
            <TouchableOpacity style={styles.codeContainer} onPress={handleCopyCode}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <IconButton
                icon={copied ? 'check' : 'content-copy'}
                size={24}
                iconColor={copied ? colors.success : colors.royalBlue}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkContainer} onPress={handleCopyLink}>
              <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
              <IconButton
                icon={copied ? 'check' : 'link'}
                size={20}
                iconColor={copied ? colors.success : colors.textSecondary}
              />
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleShare}
              style={styles.shareButton}
              buttonColor={colors.royalBlue}
              icon="share-variant"
            >
              Share with Friends
            </Button>
          </Card.Content>
        </Card>

        {/* Rewards Tiers */}
        <Text style={styles.sectionTitle}>Reward Tiers</Text>
        
        <View style={styles.rewardsList}>
          {REFERRAL_REWARDS.map((reward, index) => {
            const isUnlocked = referralCount >= reward.referrals;
            const isNext = nextReward?.referrals === reward.referrals;
            
            return (
              <Card
                key={reward.referrals}
                style={[
                  styles.rewardCard,
                  isUnlocked && styles.rewardCardUnlocked,
                  isNext && styles.rewardCardNext,
                ]}
              >
                <Card.Content>
                  <View style={styles.rewardHeader}>
                    <View style={[
                      styles.rewardIcon,
                      { backgroundColor: isUnlocked ? colors.success + '20' : colors.border },
                    ]}>
                      <IconButton
                        icon={isUnlocked ? 'check-circle' : reward.icon}
                        size={24}
                        iconColor={isUnlocked ? colors.success : colors.textSecondary}
                        style={styles.rewardIconButton}
                      />
                    </View>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardReferrals}>
                        {reward.referrals} {reward.referrals === 1 ? 'Referral' : 'Referrals'}
                      </Text>
                      <Text style={[
                        styles.rewardName,
                        isUnlocked && styles.rewardNameUnlocked,
                      ]}>
                        {reward.reward}
                      </Text>
                    </View>
                    {isUnlocked && (
                      <Chip style={styles.unlockedChip} textStyle={styles.unlockedChipText}>
                        Unlocked!
                      </Chip>
                    )}
                    {isNext && (
                      <Chip style={styles.nextChip} textStyle={styles.nextChipText}>
                        Next
                      </Chip>
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {/* Referral History */}
        <Text style={styles.sectionTitle}>Referral History</Text>
        
        <Card style={styles.historyCard}>
          <Card.Content>
            {MOCK_REFERRALS.map((referral, index) => (
              <View key={index}>
                <View style={styles.historyItem}>
                  <Surface style={[
                    styles.historyAvatar,
                    { backgroundColor: colors.royalBlue + '20' },
                  ]}>
                    <Text style={styles.historyAvatarText}>{referral.avatar}</Text>
                  </Surface>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{referral.name}</Text>
                    <Text style={styles.historyDate}>{referral.date}</Text>
                  </View>
                  <Chip
                    style={[
                      styles.statusChip,
                      referral.status === 'active'
                        ? { backgroundColor: colors.success + '20' }
                        : { backgroundColor: colors.warning + '20' },
                    ]}
                    textStyle={[
                      styles.statusText,
                      referral.status === 'active'
                        ? { color: colors.success }
                        : { color: colors.warning },
                    ]}
                  >
                    {referral.status}
                  </Chip>
                </View>
                {index < MOCK_REFERRALS.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
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
  statsCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.softWhite,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressReward: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warmGold,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  codeCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.royalBlue + '40',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.royalBlue,
    letterSpacing: 2,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  shareButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  rewardsList: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rewardCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  rewardCardUnlocked: {
    borderColor: colors.success,
    backgroundColor: colors.success + '05',
  },
  rewardCardNext: {
    borderColor: colors.warmGold,
    borderWidth: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  rewardIconButton: {
    margin: 0,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardReferrals: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
  },
  rewardNameUnlocked: {
    color: colors.success,
  },
  unlockedChip: {
    backgroundColor: colors.success + '20',
  },
  unlockedChipText: {
    color: colors.success,
    fontWeight: '700',
  },
  nextChip: {
    backgroundColor: colors.warmGold + '20',
  },
  nextChipText: {
    color: colors.warmGold,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  historyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  historyAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.royalBlue,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.softWhite,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: colors.border,
  },
});
