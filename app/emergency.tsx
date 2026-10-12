import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const emergencyContacts: EmergencyContact[] = [
  { name: 'Rahim Mohamed', relation: 'Father', phone: '+91 98765 43210', icon: 'person' },
  { name: 'Fathima Banu', relation: 'Mother', phone: '+91 87654 32109', icon: 'person' },
  { name: 'Dr. Sarah Johnson', relation: 'Cardiologist', phone: '+91 77777 88888', icon: 'medical' },
];

const emergencyServices = [
  { label: 'Ambulance', number: '108', icon: 'medkit', color: Colors.red },
  { label: 'Police', number: '100', icon: 'shield', color: Colors.primaryLight },
  { label: 'Fire', number: '101', icon: 'flame', color: Colors.orange },
  { label: 'Hospital', number: '1800', icon: 'business', color: Colors.teal },
];

export default function EmergencyScreen() {
  const [sosSent, setSosSent] = useState(false);

  const handleSOS = () => {
    Vibration.vibrate([0, 200, 100, 200, 100, 400]);
    setSosSent(true);
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* SOS Button */}
        <LinearGradient
          colors={Colors.gradientRed as [string, string]}
          style={styles.sosSection}
        >
          <Text style={styles.sosTitle}>Emergency SOS</Text>
          <Text style={styles.sosSubtitle}>Press the button below to alert your emergency contacts and share your location</Text>

          <TouchableOpacity
            style={[styles.sosButton, sosSent && styles.sosSent]}
            onPress={handleSOS}
            accessibilityLabel="Send SOS alert"
          >
            <View style={styles.sosButtonInner}>
              <Ionicons name={sosSent ? 'checkmark' : 'warning'} size={40} color={sosSent ? Colors.green : Colors.red} />
              <Text style={[styles.sosButtonText, { color: sosSent ? Colors.green : Colors.red }]}>
                {sosSent ? 'ALERT SENT!' : 'SOS'}
              </Text>
            </View>
          </TouchableOpacity>

          {sosSent && (
            <View style={styles.sentBanner}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
              <Text style={styles.sentText}>Alert sent to all emergency contacts!</Text>
            </View>
          )}
        </LinearGradient>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="person-circle" size={20} color={Colors.red} />
            <Text style={styles.infoTitle}>Patient Information</Text>
            <Text style={styles.infoNote}>(shown to responders)</Text>
          </View>
          {[
            { label: 'Name', value: 'Ansil Mohamed' },
            { label: 'Age', value: '38 years' },
            { label: 'Blood Type', value: 'O+' },
            { label: 'Conditions', value: 'Type 2 Diabetes, Hypertension' },
            { label: 'Allergies', value: 'Penicillin, Latex' },
            { label: 'Current Meds', value: 'Metformin, Amlodipine, Atorvastatin' },
          ].map((item, idx) => (
            <View key={idx} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          <View style={styles.servicesGrid}>
            {emergencyServices.map((svc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.serviceCard, { borderColor: svc.color + '40' }]}
                accessibilityLabel={`Call ${svc.label} at ${svc.number}`}
              >
                <View style={[styles.serviceIcon, { backgroundColor: svc.color + '15' }]}>
                  <Ionicons name={svc.icon as any} size={24} color={svc.color} />
                </View>
                <Text style={styles.serviceLabel}>{svc.label}</Text>
                <Text style={[styles.serviceNumber, { color: svc.color }]}>{svc.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, idx) => (
            <View key={idx} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Ionicons name={contact.icon} size={20} color={Colors.red} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relation}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.callBtn}
                  accessibilityLabel={`Call ${contact.name}`}
                >
                  <Ionicons name="call" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Location sharing note */}
        <View style={styles.locationNote}>
          <Ionicons name="location" size={16} color={Colors.teal} />
          <Text style={styles.locationText}>
            In case of SOS, your current GPS location will be automatically shared with all emergency contacts.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },

  sosSection: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  sosTitle: { fontSize: 22, fontWeight: '900', color: Colors.white },
  sosSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 19 },

  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    ...Platform.select({
      ios: { shadowColor: Colors.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 16 },
      android: { elevation: 12 },
    }),
  },
  sosSent: { backgroundColor: Colors.greenLight },
  sosButtonInner: { alignItems: 'center', gap: 4 },
  sosButtonText: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },

  sentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sentText: { fontSize: 13, color: Colors.greenDark, fontWeight: '600' },

  infoCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.redLight,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  infoNote: { fontSize: 11, color: Colors.textMuted },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '500', flex: 0.4 },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', flex: 0.6, textAlign: 'right' },

  section: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceCard: {
    width: '47%',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    gap: 6,
  },
  serviceIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  serviceLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  serviceNumber: { fontSize: 18, fontWeight: '900' },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.redLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.red + '30',
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  contactRelation: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  contactPhone: { fontSize: 12, color: Colors.teal, fontWeight: '600', marginTop: 2 },
  contactActions: {},
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.tealLight + '40',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.teal + '30',
  },
  locationText: { flex: 1, fontSize: 12, color: Colors.tealDark, lineHeight: 18 },
});
