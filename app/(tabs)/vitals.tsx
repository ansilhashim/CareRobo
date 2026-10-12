import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';


interface VitalReading {
  time: string;
  value: string;
}

interface VitalCard {
  id: string;
  label: string;
  current: string;
  unit: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  status: 'normal' | 'warning' | 'critical';
  statusLabel: string;
  range: string;
  trend: 'up' | 'down' | 'stable';
  history: VitalReading[];
}

const vitals: VitalCard[] = [
  {
    id: 'hr',
    label: 'Heart Rate',
    current: '72',
    unit: 'bpm',
    icon: 'heart',
    color: Colors.red,
    bg: Colors.redLight,
    status: 'normal',
    statusLabel: 'Normal',
    range: '60–100 bpm',
    trend: 'stable',
    history: [
      { time: '8 AM', value: '70' },
      { time: '10 AM', value: '74' },
      { time: '12 PM', value: '78' },
      { time: '2 PM', value: '72' },
      { time: '4 PM', value: '69' },
      { time: 'Now', value: '72' },
    ],
  },
  {
    id: 'bp',
    label: 'Blood Pressure',
    current: '118/78',
    unit: 'mmHg',
    icon: 'fitness',
    color: Colors.teal,
    bg: Colors.tealLight + '80',
    status: 'normal',
    statusLabel: 'Optimal',
    range: '<120/80 mmHg',
    trend: 'down',
    history: [
      { time: '8 AM', value: '122/82' },
      { time: '10 AM', value: '120/80' },
      { time: '12 PM', value: '118/78' },
      { time: '2 PM', value: '118/76' },
      { time: '4 PM', value: '119/78' },
      { time: 'Now', value: '118/78' },
    ],
  },
  {
    id: 'bs',
    label: 'Blood Sugar',
    current: '98',
    unit: 'mg/dL',
    icon: 'water',
    color: Colors.orange,
    bg: Colors.orangeLight,
    status: 'normal',
    statusLabel: 'Normal',
    range: '70–99 mg/dL (fasting)',
    trend: 'stable',
    history: [
      { time: '6 AM', value: '95' },
      { time: '8 AM', value: '110' },
      { time: '10 AM', value: '104' },
      { time: '12 PM', value: '122' },
      { time: '2 PM', value: '108' },
      { time: 'Now', value: '98' },
    ],
  },
  {
    id: 'spo2',
    label: 'SpO₂ (Oxygen)',
    current: '98',
    unit: '%',
    icon: 'pulse',
    color: Colors.green,
    bg: Colors.greenLight,
    status: 'normal',
    statusLabel: 'Excellent',
    range: '95–100 %',
    trend: 'stable',
    history: [
      { time: '8 AM', value: '97' },
      { time: '10 AM', value: '98' },
      { time: '12 PM', value: '98' },
      { time: '2 PM', value: '99' },
      { time: '4 PM', value: '98' },
      { time: 'Now', value: '98' },
    ],
  },
  {
    id: 'temp',
    label: 'Temperature',
    current: '98.4',
    unit: '°F',
    icon: 'thermometer',
    color: Colors.primaryLight,
    bg: Colors.gray100,
    status: 'normal',
    statusLabel: 'Normal',
    range: '97–99 °F',
    trend: 'stable',
    history: [
      { time: '8 AM', value: '98.2' },
      { time: '12 PM', value: '98.6' },
      { time: '4 PM', value: '98.4' },
      { time: 'Now', value: '98.4' },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    current: '74.2',
    unit: 'kg',
    icon: 'barbell',
    color: Colors.gray400,
    bg: Colors.gray100,
    status: 'normal',
    statusLabel: 'Healthy',
    range: 'BMI 22.4',
    trend: 'down',
    history: [
      { time: 'Mon', value: '74.8' },
      { time: 'Tue', value: '74.6' },
      { time: 'Wed', value: '74.5' },
      { time: 'Thu', value: '74.3' },
      { time: 'Fri', value: '74.2' },
      { time: 'Now', value: '74.2' },
    ],
  },
];

const trendIcon = (t: VitalCard['trend']): React.ComponentProps<typeof Ionicons>['name'] =>
  t === 'up' ? 'trending-up' : t === 'down' ? 'trending-down' : 'remove';

const trendColor = (t: VitalCard['trend'], status: VitalCard['status']) => {
  if (status === 'normal') return t === 'up' ? Colors.orange : t === 'down' ? Colors.green : Colors.gray300;
  return Colors.red;
};

export default function VitalsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={Colors.gradientPrimary as [string, string]} style={styles.header}>
        <Text style={styles.headerTitle}>Health Vitals</Text>
        <TouchableOpacity style={styles.addBtn} accessibilityLabel="Log new vital">
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
        <Text style={styles.summaryText}>All vitals within healthy range · Last updated just now</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {vitals.map((vital) => {
          const isExpanded = expanded === vital.id;
          return (
            <TouchableOpacity
              key={vital.id}
              style={styles.card}
              onPress={() => setExpanded(isExpanded ? null : vital.id)}
              activeOpacity={0.85}
              accessibilityLabel={`${vital.label}: ${vital.current} ${vital.unit}`}
            >
              {/* Main row */}
              <View style={styles.cardMain}>
                <View style={[styles.iconBg, { backgroundColor: vital.bg }]}>
                  <Ionicons name={vital.icon} size={22} color={vital.color} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.vitalLabel}>{vital.label}</Text>
                  <Text style={styles.vitalRange}>{vital.range}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.vitalValue}>{vital.current}</Text>
                  <Text style={styles.vitalUnit}>{vital.unit}</Text>
                  <View style={styles.trendRow}>
                    <Ionicons
                      name={trendIcon(vital.trend)}
                      size={14}
                      color={trendColor(vital.trend, vital.status)}
                    />
                    <View style={[styles.statusPill, { backgroundColor: vital.status === 'normal' ? Colors.greenLight : Colors.redLight }]}>
                      <Text style={[styles.statusPillText, { color: vital.status === 'normal' ? Colors.greenDark : Colors.red }]}>
                        {vital.statusLabel}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.gray300}
                  style={styles.chevron}
                />
              </View>

              {/* Expanded history */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <View style={styles.expandedDivider} />
                  <Text style={styles.historyTitle}>{"Today's Readings"}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                    {vital.history.map((h, idx) => (
                      <View key={idx} style={styles.historyItem}>
                        <Text style={styles.historyValue}>{h.value}</Text>
                        <Text style={styles.historyTime}>{h.time}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.viewHistoryBtn}
                    onPress={() => router.push('/vital-history')}
                    accessibilityLabel="View full history"
                  >
                    <Text style={styles.viewHistoryText}>View Full History</Text>
                    <Ionicons name="arrow-forward" size={14} color={Colors.teal} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  summaryText: { fontSize: 12, color: Colors.greenDark, fontWeight: '600', flex: 1 },

  list: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16, gap: 12 },

  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: { flex: 1 },
  vitalLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  vitalRange: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  vitalValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  vitalUnit: { fontSize: 11, color: Colors.textMuted },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  statusPillText: { fontSize: 10, fontWeight: '700' },
  chevron: { marginLeft: 4 },

  expandedSection: { marginTop: 4 },
  expandedDivider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 12 },
  historyTitle: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  historyScroll: { flexDirection: 'row' },
  historyItem: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 60,
  },
  historyValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  historyTime: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  viewHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.tealLight + '40',
  },
  viewHistoryText: { fontSize: 13, color: Colors.teal, fontWeight: '700' },
});
