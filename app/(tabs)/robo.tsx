import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';

type ChargingState = 'charging' | 'discharging' | 'docked_full';

interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'room' | 'dock' | 'pharmacy' | 'nurse';
}

const facilityWaypoints: Waypoint[] = [
  { id: 'dock', name: 'Dock Station', x: 15, y: 80, type: 'dock' },
  { id: 'pharmacy', name: 'Pharmacy', x: 20, y: 25, type: 'pharmacy' },
  { id: 'nurse', name: 'Nurse Station', x: 50, y: 50, type: 'nurse' },
  { id: 'room101', name: 'Room 101', x: 80, y: 25, type: 'room' },
  { id: 'room102', name: 'Room 102 (Ansil)', x: 82, y: 75, type: 'room' },
];

const waypointIcon: Record<Waypoint['type'], React.ComponentProps<typeof Ionicons>['name']> = {
  dock: 'home',
  pharmacy: 'medkit',
  nurse: 'people',
  room: 'bed',
};

const waypointColor: Record<Waypoint['type'], string> = {
  dock: Colors.teal,
  pharmacy: Colors.green,
  nurse: Colors.primaryLight,
  room: Colors.orange,
};

export default function RoboScreen() {
  // ── Battery State ─────────────────────────────────────────────────────────
  const [batteryPercent, setBatteryPercent] = useState(88);
  const [chargingState, setChargingState] = useState<ChargingState>('charging');
  const [autoReturnToDock, setAutoReturnToDock] = useState(true);
  const [powerSaveMode, setPowerSaveMode] = useState(false);

  // ── Map State ─────────────────────────────────────────────────────────────
  const [robotPos] = useState({ x: 58, y: 56 });
  const [targetDestination] = useState('Room 102 (Ansil)');
  const [trackingActive, setTrackingActive] = useState(true);

  const batteryColor =
    batteryPercent <= 10 ? Colors.red : batteryPercent <= 20 ? Colors.orange : Colors.green;

  const chargingLabel: Record<ChargingState, string> = {
    charging: 'Charging',
    discharging: 'Discharging',
    docked_full: 'Fully Charged',
  };

  const chargingIconName: Record<ChargingState, React.ComponentProps<typeof Ionicons>['name']> = {
    charging: 'battery-charging',
    discharging: 'battery-half',
    docked_full: 'checkmark-circle',
  };

  const simulateDischarge = () => {
    setChargingState('discharging');
    setBatteryPercent((p) => Math.max(8, p - 15));
  };

  const simulateCharge = () => {
    setChargingState('charging');
    setBatteryPercent((p) => Math.min(100, p + 15));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerEyebrow}>CareBot AI</Text>
              <Text style={styles.headerTitle}>Robo Hub</Text>
            </View>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => router.push('/robot-control')}
              accessibilityLabel="Open Controller"
            >
              <Ionicons name="game-controller" size={18} color={Colors.white} />
              <Text style={styles.controlBtnText}>Controller</Text>
            </TouchableOpacity>
          </View>

          {/* Status strip */}
          <View style={styles.statusStrip}>
            <View style={styles.statusPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusPillText}>Online</Text>
            </View>
            <View style={styles.statusPill}>
              <Ionicons name="battery-charging" size={13} color={Colors.green} />
              <Text style={styles.statusPillText}>{batteryPercent}%</Text>
            </View>
            <View style={styles.statusPill}>
              <Ionicons name="location" size={13} color={Colors.teal} />
              <Text style={styles.statusPillText}>Tracking</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Live Map Preview ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Map</Text>
            <TouchableOpacity
              onPress={() => router.push('/robot-location')}
              accessibilityLabel="Open full map"
            >
              <Text style={styles.seeAll}>Full Map →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapCard}>
            {/* Grid lines */}
            <View style={styles.mapGridH1} />
            <View style={styles.mapGridH2} />
            <View style={styles.mapGridV1} />
            <View style={styles.mapGridV2} />

            {/* Waypoints */}
            {facilityWaypoints.map((wp) => (
              <View
                key={wp.id}
                style={[
                  styles.waypointPin,
                  {
                    left: `${wp.x}%` as any,
                    top: `${wp.y}%` as any,
                    backgroundColor: waypointColor[wp.type] + '30',
                    borderColor: waypointColor[wp.type],
                  },
                ]}
              >
                <Ionicons name={waypointIcon[wp.type]} size={10} color={waypointColor[wp.type]} />
              </View>
            ))}

            {/* Robot */}
            <View
              style={[
                styles.robotPin,
                { left: `${robotPos.x}%` as any, top: `${robotPos.y}%` as any },
              ]}
            >
              <Ionicons name="hardware-chip" size={14} color={Colors.white} />
            </View>

            {/* Destination label */}
            <View style={styles.mapDestBadge}>
              <Ionicons name="navigate" size={11} color={Colors.teal} />
              <Text style={styles.mapDestText}>{targetDestination}</Text>
            </View>

            {/* Tracking toggle */}
            <TouchableOpacity
              style={[styles.trackingBadge, trackingActive && styles.trackingBadgeActive]}
              onPress={() => setTrackingActive((v) => !v)}
              accessibilityLabel="Toggle tracking"
            >
              <Ionicons
                name={trackingActive ? 'radio' : 'radio-outline'}
                size={12}
                color={trackingActive ? Colors.green : Colors.gray300}
              />
              <Text style={[styles.trackingText, trackingActive && { color: Colors.green }]}>
                {trackingActive ? 'Live' : 'Paused'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions — 2 rows × 3 columns */}
          {(() => {
            const ACTIONS = [
              { label: 'Send to Dock', icon: 'home-outline',          color: Colors.teal,        route: '/robot-location' },
              { label: 'Navigate',     icon: 'navigate-outline',       color: Colors.primaryLight, route: '/robot-location' },
              { label: 'Pause Robot',  icon: 'pause-circle-outline',   color: Colors.orange,       route: '/robot-control'  },
              { label: 'E-Stop',       icon: 'stop-circle-outline',    color: Colors.red,          route: '/robot-control'  },
              { label: 'Horn',         icon: 'megaphone-outline',      color: Colors.green,        route: '/robot-control'  },
              { label: 'Settings',     icon: 'settings-outline',       color: Colors.gray400,      route: '/robot-settings' },
            ];
            const rows = [ACTIONS.slice(0, 3), ACTIONS.slice(3, 6)];
            return (
              <View style={styles.quickGrid}>
                {rows.map((row, ri) => (
                  <View key={ri} style={styles.quickRow}>
                    {row.map((a, ci) => (
                      <TouchableOpacity
                        key={ci}
                        style={styles.quickBtn}
                        onPress={() => router.push(a.route as any)}
                        accessibilityLabel={a.label}
                      >
                        <View style={[styles.quickIcon, { backgroundColor: a.color + '1A' }]}>
                          <Ionicons name={a.icon as any} size={22} color={a.color} />
                        </View>
                        <Text style={styles.quickLabel}>{a.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            );
          })()}
        </View>

        {/* ── Battery Monitor ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Battery</Text>
            <TouchableOpacity
              onPress={() => router.push('/battery-monitor')}
              accessibilityLabel="Open full battery screen"
            >
              <Text style={styles.seeAll}>Details →</Text>
            </TouchableOpacity>
          </View>

          {/* Battery card */}
          <View style={styles.batteryCard}>
            {/* Circular indicator */}
            <View style={[styles.batteryCircle, { borderColor: batteryColor }]}>
              <Ionicons name={chargingIconName[chargingState]} size={28} color={batteryColor} />
              <Text style={[styles.batteryPct, { color: batteryColor }]}>{batteryPercent}%</Text>
              <Text style={styles.batteryStateLabel}>{chargingLabel[chargingState]}</Text>
            </View>

            {/* Bar */}
            <View style={styles.batteryBarWrap}>
              <View style={styles.batteryBarTrack}>
                <View
                  style={[
                    styles.batteryBarFill,
                    { width: `${batteryPercent}%` as any, backgroundColor: batteryColor },
                  ]}
                />
              </View>
              <View style={styles.batteryBarLabels}>
                <Text style={styles.batteryBarLabelLeft}>0%</Text>
                <Text style={styles.batteryBarLabelRight}>100%</Text>
              </View>
            </View>

            {/* Stats row */}
            <View style={styles.batteryStats}>
              {[
                { label: 'Est. Runtime', value: `${Math.round((batteryPercent / 100) * 8)}h` },
                { label: 'Voltage', value: '24.2 V' },
                { label: 'Temperature', value: '36°C' },
              ].map((s, i) => (
                <View key={i} style={styles.batteryStatItem}>
                  <Text style={styles.batteryStatValue}>{s.value}</Text>
                  <Text style={styles.batteryStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Simulate buttons */}
            <View style={styles.simRow}>
              <TouchableOpacity
                style={[styles.simBtn, { borderColor: Colors.green }]}
                onPress={simulateCharge}
                accessibilityLabel="Simulate charge"
              >
                <Ionicons name="add" size={14} color={Colors.green} />
                <Text style={[styles.simBtnText, { color: Colors.green }]}>Charge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.simBtn, { borderColor: Colors.orange }]}
                onPress={simulateDischarge}
                accessibilityLabel="Simulate discharge"
              >
                <Ionicons name="remove" size={14} color={Colors.orange} />
                <Text style={[styles.simBtnText, { color: Colors.orange }]}>Discharge</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Power Settings */}
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Power Settings</Text>
            {[
              {
                label: 'Auto Return to Dock',
                sub: 'When battery drops below 20%',
                value: autoReturnToDock,
                set: setAutoReturnToDock,
              },
              {
                label: 'Power Save Mode',
                sub: 'Reduce speed & sensors',
                value: powerSaveMode,
                set: setPowerSaveMode,
              },
            ].map((s, i) => (
              <View key={i} style={[styles.settingRow, i > 0 && styles.settingRowBorder]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                  <Text style={styles.settingSub}>{s.sub}</Text>
                </View>
                <Switch
                  value={s.value}
                  onValueChange={s.set}
                  trackColor={{ false: Colors.gray200, true: Colors.teal + '60' }}
                  thumbColor={s.value ? Colors.teal : Colors.gray300}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEyebrow: { fontSize: 12, color: Colors.textWhiteMuted, letterSpacing: 0.5 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, marginTop: 2 },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  controlBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  statusStrip: { flexDirection: 'row', gap: 8 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPillText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green },

  // Section
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.teal, fontWeight: '600' },

  // Map
  mapCard: {
    height: 200,
    backgroundColor: Colors.dark,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  mapGridH1: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridH2: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridV1: {
    position: 'absolute',
    left: '33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mapGridV2: {
    position: 'absolute',
    left: '66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  waypointPin: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -11,
    marginTop: -11,
  },
  robotPin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15,
    marginTop: -15,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: Colors.teal,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
  },
  mapDestBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,180,216,0.15)',
    borderWidth: 1,
    borderColor: Colors.teal + '50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mapDestText: { color: Colors.teal, fontSize: 11, fontWeight: '600' },
  trackingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  trackingBadgeActive: {
    backgroundColor: 'rgba(6,214,160,0.12)',
    borderColor: Colors.green + '50',
  },
  trackingText: { color: Colors.gray300, fontSize: 11, fontWeight: '600' },

  // Quick Actions — strict 2 rows × 3 columns
  quickGrid: {
    gap: 10,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 0, // gap on quickGrid handles spacing
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.backgroundCard,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  // Battery Card
  batteryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  batteryCircle: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 2,
  },
  batteryPct: { fontSize: 22, fontWeight: '800' },
  batteryStateLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  batteryBarWrap: { marginBottom: 16 },
  batteryBarTrack: {
    height: 10,
    backgroundColor: Colors.gray100,
    borderRadius: 5,
    overflow: 'hidden',
  },
  batteryBarFill: { height: '100%', borderRadius: 5 },
  batteryBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  batteryBarLabelLeft: { fontSize: 10, color: Colors.textMuted },
  batteryBarLabelRight: { fontSize: 10, color: Colors.textMuted },
  batteryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  batteryStatItem: { alignItems: 'center', gap: 3 },
  batteryStatValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  batteryStatLabel: { fontSize: 11, color: Colors.textMuted },
  simRow: { flexDirection: 'row', gap: 10 },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  simBtnText: { fontSize: 13, fontWeight: '700' },

  // Settings Card
  settingsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  settingRowBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  settingInfo: { flex: 1, paddingRight: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  settingSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  bottomPad: { height: 24 },
});
