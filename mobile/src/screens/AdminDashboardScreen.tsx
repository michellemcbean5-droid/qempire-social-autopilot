import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Button, Surface, Divider, Switch, List, Badge, Dialog, Portal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, borderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

const ADMIN_ACTIONS = [
  {
    id: 'content',
    title: 'Content Manager',
    description: 'Edit, approve, or delete AI-generated posts',
    icon: 'create',
    color: colors.electricBlue,
    badge: '142 pending',
  },
  {
    id: 'platforms',
    title: 'Platform Controls',
    description: 'Enable/disable platforms, check API status',
    icon: 'share-social',
    color: colors.hotPink,
    badge: '3 issues',
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'View users, manage subscriptions, reset accounts',
    icon: 'people',
    color: colors.electricYellow,
    badge: '1,247 users',
  },
  {
    id: 'analytics',
    title: 'System Analytics',
    description: 'Server health, API usage, error logs',
    icon: 'stats-chart',
    color: colors.neonGreen,
    badge: 'Live',
  },
  {
    id: 'scheduler',
    title: 'Scheduler Control',
    description: 'Manage autopilot queues, pause/resume posting',
    icon: 'time',
    color: colors.electricPurple,
    badge: '847 queued',
  },
  {
    id: 'settings',
    title: 'App Settings',
    description: 'Update app config, change credentials, debug mode',
    icon: 'settings',
    color: colors.coral,
    badge: null,
  },
];

const SYSTEM_STATUS = [
  { name: 'AI Engine', status: 'operational', uptime: '99.9%' },
  { name: 'Scheduler', status: 'operational', uptime: '99.7%' },
  { name: 'Database', status: 'operational', uptime: '100%' },
  { name: 'Push Notifications', status: 'degraded', uptime: '94.2%' },
  { name: 'Facebook API', status: 'operational', uptime: '98.5%' },
  { name: 'Instagram API', status: 'operational', uptime: '97.8%' },
  { name: 'X/Twitter API', status: 'issue', uptime: '82.1%' },
  { name: 'TikTok API', status: 'operational', uptime: '96.3%' },
];

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { adminLogout, isAdmin } = useAuthStore();
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');

  const handleAction = (actionId: string) => {
    Alert.alert(
      'Admin Action',
      `${actionId} panel opened. This is a management interface for post-launch corrections.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const confirmAction = (action: string) => {
    setDialogAction(action);
    setConfirmDialog(true);
  };

  const executeAction = () => {
    setConfirmDialog(false);
    Alert.alert('Success', `${dialogAction} executed successfully.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to exit the admin portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: adminLogout },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[colors.deepObsidian, colors.midnightNavy]}
      style={styles.container}
    >
      <Portal>
        <Dialog visible={confirmDialog} onDismiss={() => setConfirmDialog(false)}>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to {dialogAction}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onPress={executeAction}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.adminTag}>
              <LinearGradient
                colors={[colors.electricYellow, '#FFA500']}
                style={styles.adminTagGradient}
              >
                <Ionicons name="shield-checkmark" size={14} color={colors.deepObsidian} />
                <Text style={styles.adminTagText}>ADMIN</Text>
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>Control Center</Text>
            <Text style={styles.headerSubtitle}>
              Post-launch management & correction tools
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Surface style={[styles.statCard, { borderLeftColor: colors.electricBlue }]}>
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </Surface>
          <Surface style={[styles.statCard, { borderLeftColor: colors.hotPink }]}>
            <Text style={styles.statNumber}>2.4K</Text>
            <Text style={styles.statLabel}>Posts Today</Text>
          </Surface>
          <Surface style={[styles.statCard, { borderLeftColor: colors.electricYellow }]}>
            <Text style={styles.statNumber}>847</Text>
            <Text style={styles.statLabel}>In Queue</Text>
          </Surface>
        </View>

        {/* System Status */}
        <Text style={styles.sectionTitle}>🔍 System Status</Text>
        <Surface style={styles.statusCard}>
          {SYSTEM_STATUS.map((system, index) => (
            <View key={system.name}>
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        system.status === 'operational' ? colors.success :
                        system.status === 'degraded' ? colors.warning :
                        colors.error
                    }
                  ]} />
                  <Text style={styles.statusName}>{system.name}</Text>
                </View>
                <View style={styles.statusRight}>
                  <Text style={[
                    styles.statusUptime,
                    {
                      color:
                        system.status === 'operational' ? colors.success :
                        system.status === 'degraded' ? colors.warning :
                        colors.error
                    }
                  ]}>
                    {system.uptime}
                  </Text>
                  <Text style={styles.statusText}>{system.status}</Text>
                </View>
              </View>
              {index < SYSTEM_STATUS.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Surface>

        {/* Admin Actions */}
        <Text style={styles.sectionTitle}>⚡ Management Tools</Text>
        <View style={styles.actionsList}>
          {ADMIN_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => handleAction(action.id)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDesc}>{action.description}</Text>
              </View>
              {action.badge && (
                <View style={[styles.actionBadge, { backgroundColor: action.color + '20', borderColor: action.color + '40' }]}>
                  <Text style={[styles.actionBadgeText, { color: action.color }]}>{action.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Controls */}
        <Text style={styles.sectionTitle}>🚨 Emergency Controls</Text>
        <Surface style={styles.emergencyCard}>
          <View style={styles.controlRow}>
            <View style={styles.controlLeft}>
              <Ionicons name="bug" size={20} color={colors.warning} />
              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>Debug Mode</Text>
                <Text style={styles.controlDesc}>Enable detailed logging</Text>
              </View>
            </View>
            <Switch
              value={debugMode}
              onValueChange={setDebugMode}
              color={colors.warning}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.controlRow}>
            <View style={styles.controlLeft}>
              <Ionicons name="construct" size={20} color={colors.error} />
              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>Maintenance Mode</Text>
                <Text style={styles.controlDesc}>Pause all autopilot posting</Text>
              </View>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={(val) => {
                if (val) confirmAction('enable maintenance mode');
                else setMaintenanceMode(false);
              }}
              color={colors.error}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.emergencyButtons}>
            <Button
              mode="outlined"
              onPress={() => confirmAction('clear all queues')}
              style={[styles.emergencyBtn, { borderColor: colors.error + '50' }]}
              labelStyle={{ color: colors.error }}
              icon="trash"
            >
              Clear All Queues
            </Button>
            <Button
              mode="outlined"
              onPress={() => confirmAction('reset all APIs')}
              style={[styles.emergencyBtn, { borderColor: colors.warning + '50' }]}
              labelStyle={{ color: colors.warning }}
              icon="refresh"
            >
              Reset APIs
            </Button>
          </View>
        </Surface>

        {/* Build Info */}
        <Surface style={styles.buildCard}>
          <Text style={styles.buildTitle}>📦 Build Information</Text>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Version</Text>
            <Text style={styles.buildValue}>1.0.0 (Build 100)</Text>
          </View>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Platform</Text>
            <Text style={styles.buildValue}>Android / iOS</Text>
          </View>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Environment</Text>
            <Text style={styles.buildValue}>Production</Text>
          </View>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Last Deploy</Text>
            <Text style={styles.buildValue}>2026-08-07 08:00 UTC</Text>
          </View>
          <View style={styles.buildRow}>
            <Text style={styles.buildLabel}>Admin Access</Text>
            <Text style={[styles.buildValue, { color: colors.success }]}>● Active</Text>
          </View>
        </Surface>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  adminTag: {
    marginBottom: spacing.xs,
  },
  adminTagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  adminTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.deepObsidian,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.softWhite,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    padding: spacing.sm,
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.electricBlue,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.softWhite,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusName: {
    fontSize: 14,
    color: colors.softWhite,
    fontWeight: '500',
  },
  statusRight: {
    alignItems: 'flex-end',
  },
  statusUptime: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  actionsList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.softWhite,
  },
  actionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emergencyCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  controlText: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.softWhite,
  },
  controlDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  emergencyButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  emergencyBtn: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  buildCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  buildTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  buildRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  buildLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  buildValue: {
    fontSize: 13,
    color: colors.softWhite,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
