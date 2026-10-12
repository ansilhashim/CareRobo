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

type FilterType = 'all' | 'upcoming' | 'past';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'in-person' | 'telehealth';
  notes?: string;
}

const appointments: Appointment[] = [
  {
    id: '1',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    hospital: 'City Medical Center',
    date: 'Today',
    time: '3:00 PM',
    status: 'confirmed',
    type: 'in-person',
    notes: 'Bring latest ECG reports',
  },
  {
    id: '2',
    doctor: 'Dr. Robert Chen',
    specialty: 'General Physician',
    hospital: 'HealthPlus Clinic',
    date: 'Tomorrow',
    time: '10:30 AM',
    status: 'confirmed',
    type: 'telehealth',
  },
  {
    id: '3',
    doctor: 'Dr. Priya Sharma',
    specialty: 'Endocrinologist',
    hospital: 'Apollo Hospital',
    date: 'Oct 18, 2026',
    time: '2:00 PM',
    status: 'pending',
    type: 'in-person',
    notes: 'Fasting blood test required',
  },
  {
    id: '4',
    doctor: 'Dr. Michael Torres',
    specialty: 'Ophthalmologist',
    hospital: 'Eye Care Institute',
    date: 'Sep 30, 2026',
    time: '11:00 AM',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: '5',
    doctor: 'Dr. Aisha Patel',
    specialty: 'Neurologist',
    hospital: 'Neuro Wellness Center',
    date: 'Sep 15, 2026',
    time: '4:30 PM',
    status: 'completed',
    type: 'telehealth',
  },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', color: Colors.teal, bg: Colors.tealLight + '60' },
  pending: { label: 'Pending', color: Colors.orange, bg: Colors.orangeLight },
  completed: { label: 'Completed', color: Colors.green, bg: Colors.greenLight },
  cancelled: { label: 'Cancelled', color: Colors.red, bg: Colors.redLight },
};

export default function AppointmentsScreen() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = appointments.filter((a) => {
    if (filter === 'upcoming') return a.status === 'confirmed' || a.status === 'pending';
    if (filter === 'past') return a.status === 'completed' || a.status === 'cancelled';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={Colors.gradientPrimary as [string, string]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.addBtn} accessibilityLabel="Add appointment">
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'upcoming', 'past'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
            accessibilityLabel={`Filter ${f}`}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color={Colors.gray200} />
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        )}
        {filtered.map((appt) => {
          const sc = statusConfig[appt.status];
          return (
            <TouchableOpacity
              key={appt.id}
              style={styles.card}
              onPress={() => router.push('/appointment-detail')}
              accessibilityLabel={`${appt.doctor} on ${appt.date}`}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person" size={22} color={Colors.teal} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.doctorName}>{appt.doctor}</Text>
                  <Text style={styles.specialty}>{appt.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Details row */}
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{appt.hospital}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.detailText}>{appt.date} · {appt.time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons
                    name={appt.type === 'telehealth' ? 'videocam-outline' : 'walk-outline'}
                    size={14}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.detailText}>
                    {appt.type === 'telehealth' ? 'Telehealth' : 'In-person'}
                  </Text>
                </View>
              </View>

              {appt.notes && (
                <View style={styles.notesRow}>
                  <Ionicons name="document-text-outline" size={13} color={Colors.orange} />
                  <Text style={styles.notesText}>{appt.notes}</Text>
                </View>
              )}

              {/* Actions */}
              {(appt.status === 'confirmed' || appt.status === 'pending') && (
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionSecondary} accessibilityLabel="Reschedule">
                    <Text style={styles.actionSecondaryText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionPrimary} accessibilityLabel="View details">
                    <Text style={styles.actionPrimaryText}>View Details</Text>
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

  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  filterTabActive: { backgroundColor: Colors.teal },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },

  list: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16, gap: 12 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted, fontWeight: '500' },

  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  doctorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.tealLight + '60',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.tealLight,
  },
  cardInfo: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  specialty: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 12 },

  cardDetails: { gap: 6 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: Colors.textSecondary },

  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: Colors.orangeLight,
    borderRadius: 8,
    padding: 8,
  },
  notesText: { fontSize: 12, color: Colors.orange, fontWeight: '500', flex: 1 },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionSecondary: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  actionSecondaryText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  actionPrimary: {
    flex: 1,
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  actionPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.white },
});
