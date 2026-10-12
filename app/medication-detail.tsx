import React from 'react';
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
import Colors from '../constants/colors';

export default function MedicationDetailScreen() {
  const [remindersOn, setRemindersOn] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <LinearGradient
          colors={[Colors.orange, Colors.orangeLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.medIconBig}>
            <Ionicons name="medical" size={36} color={Colors.orange} />
          </View>
          <Text style={styles.medName}>Metformin</Text>
          <Text style={styles.medDosage}>500 mg · Antidiabetic</Text>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active Prescription</Text>
          </View>
        </LinearGradient>

        {/* Prescription info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription Info</Text>
          {[
            { icon: 'person-outline', label: 'Prescribed By', value: 'Dr. Priya Sharma' },
            { icon: 'calendar-outline', label: 'Start Date', value: 'January 15, 2026' },
            { icon: 'repeat-outline', label: 'Frequency', value: 'Twice daily (every 12 hours)' },
            { icon: 'time-outline', label: 'Schedule', value: '8:00 AM · 7:00 PM' },
            { icon: 'cube-outline', label: 'Form', value: 'Tablet (oral)' },
            { icon: 'flask-outline', label: 'Generic Name', value: 'Metformin Hydrochloride' },
          ].map((item, idx) => (
            <View key={idx} style={styles.detailRow}>
              <View style={styles.detailIconBg}>
                <Ionicons name={item.icon as any} size={17} color={Colors.orange} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={[styles.section, { gap: 10 }]}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {[
            '✅ Take with meals to reduce stomach upset',
            '💧 Drink plenty of water throughout the day',
            '⚠️ Do not skip doses — consistency is key',
            '🚫 Avoid excessive alcohol while on this medication',
            '📋 Monitor blood sugar levels regularly',
          ].map((instruction, idx) => (
            <Text key={idx} style={styles.instruction}>{instruction}</Text>
          ))}
        </View>

        {/* Side Effects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Possible Side Effects</Text>
          <View style={styles.sideEffectsRow}>
            {['Nausea', 'Diarrhea', 'Stomach pain', 'Metallic taste', 'Loss of appetite'].map((se, idx) => (
              <View key={idx} style={styles.sideEffectTag}>
                <Text style={styles.sideEffectText}>{se}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.sideEffectsNote}>
            Contact your doctor if side effects are severe or persistent.
          </Text>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <View style={styles.reminderHeader}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            <Switch
              value={remindersOn}
              onValueChange={setRemindersOn}
              trackColor={{ false: Colors.gray200, true: Colors.orange }}
              thumbColor={Colors.white}
              accessibilityLabel="Toggle medication reminders"
            />
          </View>
          <Text style={styles.reminderNote}>
            {remindersOn
              ? '🔔 You will receive reminders at 8:00 AM and 7:00 PM daily.'
              : '🔕 Reminders are off.'}
          </Text>
        </View>

        {/* Supply */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Supply</Text>
          <View style={styles.supplyRow}>
            <View style={styles.supplyInfo}>
              <Text style={styles.supplyCount}>24</Text>
              <Text style={styles.supplyLabel}>tablets left</Text>
            </View>
            <View style={styles.supplyBarContainer}>
              <View style={styles.supplyBar}>
                <View style={[styles.supplyBarFill, { width: '80%' }]} />
              </View>
              <Text style={styles.supplyPct}>80% remaining</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refillBtn} accessibilityLabel="Request refill">
            <Ionicons name="refresh-outline" size={16} color={Colors.orange} />
            <Text style={styles.refillBtnText}>Request Refill</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },

  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  medIconBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  medName: { fontSize: 24, fontWeight: '800', color: Colors.dark },
  medDosage: { fontSize: 14, color: Colors.gray400, fontWeight: '500' },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green },
  activeText: { fontSize: 12, color: Colors.greenDark, fontWeight: '700' },

  section: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },

  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', marginTop: 2 },

  instruction: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  sideEffectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sideEffectTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.orangeLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.orange + '40',
  },
  sideEffectText: { fontSize: 12, color: Colors.orange, fontWeight: '600' },
  sideEffectsNote: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },

  reminderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reminderNote: { fontSize: 13, color: Colors.textSecondary },

  supplyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  supplyInfo: { alignItems: 'center' },
  supplyCount: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  supplyLabel: { fontSize: 11, color: Colors.textMuted },
  supplyBarContainer: { flex: 1, gap: 6 },
  supplyBar: { height: 10, backgroundColor: Colors.gray100, borderRadius: 5, overflow: 'hidden' },
  supplyBarFill: { height: '100%', backgroundColor: Colors.orange, borderRadius: 5 },
  supplyPct: { fontSize: 12, color: Colors.textSecondary },
  refillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 11,
  },
  refillBtnText: { fontSize: 14, fontWeight: '700', color: Colors.orange },
});
