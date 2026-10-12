import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

export default function AppointmentDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appointment Card */}
        <LinearGradient
          colors={Colors.gradientTeal as [string, string]}
          style={styles.apptCard}
        >
          <View style={styles.doctorRow}>
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={32} color={Colors.teal} />
            </View>
            <View>
              <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
              <Text style={styles.specialty}>Cardiologist, MD</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={14} color="#FFD700" />
                ))}
                <Text style={styles.ratingText}>4.9 (213 reviews)</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          {[
            { icon: 'calendar-outline', label: 'Date & Time', value: 'October 11, 2026 · 3:00 PM' },
            { icon: 'location-outline', label: 'Location', value: 'City Medical Center\nRoom 304, Building B' },
            { icon: 'walk-outline', label: 'Type', value: 'In-Person Visit' },
            { icon: 'person-outline', label: 'Referred By', value: 'Dr. Robert Chen' },
            { icon: 'document-text-outline', label: 'Notes', value: 'Bring latest ECG reports. Fast for 4 hours before the appointment.' },
          ].map((item, idx) => (
            <View key={idx} style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name={item.icon as any} size={18} color={Colors.teal} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* What to bring */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Bring</Text>
          {['Government ID', 'Insurance Card', 'Previous ECG Reports', 'List of Current Medications'].map((item, idx) => (
            <View key={idx} style={styles.checkItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.teal} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnSecondary} accessibilityLabel="Reschedule appointment">
            <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.btnSecondaryText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDanger} accessibilityLabel="Cancel appointment">
            <Ionicons name="close-circle-outline" size={18} color={Colors.red} />
            <Text style={styles.btnDangerText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnPrimary} accessibilityLabel="Get directions">
          <Ionicons name="navigate-outline" size={18} color={Colors.white} />
          <Text style={styles.btnPrimaryText}>Get Directions</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 20 },

  apptCard: {
    borderRadius: 20,
    padding: 20,
  },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  doctorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  doctorName: { fontSize: 20, fontWeight: '800', color: Colors.white },
  specialty: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  ratingText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginLeft: 4 },

  section: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    gap: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },

  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.tealLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', marginTop: 3, lineHeight: 20 },

  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkText: { fontSize: 14, color: Colors.textSecondary },

  actionsRow: { flexDirection: 'row', gap: 12 },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    ...Platform.select({ android: { elevation: 1 } }),
  },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  btnDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.redLight,
    borderWidth: 1.5,
    borderColor: Colors.red + '30',
  },
  btnDangerText: { fontSize: 14, fontWeight: '700', color: Colors.red },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
