import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';


interface HistoryEntry {
  date: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
}

const historyData: HistoryEntry[] = [
  { date: 'Today', value: '72 bpm', status: 'normal' },
  { date: 'Yesterday', value: '74 bpm', status: 'normal' },
  { date: 'Oct 9', value: '88 bpm', status: 'warning' },
  { date: 'Oct 8', value: '70 bpm', status: 'normal' },
  { date: 'Oct 7', value: '65 bpm', status: 'normal' },
  { date: 'Oct 6', value: '71 bpm', status: 'normal' },
  { date: 'Oct 5', value: '69 bpm', status: 'normal' },
  { date: 'Oct 4', value: '76 bpm', status: 'normal' },
  { date: 'Oct 3', value: '82 bpm', status: 'warning' },
  { date: 'Oct 2', value: '73 bpm', status: 'normal' },
  { date: 'Oct 1', value: '68 bpm', status: 'normal' },
  { date: 'Sep 30', value: '74 bpm', status: 'normal' },
];

const statusColors = {
  normal: Colors.green,
  warning: Colors.orange,
  critical: Colors.red,
};

const barHeights = [40, 45, 70, 38, 33, 42, 36, 48, 64, 44, 35, 44];

export default function VitalHistoryScreen() {
  const avg = '72 bpm';
  const min = '65 bpm';
  const max = '88 bpm';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <LinearGradient colors={Colors.gradientPrimary as [string, string]} style={styles.summaryCard}>
          <Text style={styles.vitalTitle}>Heart Rate</Text>
          <Text style={styles.currentValue}>72 <Text style={styles.currentUnit}>bpm</Text></Text>
          <Text style={styles.rangeText}>Normal range: 60–100 bpm</Text>

          <View style={styles.statsRow}>
            {[
              { label: 'Avg (30d)', value: avg },
              { label: 'Min', value: min },
              { label: 'Max', value: max },
            ].map((stat, idx) => (
              <View key={idx} style={[styles.statBox, idx < 2 && styles.statBoxBorder]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Last 12 Readings</Text>
          <View style={styles.chart}>
            {historyData.slice(0, 12).map((entry, idx) => (
              <View key={idx} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeights[idx],
                        backgroundColor: statusColors[entry.status],
                        opacity: idx === 0 ? 1 : 0.65 + idx * 0.02,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {entry.date.split(' ')[0].replace('Yesterday', 'Yest').replace('Today', 'Now')}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            {Object.entries(statusColors).map(([key, color]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading History</Text>
          {historyData.map((entry, idx) => (
            <View key={idx} style={styles.historyRow}>
              <View style={[styles.historyDot, { backgroundColor: statusColors[entry.status] }]} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
              <View style={[styles.historyValue, { backgroundColor: statusColors[entry.status] + '20' }]}>
                <Text style={[styles.historyValueText, { color: statusColors[entry.status] }]}>
                  {entry.value}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[entry.status] + '15' }]}>
                <Text style={[styles.statusText, { color: statusColors[entry.status] }]}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={[styles.section, { gap: 10 }]}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          {[
            '✅ Your heart rate has been consistently in the normal range this month.',
            '⚠️ Two slightly elevated readings detected — may be linked to physical activity.',
            '💡 Maintaining a regular sleep schedule can further stabilize your heart rate.',
            '📊 Overall trend: Stable with slight improvement over the past 2 weeks.',
          ].map((insight, idx) => (
            <View key={idx} style={styles.insightRow}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },

  summaryCard: {
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
  },
  vitalTitle: { fontSize: 13, color: Colors.textWhiteMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  currentValue: { fontSize: 52, fontWeight: '900', color: Colors.white, marginTop: 6 },
  currentUnit: { fontSize: 22, fontWeight: '400' },
  rangeText: { fontSize: 12, color: Colors.textWhiteMuted, marginBottom: 16 },
  statsRow: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statBoxBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 10, color: Colors.textWhiteMuted, marginTop: 3 },

  chartCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 4,
    marginTop: 14,
    marginBottom: 8,
  },
  barContainer: { flex: 1, alignItems: 'center', gap: 4 },
  barWrapper: { flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: '80%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
  chartLegend: { flexDirection: 'row', gap: 14, justifyContent: 'center', marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textSecondary },

  section: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },

  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  historyDot: { width: 8, height: 8, borderRadius: 4 },
  historyInfo: { flex: 1 },
  historyDate: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  historyValue: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  historyValueText: { fontSize: 12, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },

  insightRow: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 11,
  },
  insightText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
});
