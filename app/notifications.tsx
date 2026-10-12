import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

type NotifCategory = 'all' | 'alerts' | 'meds' | 'robot';

interface NotificationItem {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
  route?:
    | '/vital-history'
    | '/medication-detail'
    | '/appointment-detail'
    | '/emergency'
    | '/robot-control'
    | '/battery-monitor'
    | '/robot-location'
    | '/robot-tasks'
    | '/robot-settings';
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    category: 'robot',
    title: 'Low Battery Auto-Dock',
    message: 'CareBot battery at 18%. Returning to docking bay to recharge.',
    time: '2 min ago',
    read: false,
    icon: 'battery-charging',
    iconColor: Colors.orange,
    iconBg: Colors.orangeLight,
    route: '/battery-monitor',
  },
  {
    id: '2',
    category: 'robot',
    title: 'Task Delivered: Metformin 500mg',
    message: 'Medical payload confirmed delivered to Room 102 (Ansil Mohamed).',
    time: '8 min ago',
    read: false,
    icon: 'checkmark-circle',
    iconColor: Colors.green,
    iconBg: Colors.greenLight,
    route: '/robot-tasks',
  },
  {
    id: '3',
    category: 'alerts',
    title: 'Emergency Nurse Assist Request',
    message: 'Assistance chime triggered in Corridor B. CareBot positioned on standby.',
    time: '15 min ago',
    read: false,
    icon: 'warning',
    iconColor: Colors.red,
    iconBg: Colors.redLight,
    route: '/emergency',
  },
  {
    id: '4',
    category: 'robot',
    title: 'Wi-Fi Heartbeat Restored',
    message: 'Robot reconnected to CMC-Hospital-IoT-5G. Latency 12ms.',
    time: '35 min ago',
    read: true,
    icon: 'wifi',
    iconColor: Colors.teal,
    iconBg: Colors.tealLight,
    route: '/robot-settings',
  },
  {
    id: '5',
    category: 'alerts',
    title: 'Vital Alert Resolved',
    message: 'Heart rate normalized to 72 bpm after brief elevation.',
    time: '45 min ago',
    read: true,
    icon: 'heart',
    iconColor: Colors.red,
    iconBg: Colors.redLight,
    route: '/vital-history',
  },
  {
    id: '6',
    category: 'meds',
    title: 'Upcoming Medication',
    message: 'Reminder: Take Metformin 500mg with dinner tonight at 7:00 PM.',
    time: '1 hour ago',
    read: true,
    icon: 'medical',
    iconColor: Colors.orange,
    iconBg: Colors.orangeLight,
    route: '/medication-detail',
  },
  {
    id: '7',
    category: 'alerts',
    title: 'Appointment Today',
    message: 'Dr. Sarah Johnson (Cardiology) at City Medical Center, 3:00 PM.',
    time: '2 hours ago',
    read: true,
    icon: 'calendar',
    iconColor: Colors.tealDark,
    iconBg: Colors.tealLight,
    route: '/appointment-detail',
  },
];

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<NotifCategory>('all');
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.category === filter
  );

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const handlePress = (item: NotificationItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, read: true } : i))
    );
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Sub-header / Actions */}
        <View style={styles.topActions}>
          <Text style={styles.unreadCount}>
            {items.filter((i) => !i.read).length} Unread Alerts
          </Text>
          <View style={styles.actionBtns}>
            <TouchableOpacity onPress={markAllRead} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll} style={[styles.actionBtn, styles.clearBtn]}>
              <Text style={[styles.actionBtnText, styles.clearBtnText]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'alerts' as const, label: 'Alerts' },
            { key: 'meds' as const, label: 'Meds' },
            { key: 'robot' as const, label: 'CareBot' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterPill, filter === tab.key && styles.filterPillActive]}
              onPress={() => setFilter(tab.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === tab.key && styles.filterPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={56} color={Colors.gray300} />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySubtitle}>You are all caught up!</Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !item.read && styles.cardUnread]}
                onPress={() => handlePress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardMessage}>{item.message}</Text>
                  {item.route && (
                    <Text style={styles.cardLink}>View details →</Text>
                  )}
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  unreadCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.tealDark,
  },
  clearBtn: {},
  clearBtnText: {
    color: Colors.gray400,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardUnread: {
    borderColor: Colors.tealLight,
    backgroundColor: '#FAFDFE',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardTitleUnread: {
    fontWeight: '700',
    color: Colors.primary,
  },
  cardTime: {
    fontSize: 11,
    color: Colors.gray400,
  },
  cardMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  cardLink: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
