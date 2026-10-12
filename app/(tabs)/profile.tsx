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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

interface MenuItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  hasArrow?: boolean;
}

const stats: StatItem[] = [
  { label: 'Appointments', value: '24', icon: 'calendar', color: Colors.teal },
  { label: 'Medications', value: '5', icon: 'medical', color: Colors.orange },
  { label: 'Days Tracked', value: '182', icon: 'heart', color: Colors.red },
  { label: 'Streak', value: '14d', icon: 'flame', color: Colors.green },
];

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Health Profile',
    items: [
      { id: 'personal', label: 'Personal Information', sublabel: 'Name, DOB, blood type', icon: 'person-outline', color: Colors.teal, hasArrow: true },
      { id: 'conditions', label: 'Medical Conditions', sublabel: 'Type 2 Diabetes, Hypertension', icon: 'bandage-outline', color: Colors.orange, hasArrow: true },
      { id: 'allergies', label: 'Allergies & Intolerances', sublabel: 'Penicillin, Latex', icon: 'warning-outline', color: Colors.red, hasArrow: true },
      { id: 'insurance', label: 'Insurance Details', sublabel: 'PolicyNo: HC-88291', icon: 'card-outline', color: Colors.primaryLight, hasArrow: true },
    ],
  },
  {
    title: 'Care Team',
    items: [
      { id: 'doctors', label: 'My Doctors', sublabel: '3 care providers', icon: 'people-outline', color: Colors.teal, hasArrow: true },
      { id: 'emergency-contact', label: 'Emergency Contact', sublabel: 'Rahim Mohamed · +91 98765 43210', icon: 'call-outline', color: Colors.red, hasArrow: true },
    ],
  },
  {
    title: 'Robot & Device Controls',
    items: [
      { id: 'robot-control', label: 'Robot Controller & Motion', sublabel: 'Manual steering & speed adjustment', icon: 'game-controller-outline', color: Colors.teal, hasArrow: true },
      { id: 'battery', label: 'Battery & Power Health', sublabel: '94% · Charging telemetry & protection', icon: 'battery-charging-outline', color: Colors.green, hasArrow: true },
      { id: 'location', label: 'Live Location & Floor Plan', sublabel: 'Level 2 indoor SLAM map view', icon: 'map-outline', color: Colors.primaryLight, hasArrow: true },
      { id: 'tasks', label: 'Healthcare Delivery Tasks', sublabel: 'Medicine & escort dispatches', icon: 'file-tray-full-outline', color: Colors.orange, hasArrow: true },
      { id: 'robot', label: 'CareBot AI Settings', sublabel: 'Device ID, Wi-Fi, motion limits', icon: 'hardware-chip-outline', color: Colors.tealDark, hasArrow: true },
      { id: 'notifications', label: 'Notification Settings', sublabel: 'Alerts, offline warnings', icon: 'notifications-outline', color: Colors.primaryLight, hasArrow: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help & FAQ', sublabel: 'Get support', icon: 'help-circle-outline', color: Colors.gray400, hasArrow: true },
      { id: 'about', label: 'About CareRobo', sublabel: 'Version 1.0.0', icon: 'information-circle-outline', color: Colors.gray400, hasArrow: true },
    ],
  },
];

export default function ProfileScreen() {
  const handleItemPress = (id: string) => {
    switch (id) {
      case 'robot-control':
        router.push('/robot-control');
        break;
      case 'battery':
        router.push('/battery-monitor');
        break;
      case 'location':
        router.push('/robot-location');
        break;
      case 'tasks':
        router.push('/robot-tasks');
        break;
      case 'robot':
        router.push('/robot-settings');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'emergency-contact':
        router.push('/emergency');
        break;
      default:
        break;
    }
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header + Avatar */}
        <LinearGradient
          colors={Colors.gradientHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>AM</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>Ansil Mohamed</Text>
          <Text style={styles.userMeta}>Patient ID: CRB-2024-0891</Text>
          <View style={styles.tagsRow}>
            {['Type 2 Diabetes', 'Hypertension'].map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.editBtn} accessibilityLabel="Edit profile">
            <Ionicons name="pencil-outline" size={15} color={Colors.white} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio info strip */}
        <View style={styles.bioStrip}>
          {[
            { label: 'Age', value: '38 yrs' },
            { label: 'Blood', value: 'O+' },
            { label: 'Height', value: '5\'10"' },
            { label: 'Weight', value: '74.2 kg' },
          ].map((item, idx) => (
            <View key={idx} style={[styles.bioItem, idx < 3 && styles.bioItemBorder]}>
              <Text style={styles.bioValue}>{item.value}</Text>
              <Text style={styles.bioLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item.id)}
                    accessibilityLabel={item.label}
                  >
                    <View style={[styles.menuItemIcon, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                      <Text style={styles.menuItemSublabel}>{item.sublabel}</Text>
                    </View>
                    {item.hasArrow && <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />}
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} accessibilityLabel="Sign out">
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.teal,
  },
  avatarInitials: { fontSize: 30, fontWeight: '800', color: Colors.white },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  userMeta: { fontSize: 12, color: Colors.textWhiteMuted, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tagText: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 5 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500', textAlign: 'center' },

  bioStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  bioItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  bioItemBorder: { borderRightWidth: 1, borderRightColor: Colors.gray100 },
  bioValue: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  bioLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 3 },

  menuSection: { marginTop: 20, paddingHorizontal: 16 },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuItemIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuItemText: { flex: 1 },
  menuItemLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  menuItemSublabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: Colors.gray100, marginLeft: 68 },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.redLight,
    borderWidth: 1.5,
    borderColor: Colors.red + '30',
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.red },
});
