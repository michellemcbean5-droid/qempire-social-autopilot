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
  Surface,
  Chip,
  Card,
  IconButton,
  Badge,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotificationStore();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert';
      case 'critical': return 'alert-octagon';
      default: return 'information';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'critical': return colors.error;
      default: return colors.info;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>🔔 Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount} unread of {notifications.length} total
            </Text>
          </View>
          {unreadCount > 0 && (
            <Button
              mode="text"
              onPress={markAllAsRead}
              textColor={colors.royalBlue}
              compact
            >
              Mark All Read
            </Button>
          )}
        </View>

        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'unread' && styles.filterChipActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread
            </Text>
            {unreadCount > 0 && (
              <Badge style={styles.filterBadge}>{unreadCount}</Badge>
            )}
          </TouchableOpacity>
        </View>
      </Surface>

      <ScrollView style={styles.scrollView}>
        {filteredNotifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'unread' 
                  ? 'All caught up! Check back later for updates.'
                  : 'Notifications about your posts, autopilot, and platform connections will appear here.'
                }
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationUnread,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationIcon}>
                <IconButton
                  icon={getTypeIcon(notification.type)}
                  size={24}
                  iconColor={getTypeColor(notification.type)}
                  style={styles.typeIcon}
                />
                {!notification.read && (
                  <View style={[styles.unreadDot, { backgroundColor: getTypeColor(notification.type) }]} />
                )}
              </View>

              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatTime(notification.timestamp)}
                </Text>
              </View>

              <IconButton
                icon="close"
                size={16}
                iconColor={colors.textMuted}
                onPress={() => dismissNotification(notification.id)}
                style={styles.dismissButton}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    paddingBottom: spacing.md,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
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
  filterBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.deepObsidian,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.royalBlue + '20',
    borderColor: colors.royalBlue,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.royalBlue,
  },
  filterBadge: {
    marginLeft: spacing.xs,
    backgroundColor: colors.error,
  },
  scrollView: {
    flex: 1,
  },
  emptyCard: {
    backgroundColor: colors.midnightNavy,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  emptyContent: {
    alignItems: 'center',
    padding: spacing.xl,
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
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.midnightNavy,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  notificationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.royalBlue,
  },
  notificationIcon: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  typeIcon: {
    margin: 0,
  },
  unreadDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  dismissButton: {
    margin: 0,
    marginLeft: spacing.sm,
  },
});
