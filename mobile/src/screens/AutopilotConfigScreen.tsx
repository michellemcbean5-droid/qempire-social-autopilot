import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Surface,
  Chip,
  Card,
  List,
  IconButton,
  HelperText,
  Divider,
  Dialog,
  Portal,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { usePlatformStore } from '@/store/platformStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import UpgradePrompt from '@/components/UpgradePrompt';

const FREQUENCY_OPTIONS = [
  { id: 'hourly', label: 'Hourly', description: 'Post every hour', icon: 'clock' },
  { id: 'daily', label: 'Daily', description: 'Once per day at set time', icon: 'calendar-today' },
  { id: 'twice_daily', label: 'Twice Daily', description: 'Morning and evening', icon: 'calendar-clock' },
  { id: 'weekly', label: 'Weekly', description: 'Once per week', icon: 'calendar-week' },
  { id: 'custom', label: 'Custom', description: 'Custom cron schedule', icon: 'cog' },
];

const BEST_TIMES = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export default function AutopilotConfigScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentTier, canUseFeature } = useSubscriptionStore();
  const { platforms, getConnectedCount } = usePlatformStore();
  const { addNotification } = useNotificationStore();
  
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customCron, setCustomCron] = useState('0 9 * * *');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const autopilotEnabled = canUseFeature('autopilotEnabled');
  const customSchedulesEnabled = canUseFeature('customSchedules');
  const connectedCount = getConnectedCount();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSave = () => {
    if (!autopilotEnabled) {
      setShowUpgrade(true);
      return;
    }

    if (selectedPlatforms.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Platforms Selected',
        message: 'Please select at least one platform for autopilot.',
      });
      return;
    }

    addNotification({
      type: 'success',
      title: 'Autopilot Configured',
      message: `Autopilot ${enabled ? 'enabled' : 'disabled'} with ${frequency} frequency.`,
    });

    navigation.goBack();
  };

  const getSchedulePreview = () => {
    const now = new Date();
    const times: string[] = [];
    
    switch (frequency) {
      case 'hourly':
        for (let i = 0; i < 5; i++) {
          const next = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000);
          times.push(next.toLocaleString());
        }
        break;
      case 'daily':
        for (let i = 0; i < 5; i++) {
          const next = new Date(now);
          next.setDate(next.getDate() + i);
          const [hours, minutes] = time.split(':');
          next.setHours(parseInt(hours), parseInt(minutes));
          times.push(next.toLocaleString());
        }
        break;
      case 'twice_daily':
        for (let i = 0; i < 3; i++) {
          const next = new Date(now);
          next.setDate(next.getDate() + i);
          const [hours, minutes] = time.split(':');
          next.setHours(parseInt(hours), parseInt(minutes));
          times.push(next.toLocaleString());
          const next2 = new Date(next);
          next2.setHours(next2.getHours() + 12);
          times.push(next2.toLocaleString());
        }
        break;
      case 'weekly':
        for (let i = 0; i < 4; i++) {
          const next = new Date(now);
          next.setDate(next.getDate() + i * 7);
          const [hours, minutes] = time.split(':');
          next.setHours(parseInt(hours), parseInt(minutes));
          times.push(next.toLocaleString());
        }
        break;
      default:
        times.push('Custom schedule - see cron expression');
    }
    
    return times;
  };

  if (!autopilotEnabled) {
    return (
      <View style={styles.container}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>🚀 Autopilot</Text>
          <Text style={styles.headerSubtitle}>Automate your social media posting</Text>
        </Surface>
        
        <Card style={styles.upgradeCard}>
          <Card.Content>
            <Text style={styles.upgradeIcon}>🚀</Text>
            <Text style={styles.upgradeTitle}>Unlock Autopilot</Text>
            <Text style={styles.upgradeText}>
              Upgrade to Basic or higher to enable automatic content generation and posting on a schedule.
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowUpgrade(true)}
              style={styles.upgradeButton}
              buttonColor={colors.warmGold}
              textColor={colors.deepObsidian}
              icon="crown"
            >
              Upgrade to Unlock
            </Button>
          </Card.Content>
        </Card>

        <UpgradePrompt visible={showUpgrade} onDismiss={() => setShowUpgrade(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>🚀 Autopilot</Text>
              <Text style={styles.headerSubtitle}>
                {enabled ? 'Active - posts will be automated' : 'Configure your posting schedule'}
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: colors.border, true: colors.success + '80' }}
              thumbColor={enabled ? colors.success : colors.textMuted}
            />
          </View>
        </Surface>

        {/* Frequency Selection */}
        <Card style={styles.card}>
          <Card.Title title="Posting Frequency" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.frequencyGrid}>
              {FREQUENCY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.frequencyOption,
                    frequency === option.id && styles.frequencyOptionSelected,
                    option.id === 'custom' && !customSchedulesEnabled && styles.frequencyOptionDisabled,
                  ]}
                  onPress={() => {
                    if (option.id === 'custom' && !customSchedulesEnabled) {
                      setShowUpgrade(true);
                      return;
                    }
                    setFrequency(option.id);
                  }}
                  disabled={option.id === 'custom' && !customSchedulesEnabled}
                >
                  <IconButton
                    icon={option.icon}
                    size={24}
                    iconColor={frequency === option.id ? colors.royalBlue : colors.textSecondary}
                    style={styles.frequencyIcon}
                  />
                  <Text style={[
                    styles.frequencyLabel,
                    frequency === option.id && styles.frequencyLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.frequencyDescription}>
                    {option.id === 'custom' && !customSchedulesEnabled ? 'Pro required' : option.description}
                  </Text>
                  {option.id === 'custom' && !customSchedulesEnabled && (
                    <Chip style={styles.proChip} textStyle={styles.proChipText}>PRO</Chip>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Time Selection */}
        <Card style={styles.card}>
          <Card.Title title="Posting Time" titleStyle={styles.cardTitle} />
          <Card.Content>
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() => setShowTimePicker(true)}
            >
              <IconButton icon="clock" size={24} iconColor={colors.royalBlue} />
              <Text style={styles.timeValue}>{time}</Text>
              <IconButton icon="chevron-down" size={20} iconColor={colors.textSecondary} />
            </TouchableOpacity>
            <HelperText type="info" visible={true}>
              Best posting times: 9:00 AM, 12:00 PM, 6:00 PM
            </HelperText>
          </Card.Content>
        </Card>

        {/* Custom Cron */}
        {frequency === 'custom' && (
          <Card style={styles.card}>
            <Card.Title title="Custom Schedule (Cron)" titleStyle={styles.cardTitle} />
            <Card.Content>
              <TextInput
                label="Cron Expression"
                value={customCron}
                onChangeText={setCustomCron}
                mode="outlined"
                style={styles.input}
                textColor={colors.softWhite}
                placeholder="0 9 * * *"
              />
              <HelperText type="info" visible={true}>
                Format: minute hour day month weekday
              </HelperText>
            </Card.Content>
          </Card>
        )}

        {/* Platform Selection */}
        <Card style={styles.card}>
          <Card.Title
            title={`Platforms (${selectedPlatforms.length}/${connectedCount} connected)`}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {platforms.filter(p => p.connected).map(platform => (
              <TouchableOpacity
                key={platform.id}
                style={styles.platformRow}
                onPress={() => togglePlatform(platform.id)}
              >
                <View style={styles.platformInfo}>
                  <Text style={styles.platformEmoji}>{platform.name.charAt(0)}</Text>
                  <Text style={styles.platformName}>{platform.name}</Text>
                </View>
                <Switch
                  value={selectedPlatforms.includes(platform.id)}
                  onValueChange={() => togglePlatform(platform.id)}
                  trackColor={{ false: colors.border, true: colors.royalBlue + '80' }}
                  thumbColor={selectedPlatforms.includes(platform.id) ? colors.royalBlue : colors.textMuted}
                />
              </TouchableOpacity>
            ))}
            {connectedCount === 0 && (
              <Text style={styles.emptyText}>
                No platforms connected. Go to Platforms tab to connect your accounts.
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Schedule Preview */}
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => setShowPreview(true)}
            >
              <IconButton icon="eye" size={20} iconColor={colors.royalBlue} />
              <Text style={styles.previewText}>Preview Schedule</Text>
              <IconButton icon="chevron-right" size={20} iconColor={colors.textSecondary} />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          buttonColor={colors.royalBlue}
          icon="content-save"
        >
          Save Autopilot Configuration
        </Button>
      </ScrollView>

      {/* Time Picker Dialog */}
      <Portal>
        <Dialog visible={showTimePicker} onDismiss={() => setShowTimePicker(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Select Time</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.timeList}>
              {BEST_TIMES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeOption, time === t && styles.timeOptionSelected]}
                  onPress={() => { setTime(t); setShowTimePicker(false); }}
                >
                  <Text style={[styles.timeOptionText, time === t && styles.timeOptionTextSelected]}>
                    {t}
                  </Text>
                  {time === t && <IconButton icon="check" size={20} iconColor={colors.success} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* Schedule Preview Dialog */}
      <Portal>
        <Dialog visible={showPreview} onDismiss={() => setShowPreview(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Upcoming Posts</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.previewSubtitle}>
              {frequency === 'custom' ? 'Custom schedule' : `${FREQUENCY_OPTIONS.find(f => f.id === frequency)?.label} at ${time}`}
            </Text>
            {getSchedulePreview().map((t, i) => (
              <View key={i} style={styles.previewItem}>
                <Text style={styles.previewNumber}>{i + 1}</Text>
                <Text style={styles.previewTime}>{t}</Text>
              </View>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPreview(false)} textColor={colors.textSecondary}>Close</Button>
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
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  frequencyOption: {
    width: '47%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.deepObsidian,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    borderColor: colors.royalBlue,
    backgroundColor: colors.royalBlue + '10',
  },
  frequencyOptionDisabled: {
    opacity: 0.5,
  },
  frequencyIcon: {
    margin: 0,
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  frequencyLabelSelected: {
    color: colors.royalBlue,
  },
  frequencyDescription: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  proChip: {
    marginTop: spacing.xs,
    backgroundColor: colors.warmGold + '20',
    height: 20,
  },
  proChipText: {
    color: colors.warmGold,
    fontSize: 10,
    fontWeight: '700',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.softWhite,
  },
  input: {
    backgroundColor: colors.deepObsidian,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformEmoji: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.royalBlue + '20',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 14,
    fontWeight: '700',
    color: colors.royalBlue,
    marginRight: spacing.sm,
  },
  platformName: {
    fontSize: 16,
    color: colors.softWhite,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.deepObsidian,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  previewText: {
    flex: 1,
    fontSize: 16,
    color: colors.softWhite,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },
  dialog: {
    backgroundColor: colors.midnightNavy,
  },
  dialogTitle: {
    color: colors.softWhite,
  },
  timeList: {
    maxHeight: 300,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  timeOptionSelected: {
    backgroundColor: colors.royalBlue + '20',
  },
  timeOptionText: {
    fontSize: 16,
    color: colors.softWhite,
  },
  timeOptionTextSelected: {
    color: colors.royalBlue,
    fontWeight: '600',
  },
  previewSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.royalBlue + '20',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
    color: colors.royalBlue,
    marginRight: spacing.sm,
  },
  previewTime: {
    fontSize: 14,
    color: colors.softWhite,
  },
  upgradeCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  upgradeIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.softWhite,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  upgradeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  upgradeButton: {
    borderRadius: borderRadius.md,
  },
});
