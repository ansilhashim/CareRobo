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
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  category: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  remaining: number;
  total: number;
  color: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active: boolean;
  takenToday: boolean[];
}

const medications: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    times: ['8:00 AM', '7:00 PM'],
    category: 'Antidiabetic',
    prescribedBy: 'Dr. Priya Sharma',
    startDate: 'Jan 15, 2026',
    instructions: 'Take with meals to reduce stomach upset',
    remaining: 24,
    total: 30,
    color: Colors.orange,
    icon: 'medical',
    active: true,
    takenToday: [true, false],
  },
  {
    id: '2',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once daily',
    times: ['8:00 AM'],
    category: 'Calcium Channel Blocker',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: 'Mar 01, 2026',
    instructions: 'Take at the same time each day',
    remaining: 18,
    total: 30,
    color: Colors.teal,
    icon: 'heart',
    active: true,
    takenToday: [true],
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '10 mg',
    frequency: 'Once daily (evening)',
    times: ['9:00 PM'],
    category: 'Statin',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: 'Feb 10, 2026',
    instructions: 'Take in the evening with or without food',
    remaining: 12,
    total: 30,
    color: Colors.primaryLight,
    icon: 'fitness',
    active: true,
    takenToday: [false],
  },
  {
    id: '4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    times: ['8:00 AM'],
    category: 'Supplement',
    prescribedBy: 'Dr. Robert Chen',
    startDate: 'Jun 01, 2026',
    instructions: 'Take with a fatty meal for best absorption',
    remaining: 45,
    total: 60,
    color: Colors.green,
    icon: 'sunny',
    active: true,
    takenToday: [true],
  },
  {
    id: '5',
    name: 'Aspirin',
    dosage: '81 mg',
    frequency: 'Once daily',
    times: ['8:00 AM'],
    category: 'Antiplatelet',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: 'Jan 15, 2026',
    endDate: 'Dec 31, 2026',
    instructions: 'Take with food or milk',
    remaining: 5,
    total: 30,
    color: Colors.red,
    icon: 'shield-checkmark',
    active: true,
    takenToday: [true],
  },
];

export default function MedicationsScreen() {
  const [medStates, setMedStates] = useState<Record<string, boolean[]>>(
    Object.fromEntries(medications.map((m) => [m.id, [...m.takenToday]]))
  );

  const toggleDose = (medId: string, idx: number) => {
    setMedStates((prev) => {
      const updated = [...prev[medId]];
      updated[idx] = !updated[idx];
      return { ...prev, [medId]: updated };
    });
  };

  const refillNeeded = medications.filter((m) => m.remaining <= 7);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={Colors.gradientPrimary as [string, string]} style={styles.header}>
        <Text style={styles.headerTitle}>Medications</Text>
        <TouchableOpacity style={styles.addBtn} accessibilityLabel="Add medication">
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Refill Alert */}
        {refillNeeded.length > 0 && (
          <View style={styles.refillAlert}>
            <Ionicons name="alert-circle" size={20} color={Colors.orange} />
            <Text style={styles.refillText}>
              Refill needed: {refillNeeded.map((m) => m.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Today's Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>{"Today's Adherence"}</Text>
          <View style={styles.progressRow}>
            {medications.map((med) => {
              const taken = medStates[med.id].filter(Boolean).length;
              const total = med.times.length;
              const pct = taken / total;
              return (
                <View key={med.id} style={styles.progressItem}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { height: `${pct * 100}%` as any, backgroundColor: med.color }]} />
                  </View>
                  <Text style={styles.progressName} numberOfLines={1}>{med.name.split(' ')[0]}</Text>
                  <Text style={styles.progressPct}>{Math.round(pct * 100)}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Medication Cards */}
        {medications.map((med) => {
          const takenCount = medStates[med.id].filter(Boolean).length;
          const refillPct = med.remaining / med.total;

          return (
            <View key={med.id} style={styles.card}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={[styles.medIconBg, { backgroundColor: med.color + '20' }]}>
                  <Ionicons name={med.icon} size={22} color={med.color} />
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medMeta}>{med.dosage} · {med.category}</Text>
                  <Text style={styles.medBy}>By {med.prescribedBy}</Text>
                </View>
                <View style={styles.cardHeaderRight}>
                  <View style={[
                    styles.doseCount,
                    { backgroundColor: takenCount === med.times.length ? Colors.greenLight : Colors.orangeLight }
                  ]}>
                    <Text style={[
                      styles.doseCountText,
                      { color: takenCount === med.times.length ? Colors.greenDark : Colors.orange }
                    ]}>
                      {takenCount}/{med.times.length}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Dose times */}
              <Text style={styles.sectionLabel}>Dose Schedule</Text>
              {med.times.map((time, idx) => (
                <View key={idx} style={styles.doseRow}>
                  <View style={styles.doseTimeRow}>
                    <Ionicons name="time-outline" size={15} color={Colors.textMuted} />
                    <Text style={styles.doseTime}>{time}</Text>
                  </View>
                  <View style={styles.doseToggleRow}>
                    <Text style={styles.doseToggleLabel}>
                      {medStates[med.id][idx] ? '✅ Taken' : '⬜ Not taken'}
                    </Text>
                    <Switch
                      value={medStates[med.id][idx]}
                      onValueChange={() => toggleDose(med.id, idx)}
                      trackColor={{ false: Colors.gray200, true: Colors.teal }}
                      thumbColor={Colors.white}
                      accessibilityLabel={`Mark ${med.name} ${time} as taken`}
                    />
                  </View>
                </View>
              ))}

              {/* Refill bar */}
              <View style={styles.refillRow}>
                <Text style={styles.sectionLabel}>Supply: {med.remaining} / {med.total} doses left</Text>
                <View style={styles.refillBar}>
                  <View
                    style={[
                      styles.refillBarFill,
                      {
                        width: `${(med.remaining / med.total) * 100}%` as any,
                        backgroundColor: refillPct <= 0.2 ? Colors.red : refillPct <= 0.4 ? Colors.orange : Colors.green,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Instructions */}
              <View style={styles.instructionsBox}>
                <Ionicons name="information-circle-outline" size={14} color={Colors.primaryLight} />
                <Text style={styles.instructionsText}>{med.instructions}</Text>
              </View>
            </View>
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

  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, gap: 12 },

  refillAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.orangeLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.orange + '40',
  },
  refillText: { flex: 1, fontSize: 13, color: Colors.orange, fontWeight: '600' },

  progressCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  progressTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 80 },
  progressItem: { alignItems: 'center', width: 44 },
  progressBarBg: {
    width: 18,
    height: 60,
    backgroundColor: Colors.gray100,
    borderRadius: 9,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  progressBarFill: { width: '100%', borderRadius: 9 },
  progressName: { fontSize: 9, color: Colors.textMuted, marginTop: 5, textAlign: 'center' },
  progressPct: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' },

  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  medIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  medMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  medBy: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  cardHeaderRight: { alignItems: 'flex-end' },
  doseCount: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  doseCountText: { fontSize: 12, fontWeight: '800' },

  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },

  doseRow: { marginBottom: 8 },
  doseTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  doseTime: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  doseToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  doseToggleLabel: { fontSize: 13, color: Colors.textSecondary },

  refillRow: { marginTop: 12 },
  refillBar: {
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  refillBarFill: { height: '100%', borderRadius: 3 },

  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  instructionsText: { fontSize: 12, color: Colors.textSecondary, flex: 1, lineHeight: 17 },
});
