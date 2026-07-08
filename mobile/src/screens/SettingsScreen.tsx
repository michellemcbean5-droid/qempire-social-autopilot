import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  Share,
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
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { theme, colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { APP_CONFIG, SUBSCRIPTION_LIMITS } from '@/constants/config';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const { currentTier, setTier, applyPromoCode, applyMasterCode, cancelSubscription } = useSubscriptionStore();
  const { clearAll } = useNotificationStore();
  
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showMasterDialog, setShowMasterDialog] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [masterCode, setMasterCode] = useState('');
  const [promoResult, setPromoResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  const limits = SUBSCRIPTION_LIMITS[currentTier as keyof typeof SUBSCRIPTION_LIMITS];
  const tierColor = currentTier === 'elite' ? colors.tierElite : 
                    currentTier === 'pro' ? colors.tierPro :
                    currentTier === 'basic' ? colors.tierBasic : colors.tierFree;

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoCode);
    setPromoResult(result);
    if (result.success) {
      setTimeout(() => {
        setShowPromoDialog(false);
        setPromoCode('');
        setPromoResult(null);
      }, 2000);
    }
  };

  const handleApplyMaster = () => {
    const result = applyMasterCode(masterCode);
    setPromoResult(result);
    if (result.success) {
      setTimeout(() => {
        setShowMasterDialog(false);
        setMasterCode('');
        setPromoResult(null);
      }, 2000);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Q-Empire Social Autopilot - the AI-powered social media marketing app that runs while you sleep! Download now: ${APP_CONFIG.website}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${APP_CONFIG.supportEmail}`);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'account-circle',
          title: 'Profile',
          subtitle: user?.email || 'Not logged in',
          onPress: () => {},
        },
        {
          icon: 'crown',
          title: 'Subscription',
          subtitle: `${currentTier.toUpperCase()} Plan - ${limits.priceDisplay}`,
          onPress: () => setShowUpgrade(true),
          color: tierColor,
        },
        {
          icon: 'tag',
          title: 'Promo Code',
          subtitle: 'Enter a promo code for discounts',
          onPress: () => setShowPromoDialog(true),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'bell',
          title: 'Push Notifications',
          subtitle: 'Get notified about posts and autopilot',
          toggle: true,
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: 'email',
          title: 'Email Notifications',
          subtitle: 'Receive email summaries',
          toggle: true,
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'theme-light-dark',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'auto-fix',
          title: 'Auto-Publish',
          subtitle: 'Automatically publish generated content',
          toggle: true,
          value: autoPublish,
          onToggle: setAutoPublish,
        },
        {
          icon: 'data-saver',
          title: 'Data Saver',
          subtitle: 'Reduce data usage for images and videos',
          toggle: true,
          value: dataSaver,
          onToggle: setDataSaver,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Help & Support',
          subtitle: 'FAQs, guides, and contact',
          onPress: () => navigation.navigate('Support'),
        },
        {
          icon: 'share-variant',
          title: 'Share App',
          subtitle: 'Tell friends about Q-Empire',
          onPress: handleShare,
        },
        {
          icon: 'star',
          title: 'Rate App',
          subtitle: 'Rate us on the app store',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          icon: 'key',
          title: 'Master Access Code',
          subtitle: 'Enter master code for elite access',
          onPress: () => setShowMasterDialog(true),
        },
        {
          icon: 'delete',
          title: 'Clear All Data',
          subtitle: 'Remove all local data and cache',
          onPress: () => clearAll(),
          color: colors.error,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Surface style={styles.profileHeader}>
        <Avatar.Icon 
          size={64} 
          icon="account" 
          style={{ backgroundColor: colors.royalBlue }}
          color={colors.softWhite}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          <Chip 
            style={[styles.tierChip, { backgroundColor: tierColor + '20', borderColor: tierColor }]}
            textStyle={{ color: tierColor, fontWeight: '700' }}
          >
            {currentTier.toUpperCase()}
          </Chip>
        </View>
      </Surface>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <Card key={section.title} style={styles.sectionCard}>
          <Card.Title 
            title={section.title} 
            titleStyle={styles.sectionTitle}
            titleVariant="titleMedium"
          />
          <Card.Content>
            {section.items.map((item, itemIndex) => (
              <React.Fragment key={item.title}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.onPress}
                  disabled={item.toggle}
                >
                  <View style={styles.settingLeft}>
                    <IconButton
                      icon={item.icon}
                      size={24}
                      iconColor={item.color || colors.royalBlue}
                      style={styles.settingIcon}
                    />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, item.color && { color: item.color }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.royalBlue + '80' }}
                      thumbColor={item.value ? colors.royalBlue : colors.textMuted}
                    />
                  ) : (
                    <IconButton
                      icon="chevron-right"
                      size={20}
                      iconColor={colors.textMuted}
                    />
                  )}
                </TouchableOpacity>
                {itemIndex < section.items.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>{APP_CONFIG.name}</Text>
        <Text style={styles.appInfoVersion}>Version {APP_CONFIG.version} ({APP_CONFIG.buildNumber})</Text>
        <Text style={styles.appInfoLegal}>
          <Text style={styles.link} onPress={() => Linking.openURL(APP_CONFIG.privacyPolicy)}>
            Privacy Policy
          </Text>
          {'  •  '}
          <Text style={styles.link} onPress={() => Linking.openURL(APP_CONFIG.termsOfService)}>
            Terms of Service
          </Text>
        </Text>
      </View>

      {/* Logout Button */}
      <Button
        mode="outlined"
        icon="logout"
        onPress={() => setShowLogoutDialog(true)}
        style={styles.logoutButton}
        textColor={colors.error}
        buttonColor={colors.error + '10'}
      >
        Log Out
      </Button>

      {/* Logout Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Log Out</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)} textColor={colors.textSecondary}>Cancel</Button>
            <Button onPress={() => { logout(); setShowLogoutDialog(false); }} textColor={colors.error}>Log Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Promo Code Dialog */}
      <Portal>
        <Dialog visible={showPromoDialog} onDismiss={() => { setShowPromoDialog(false); setPromoResult(null); }} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Enter Promo Code</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Promo Code"
              value={promoCode}
              onChangeText={setPromoCode}
              style={styles.input}
              textColor={colors.softWhite}
              mode="outlined"
              autoCapitalize="characters"
            />
            {promoResult && (
              <Text style={[styles.promoResult, { color: promoResult.success ? colors.success : colors.error }]}>
                {promoResult.message}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setShowPromoDialog(false); setPromoResult(null); }} textColor={colors.textSecondary}>Cancel</Button>
            <Button onPress={handleApplyPromo} textColor={colors.royalBlue} disabled={!promoCode}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Master Code Dialog */}
      <Portal>
        <Dialog visible={showMasterDialog} onDismiss={() => { setShowMasterDialog(false); setPromoResult(null); }} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Master Access Code</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter Master Code"
              value={masterCode}
              onChangeText={setMasterCode}
              style={styles.input}
              textColor={colors.softWhite}
              mode="outlined"
              secureTextEntry
            />
            {promoResult && (
              <Text style={[styles.promoResult, { color: promoResult.success ? colors.success : colors.error }]}>
                {promoResult.message}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setShowMasterDialog(false); setPromoResult(null); }} textColor={colors.textSecondary}>Cancel</Button>
            <Button onPress={handleApplyMaster} textColor={colors.warmGold} disabled={!masterCode}>Unlock</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.midnightNavy,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.softWhite,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tierChip: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  sectionCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.md,
    marginTop: 0,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    margin: 0,
    marginRight: spacing.sm,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    backgroundColor: colors.border,
  },
  appInfo: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
  },
  appInfoVersion: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  appInfoLegal: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  link: {
    color: colors.royalBlue,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    margin: spacing.lg,
    marginTop: 0,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
    borderColor: colors.error,
  },
  dialog: {
    backgroundColor: colors.midnightNavy,
  },
  dialogTitle: {
    color: colors.softWhite,
  },
  dialogText: {
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.deepObsidian,
  },
  promoResult: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
});
