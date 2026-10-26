import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

// ── Types ──────────────────────────────────────────────────────────────────────
interface QuickStat {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  status: 'normal' | 'warning' | 'critical';
}

interface UpcomingItem {
  id: string;
  type: 'appointment' | 'medication';
  title: string;
  subtitle: string;
  time: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const quickStats: QuickStat[] = [
  {
    label: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    icon: 'heart',
    color: Colors.red,
    bg: Colors.redLight,
    status: 'normal',
  },
  {
    label: 'Blood Pressure',
    value: '118/78',
    unit: 'mmHg',
    icon: 'fitness',
    color: Colors.teal,
    bg: Colors.tealLight,
    status: 'normal',
  },
  {
    label: 'Blood Sugar',
    value: '98',
    unit: 'mg/dL',
    icon: 'water',
    color: Colors.orange,
    bg: Colors.orangeLight,
    status: 'normal',
  },
  {
    label: 'SpO₂',
    value: '98',
    unit: '%',
    icon: 'pulse',
    color: Colors.green,
    bg: Colors.greenLight,
    status: 'normal',
  },
];

const upcomingItems: UpcomingItem[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Dr. Sarah Johnson',
    subtitle: 'Cardiology · City Medical Center',
    time: 'Today, 3:00 PM',
    icon: 'person',
    color: Colors.teal,
  },
  {
    id: '2',
    type: 'medication',
    title: 'Metformin 500mg',
    subtitle: 'With dinner',
    time: 'Today, 7:00 PM',
    icon: 'medical',
    color: Colors.green,
  },
  {
    id: '3',
    type: 'appointment',
    title: 'Dr. Robert Chen',
    subtitle: 'General Physician · HealthPlus',
    time: 'Tomorrow, 10:30 AM',
    icon: 'person',
    color: Colors.teal,
  },
];

const tips = [
  '💧 Drink at least 8 glasses of water today.',
  '🚶 A 30-minute walk can lower blood pressure significantly.',
  '😴 7–9 hours of sleep improves heart health.',
  '🥗 Add more leafy greens to your diet for better vitals.',
];

// ── Main Component ─────────────────────────────────────────────────────────────
// Computed once at module level — Math.random() is not allowed inside render
const INITIAL_TIP_INDEX = Math.floor(Math.random() * tips.length);

export default function HomeScreen() {
  const [tipIndex] = useState(INITIAL_TIP_INDEX);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} accessibilityLabel="View Profile">
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>Ansil Mohamed 👋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => router.push('/notifications')}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications" size={22} color={Colors.white} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          {/* Robot Status Card */}
          <View style={styles.robotCard}>
            <TouchableOpacity
              style={styles.robotCardLeft}
              onPress={() => router.push('/robot-control')}
              accessibilityLabel="Open Robot Controller"
            >
              <View style={styles.robotAvatar}>
                <Ionicons name="hardware-chip" size={28} color={Colors.teal} />
              </View>
              <View>
                <View style={styles.heroNameRow}>
                  <Text style={styles.robotName}>CareBot AI</Text>
                  <View style={styles.heroBatteryBadge}>
                    <Ionicons name="battery-charging" size={11} color={Colors.green} />
                    <Text style={styles.heroBatteryText}>94%</Text>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active · Tap to Control →</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emergencyBtn}
              onPress={() => router.push('/emergency')}
              accessibilityLabel="Emergency"
            >
              <Ionicons name="warning" size={16} color={Colors.white} />
              <Text style={styles.emergencyBtnText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Quick Stats Grid ────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{"Today's Vitals"}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/vitals')}>
              <Text style={styles.seeAll}>View all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.statCard}
                onPress={() => router.push('/vital-history')}
                accessibilityLabel={`${stat.label}: ${stat.value} ${stat.unit}`}
              >
                <View style={[styles.statIconBg, { backgroundColor: stat.bg }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={[styles.statBadge, { backgroundColor: Colors.greenLight }]}>
                  <Text style={[styles.statBadgeText, { color: Colors.greenDark }]}>Normal</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Health Tip ──────────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientTeal as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tipCard}
        >
          <Ionicons name="bulb" size={22} color={Colors.white} style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>Health Tip</Text>
            <Text style={styles.tipText}>{tips[tipIndex]}</Text>
          </View>
        </LinearGradient>

        {/* ── Upcoming ────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
              <Text style={styles.seeAll}>View all →</Text>
            </TouchableOpacity>
          </View>
          {upcomingItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.upcomingCard}
              onPress={() =>
                item.type === 'appointment'
                  ? router.push('/appointment-detail')
                  : router.push('/medication-detail')
              }
              accessibilityLabel={`${item.title} at ${item.time}`}
            >
              <View style={[styles.upcomingIconBg, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>{item.title}</Text>
                <Text style={styles.upcomingSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.upcomingRight}>
                <Text style={styles.upcomingTime}>{item.time}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Actions ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {/* 2 rows × 3 columns */}
          {(() => {
            const ACTIONS = [
              { label: 'Controller',  icon: 'game-controller-outline', color: Colors.teal,     route: '/robot-control'          },
              { label: 'Robot Tasks', icon: 'file-tray-full-outline',  color: Colors.green,    route: '/robot-tasks'            },
              { label: 'Book Visit',  icon: 'calendar-outline',        color: Colors.tealDark, route: '/(tabs)/appointments'    },
              { label: 'Log Vitals',  icon: 'add-circle-outline',      color: Colors.greenDark,route: '/(tabs)/vitals'          },
              { label: 'Medications', icon: 'medical-outline',         color: Colors.orange,   route: '/(tabs)/medications'     },
              { label: 'Emergency',   icon: 'warning-outline',         color: Colors.red,      route: '/emergency'              },
            ];
            const rows = [ACTIONS.slice(0, 3), ACTIONS.slice(3, 6)];
            return (
              <View style={styles.actionsGrid}>
                {rows.map((row, ri) => (
                  <View key={ri} style={styles.actionsRow}>
                    {row.map((action, ci) => (
                      <TouchableOpacity
                        key={ci}
                        style={styles.actionCard}
                        onPress={() => router.push(action.route as any)}
                        accessibilityLabel={action.label}
                      >
                        <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                          <Ionicons name={action.icon as any} size={26} color={action.color} />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: Colors.textWhiteMuted, letterSpacing: 0.5 },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.white, marginTop: 2 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.red,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },

  // Robot Card
  robotCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  robotCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  robotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,180,216,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.teal,
  },
  robotName: { fontSize: 15, fontWeight: '700', color: Colors.white },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBatteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(6,214,160,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  heroBatteryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.green,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  statusText: { fontSize: 12, color: Colors.textWhiteMuted },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.red,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emergencyBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  // Section
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.teal, fontWeight: '600' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statUnit: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', marginTop: 1 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', marginTop: 4 },
  statBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 8 },
  statBadgeText: { fontSize: 10, fontWeight: '700' },

  // Tip Card
  tipCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIcon: { flexShrink: 0 },
  tipContent: { flex: 1 },
  tipLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  tipText: { fontSize: 13, color: Colors.white, lineHeight: 18 },

  // Upcoming
  upcomingCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  upcomingIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  upcomingInfo: { flex: 1 },
  upcomingTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  upcomingSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  upcomingRight: { alignItems: 'flex-end', gap: 4 },
  upcomingTime: { fontSize: 11, color: Colors.teal, fontWeight: '600' },

  // Quick Actions — strict 2 rows × 3 columns
  actionsGrid: {
    gap: 12,
    marginTop: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },

  bottomPad: { height: 20 },
});
