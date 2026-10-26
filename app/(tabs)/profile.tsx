import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  route: string;
}

interface Doctor {
  id: string;
  name: string;
  role: string;
  hospital: string;
  phone: string;
}

type ModalType =
  | 'personal'
  | 'conditions'
  | 'allergies'
  | 'insurance'
  | 'doctors'
  | 'emergency-contact'
  | 'help'
  | 'about'
  | 'report'
  | null;

export default function ProfileScreen() {
  // ── Main Profile State ──────────────────────────────────────────
  const [profileName, setProfileName]           = useState('Ansil Mohamed');
  const [profilePatientId, setProfilePatientId] = useState('CRB-2024-0891');
  const [profileAge, setProfileAge]             = useState('38');
  const [profileBlood, setProfileBlood]         = useState('O+');
  const [profileHeight, setProfileHeight]       = useState("5'10\"");
  const [profileWeight, setProfileWeight]       = useState('74.2 kg');
  const [profilePhone, setProfilePhone]         = useState('+91 98765 43210');
  const [profileEmail, setProfileEmail]         = useState('ansil.m@carerobo.health');
  const [profileDob, setProfileDob]             = useState('14 Aug 1986');

  // ── Health Profile: Conditions & Allergies ──────────────────────
  const [conditions, setConditions] = useState<string[]>([
    'Type 2 Diabetes',
    'Hypertension',
  ]);
  const [newConditionText, setNewConditionText] = useState('');

  const [allergies, setAllergies] = useState<string[]>([
    'Penicillin',
    'Latex',
    'Shellfish',
  ]);
  const [newAllergyText, setNewAllergyText] = useState('');

  // ── Insurance Details ───────────────────────────────────────────
  const [insurance, setInsurance] = useState({
    provider: 'CareShield Health Pro',
    policyNo: 'HC-88291-B',
    groupNo: 'GRP-99201',
    validThru: '12/2028',
  });

  // ── Care Team: Doctors ──────────────────────────────────────────
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: '1', name: 'Dr. Sarah Smith', role: 'Chief Cardiologist', hospital: 'City Care Hospital', phone: '+91 98111 22334' },
    { id: '2', name: 'Dr. Rajiv Patel', role: 'Endocrinologist', hospital: 'Metro Specialty Clinic', phone: '+91 98222 33445' },
    { id: '3', name: 'Dr. Emily Chen', role: 'Primary Care Physician', hospital: 'Apex Health Center', phone: '+91 98333 44556' },
  ]);
  const [newDocName, setNewDocName]     = useState('');
  const [newDocRole, setNewDocRole]     = useState('');
  const [newDocPhone, setNewDocPhone]   = useState('');

  // ── Emergency Contact ───────────────────────────────────────────
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Rahim Mohamed',
    relation: 'Brother',
    phone: '+91 98765 43210',
  });

  // ── Active Modal & Draft States ─────────────────────────────────
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Draft states for forms
  const [draftName, setDraftName]           = useState(profileName);
  const [draftPatientId, setDraftPatientId] = useState(profilePatientId);
  const [draftAge, setDraftAge]             = useState(profileAge);
  const [draftBlood, setDraftBlood]         = useState(profileBlood);
  const [draftHeight, setDraftHeight]       = useState(profileHeight);
  const [draftWeight, setDraftWeight]       = useState(profileWeight);
  const [draftPhone, setDraftPhone]         = useState(profilePhone);
  const [draftEmail, setDraftEmail]         = useState(profileEmail);
  const [draftDob, setDraftDob]             = useState(profileDob);

  const [draftProvider, setDraftProvider]   = useState(insurance.provider);
  const [draftPolicyNo, setDraftPolicyNo]   = useState(insurance.policyNo);
  const [draftGroupNo, setDraftGroupNo]     = useState(insurance.groupNo);
  const [draftValidThru, setDraftValidThru] = useState(insurance.validThru);

  const [draftEmergName, setDraftEmergName]         = useState(emergencyContact.name);
  const [draftEmergRelation, setDraftEmergRelation] = useState(emergencyContact.relation);
  const [draftEmergPhone, setDraftEmergPhone]       = useState(emergencyContact.phone);

  const [selectedReportType, setSelectedReportType] = useState('full');
  const [faqExpanded, setFaqExpanded] = useState<number | null>(0);

  // ── Open Modals with Current Data ───────────────────────────────
  const openModal = (type: ModalType) => {
    if (type === 'personal') {
      setDraftName(profileName);
      setDraftPatientId(profilePatientId);
      setDraftAge(profileAge);
      setDraftBlood(profileBlood);
      setDraftHeight(profileHeight);
      setDraftWeight(profileWeight);
      setDraftPhone(profilePhone);
      setDraftEmail(profileEmail);
      setDraftDob(profileDob);
    } else if (type === 'insurance') {
      setDraftProvider(insurance.provider);
      setDraftPolicyNo(insurance.policyNo);
      setDraftGroupNo(insurance.groupNo);
      setDraftValidThru(insurance.validThru);
    } else if (type === 'emergency-contact') {
      setDraftEmergName(emergencyContact.name);
      setDraftEmergRelation(emergencyContact.relation);
      setDraftEmergPhone(emergencyContact.phone);
    }
    setActiveModal(type);
  };

  // ── Save Handlers ───────────────────────────────────────────────
  const savePersonalInfo = () => {
    setProfileName(draftName.trim() || 'Ansil Mohamed');
    setProfilePatientId(draftPatientId.trim() || 'CRB-2024-0891');
    setProfileAge(draftAge.trim() || '38');
    setProfileBlood(draftBlood.trim() || 'O+');
    setProfileHeight(draftHeight.trim() || "5'10\"");
    setProfileWeight(draftWeight.trim() || '74.2 kg');
    setProfilePhone(draftPhone.trim() || '+91 98765 43210');
    setProfileEmail(draftEmail.trim() || 'ansil.m@carerobo.health');
    setProfileDob(draftDob.trim() || '14 Aug 1986');
    setActiveModal(null);
    Alert.alert('Saved', 'Personal information updated successfully.');
  };

  const saveInsuranceInfo = () => {
    setInsurance({
      provider: draftProvider.trim() || 'CareShield Health Pro',
      policyNo: draftPolicyNo.trim() || 'HC-88291-B',
      groupNo: draftGroupNo.trim() || 'GRP-99201',
      validThru: draftValidThru.trim() || '12/2028',
    });
    setActiveModal(null);
    Alert.alert('Saved', 'Insurance details saved successfully.');
  };

  const saveEmergencyContact = () => {
    setEmergencyContact({
      name: draftEmergName.trim() || 'Rahim Mohamed',
      relation: draftEmergRelation.trim() || 'Brother',
      phone: draftEmergPhone.trim() || '+91 98765 43210',
    });
    setActiveModal(null);
    Alert.alert('Saved', 'Emergency contact updated successfully.');
  };

  const handleAddCondition = (customText?: string) => {
    const textToAdd = (customText || newConditionText).trim();
    if (!textToAdd) return;
    if (conditions.includes(textToAdd)) {
      Alert.alert('Already Added', 'This condition is already listed.');
      return;
    }
    setConditions((prev) => [...prev, textToAdd]);
    setNewConditionText('');
  };

  const handleRemoveCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (customText?: string) => {
    const textToAdd = (customText || newAllergyText).trim();
    if (!textToAdd) return;
    if (allergies.includes(textToAdd)) {
      Alert.alert('Already Added', 'This allergy is already recorded.');
      return;
    }
    setAllergies((prev) => [...prev, textToAdd]);
    setNewAllergyText('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDoctor = () => {
    if (!newDocName.trim() || !newDocRole.trim()) {
      Alert.alert('Incomplete Fields', 'Please enter both the Doctor Name and Specialty.');
      return;
    }
    const newDoc: Doctor = {
      id: Date.now().toString(),
      name: newDocName.trim(),
      role: newDocRole.trim(),
      hospital: 'Affiliated Hospital',
      phone: newDocPhone.trim() || '+91 98000 00000',
    };
    setDoctors((prev) => [...prev, newDoc]);
    setNewDocName('');
    setNewDocRole('');
    setNewDocPhone('');
  };

  const handleRemoveDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleDownloadReport = () => {
    setActiveModal(null);
    Alert.alert(
      'Generating Health Report',
      `Compiling ${selectedReportType.toUpperCase()} medical telemetry and robot interaction logs...`,
      [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              Alert.alert(
                'Report Downloaded',
                `CareRobo_${profileName.replace(/\s+/g, '_')}_HealthReport.pdf saved to Downloads.`
              );
            }, 600);
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from CareRobo? Active telemetry monitoring will remain paused.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Signed Out', 'You have been safely signed out.');
          },
        },
      ]
    );
  };

  // ── Navigation & Item Handler ───────────────────────────────────
  const handleItemPress = (id: string) => {
    switch (id) {
      case 'personal':
      case 'conditions':
      case 'allergies':
      case 'insurance':
      case 'doctors':
      case 'emergency-contact':
      case 'help':
      case 'about':
        openModal(id as ModalType);
        break;
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
      default:
        break;
    }
  };

  // ── Dynamic Menu Sections ───────────────────────────────────────
  const stats: StatItem[] = [
    { id: 'appts', label: 'Appointments', value: '24', icon: 'calendar', color: Colors.teal, route: '/(tabs)/appointments' },
    { id: 'meds', label: 'Medications', value: '5', icon: 'medical', color: Colors.orange, route: '/(tabs)/medications' },
    { id: 'vitals', label: 'Days Tracked', value: '182', icon: 'heart', color: Colors.red, route: '/(tabs)/vitals' },
    { id: 'streak', label: 'Streak', value: '14d', icon: 'flame', color: Colors.green, route: '/vital-history' },
  ];

  const menuSections = [
    {
      title: 'Health Profile',
      action: { label: 'Edit All', icon: 'pencil' as const, onPress: () => openModal('personal') },
      items: [
        {
          id: 'personal',
          label: 'Personal Information',
          sublabel: `${profileBlood} · ${profileAge} yrs · ${profileDob}`,
          icon: 'person-outline' as const,
          color: Colors.teal,
          editBadge: 'Edit',
        },
        {
          id: 'conditions',
          label: 'Medical Conditions',
          sublabel: conditions.length > 0 ? conditions.join(', ') : 'None listed (Tap to add)',
          icon: 'bandage-outline' as const,
          color: Colors.orange,
          editBadge: 'Edit',
        },
        {
          id: 'allergies',
          label: 'Allergies & Intolerances',
          sublabel: allergies.length > 0 ? allergies.join(', ') : 'None reported (Tap to add)',
          icon: 'warning-outline' as const,
          color: Colors.red,
          editBadge: 'Edit',
        },
        {
          id: 'insurance',
          label: 'Insurance Details',
          sublabel: `${insurance.provider} · #${insurance.policyNo}`,
          icon: 'card-outline' as const,
          color: Colors.primaryLight,
          editBadge: 'Edit',
        },
      ],
    },
    {
      title: 'Care Team',
      action: { label: 'Manage Team', icon: 'people' as const, onPress: () => openModal('doctors') },
      items: [
        {
          id: 'doctors',
          label: 'My Doctors',
          sublabel: `${doctors.length} providers · ${doctors[0]?.name || 'Manage'}`,
          icon: 'people-outline' as const,
          color: Colors.teal,
          editBadge: 'Manage',
        },
        {
          id: 'emergency-contact',
          label: 'Emergency Contact',
          sublabel: `${emergencyContact.name} (${emergencyContact.relation}) · ${emergencyContact.phone}`,
          icon: 'call-outline' as const,
          color: Colors.red,
          editBadge: 'Edit',
        },
      ],
    },
    {
      title: 'Robot & Device Controls',
      items: [
        {
          id: 'robot-control',
          label: 'Robot Controller & Motion',
          sublabel: 'Manual steering & speed adjustment',
          icon: 'game-controller-outline' as const,
          color: Colors.teal,
          hasArrow: true,
        },
        {
          id: 'battery',
          label: 'Battery & Power Health',
          sublabel: '94% · Charging telemetry & protection',
          icon: 'battery-charging-outline' as const,
          color: Colors.green,
          hasArrow: true,
        },
        {
          id: 'location',
          label: 'Live Location & Floor Plan',
          sublabel: 'Level 2 indoor SLAM map view',
          icon: 'map-outline' as const,
          color: Colors.primaryLight,
          hasArrow: true,
        },
        {
          id: 'tasks',
          label: 'Healthcare Delivery Tasks',
          sublabel: 'Medicine & escort dispatches',
          icon: 'file-tray-full-outline' as const,
          color: Colors.orange,
          hasArrow: true,
        },
        {
          id: 'robot',
          label: 'CareBot AI Settings',
          sublabel: 'Device ID, Wi-Fi, motion limits',
          icon: 'hardware-chip-outline' as const,
          color: Colors.tealDark,
          hasArrow: true,
        },
        {
          id: 'notifications',
          label: 'Notification Settings',
          sublabel: 'Alerts, offline warnings',
          icon: 'notifications-outline' as const,
          color: Colors.primaryLight,
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          label: 'Help & FAQ',
          sublabel: 'Care guides, robot troubleshooting, 24/7 hotline',
          icon: 'help-circle-outline' as const,
          color: Colors.gray400,
          hasArrow: true,
        },
        {
          id: 'about',
          label: 'About CareRobo',
          sublabel: 'Version 1.0.0 · CareOS v3.8.2-RT',
          icon: 'information-circle-outline' as const,
          color: Colors.gray400,
          hasArrow: true,
        },
      ],
    },
  ];

  // Calculate initials from name
  const initials = profileName
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CR';

  // ── Render Modal Content ────────────────────────────────────────
  const renderModalContent = () => {
    switch (activeModal) {
      case 'personal':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Update your primary identification and vitals data synced with CareRobo telemetry.
            </Text>

            {[
              { label: 'Full Name', value: draftName, setter: setDraftName, placeholder: 'e.g. Ansil Mohamed' },
              { label: 'Patient ID', value: draftPatientId, setter: setDraftPatientId, placeholder: 'e.g. CRB-2024-0891' },
              { label: 'Date of Birth', value: draftDob, setter: setDraftDob, placeholder: 'e.g. 14 Aug 1986' },
              { label: 'Age', value: draftAge, setter: setDraftAge, placeholder: 'e.g. 38' },
              { label: 'Blood Group', value: draftBlood, setter: setDraftBlood, placeholder: 'e.g. O+, A+, B+' },
              { label: 'Height', value: draftHeight, setter: setDraftHeight, placeholder: 'e.g. 5\'10"' },
              { label: 'Weight', value: draftWeight, setter: setDraftWeight, placeholder: 'e.g. 74.2 kg' },
              { label: 'Phone Number', value: draftPhone, setter: setDraftPhone, placeholder: 'e.g. +91 98765 43210' },
              { label: 'Email Address', value: draftEmail, setter: setDraftEmail, placeholder: 'e.g. user@carerobo.health' },
            ].map((field, i) => (
              <View key={i} style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.gray300}
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={savePersonalInfo}
              >
                <Ionicons name="checkmark-circle-outline" size={17} color={Colors.white} />
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'conditions':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              CareRobo monitors patient vitals and schedules activity dispatches in accordance with these conditions.
            </Text>

            <Text style={styles.modalFieldLabel}>Active Conditions</Text>
            <View style={styles.chipsContainer}>
              {conditions.map((item, index) => (
                <View key={index} style={styles.editableChip}>
                  <Ionicons name="bandage-outline" size={14} color={Colors.orange} />
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveCondition(index)}
                    style={styles.chipRemoveBtn}
                  >
                    <Ionicons name="close-circle" size={16} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              ))}
              {conditions.length === 0 && (
                <Text style={styles.emptyNotice}>No medical conditions currently listed.</Text>
              )}
            </View>

            <Text style={[styles.modalFieldLabel, { marginTop: 6 }]}>Quick Add Presets</Text>
            <View style={styles.presetsRow}>
              {['Type 2 Diabetes', 'Hypertension', 'Asthma', 'Cholesterol', 'Arthritis'].map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.presetChip}
                  onPress={() => handleAddCondition(p)}
                >
                  <Ionicons name="add" size={12} color={Colors.tealDark} />
                  <Text style={styles.presetChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>Add Custom Condition</Text>
            <View style={styles.addInputRow}>
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                placeholder="Type condition name..."
                placeholderTextColor={Colors.gray300}
                value={newConditionText}
                onChangeText={setNewConditionText}
                onSubmitEditing={() => handleAddCondition()}
              />
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddCondition()}>
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, { marginTop: 18 }]}
              onPress={() => {
                setActiveModal(null);
                Alert.alert('Saved', 'Medical conditions updated.');
              }}
            >
              <Ionicons name="checkmark" size={18} color={Colors.white} />
              <Text style={styles.modalSaveText}>Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'allergies':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Robot meal and medication delivery systems check items against this database to prevent severe reactions.
            </Text>

            <Text style={styles.modalFieldLabel}>Recorded Allergies</Text>
            <View style={styles.chipsContainer}>
              {allergies.map((item, index) => (
                <View key={index} style={[styles.editableChip, { borderColor: Colors.red + '40', backgroundColor: Colors.redLight }]}>
                  <Ionicons name="warning-outline" size={14} color={Colors.red} />
                  <Text style={[styles.chipText, { color: Colors.red }]}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveAllergy(index)}
                    style={styles.chipRemoveBtn}
                  >
                    <Ionicons name="close-circle" size={16} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              ))}
              {allergies.length === 0 && (
                <Text style={styles.emptyNotice}>No allergies reported.</Text>
              )}
            </View>

            <Text style={[styles.modalFieldLabel, { marginTop: 6 }]}>Quick Add Presets</Text>
            <View style={styles.presetsRow}>
              {['Penicillin', 'Latex', 'Shellfish', 'Peanuts', 'Aspirin', 'Sulfa'].map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.presetChip, { borderColor: Colors.red + '35' }]}
                  onPress={() => handleAddAllergy(p)}
                >
                  <Ionicons name="add" size={12} color={Colors.red} />
                  <Text style={[styles.presetChipText, { color: Colors.red }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>Add Custom Allergy</Text>
            <View style={styles.addInputRow}>
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                placeholder="Type allergy or intolerance..."
                placeholderTextColor={Colors.gray300}
                value={newAllergyText}
                onChangeText={setNewAllergyText}
                onSubmitEditing={() => handleAddAllergy()}
              />
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: Colors.red }]} onPress={() => handleAddAllergy()}>
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, { marginTop: 18 }]}
              onPress={() => {
                setActiveModal(null);
                Alert.alert('Saved', 'Allergies list updated.');
              }}
            >
              <Ionicons name="checkmark" size={18} color={Colors.white} />
              <Text style={styles.modalSaveText}>Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'insurance':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Healthcare insurance details are stored securely for automated telehealth billing and claims.
            </Text>

            {[
              { label: 'Insurance Provider', value: draftProvider, setter: setDraftProvider, placeholder: 'e.g. CareShield Pro' },
              { label: 'Policy Number', value: draftPolicyNo, setter: setDraftPolicyNo, placeholder: 'e.g. HC-88291-B' },
              { label: 'Group Number', value: draftGroupNo, setter: setDraftGroupNo, placeholder: 'e.g. GRP-99201' },
              { label: 'Valid Through', value: draftValidThru, setter: setDraftValidThru, placeholder: 'e.g. 12/2028' },
            ].map((field, i) => (
              <View key={i} style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.gray300}
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={saveInsuranceInfo}
              >
                <Ionicons name="checkmark" size={16} color={Colors.white} />
                <Text style={styles.modalSaveText}>Save Insurance</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'doctors':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Doctors linked to CareRobo receive critical telemetry alerts, abnormal ECG flags, and monthly progress logs.
            </Text>

            <Text style={styles.modalFieldLabel}>Care Providers</Text>
            {doctors.map((doc) => (
              <View key={doc.id} style={styles.doctorCard}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="medkit" size={18} color={Colors.teal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorName}>{doc.name}</Text>
                  <Text style={styles.doctorRole}>{doc.role} · {doc.hospital}</Text>
                  <Text style={styles.doctorPhone}>{doc.phone}</Text>
                </View>
                <View style={styles.doctorActions}>
                  <TouchableOpacity
                    style={styles.docCallBtn}
                    onPress={() => Alert.alert('Calling Doctor', `Dialing ${doc.name} (${doc.phone})...`)}
                  >
                    <Ionicons name="call" size={14} color={Colors.teal} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.docRemoveBtn}
                    onPress={() => handleRemoveDoctor(doc.id)}
                  >
                    <Ionicons name="trash-outline" size={14} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.addDoctorSection}>
              <Text style={styles.modalSubheading}>Add New Care Provider</Text>
              <TextInput
                style={[styles.modalInput, { marginBottom: 8 }]}
                placeholder="Doctor Name (e.g. Dr. John Doe)"
                placeholderTextColor={Colors.gray300}
                value={newDocName}
                onChangeText={setNewDocName}
              />
              <TextInput
                style={[styles.modalInput, { marginBottom: 8 }]}
                placeholder="Specialty (e.g. Neurologist, Dietitian)"
                placeholderTextColor={Colors.gray300}
                value={newDocRole}
                onChangeText={setNewDocRole}
              />
              <TextInput
                style={[styles.modalInput, { marginBottom: 10 }]}
                placeholder="Phone (e.g. +91 98111 22334)"
                placeholderTextColor={Colors.gray300}
                value={newDocPhone}
                onChangeText={setNewDocPhone}
              />
              <TouchableOpacity style={styles.addDoctorBtn} onPress={handleAddDoctor}>
                <Ionicons name="person-add-outline" size={16} color={Colors.white} />
                <Text style={styles.addDoctorBtnText}>Add to Care Team</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalSaveBtn, { marginTop: 14 }]}
              onPress={() => setActiveModal(null)}
            >
              <Ionicons name="checkmark" size={18} color={Colors.white} />
              <Text style={styles.modalSaveText}>Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'emergency-contact':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              CareRobo will automatically dial and dispatch emergency SOS broadcasts to this contact upon fall detection or telemetry anomalies.
            </Text>

            {[
              { label: 'Contact Name', value: draftEmergName, setter: setDraftEmergName, placeholder: 'e.g. Rahim Mohamed' },
              { label: 'Relationship', value: draftEmergRelation, setter: setDraftEmergRelation, placeholder: 'e.g. Brother, Daughter, Caregiver' },
              { label: 'Phone Number', value: draftEmergPhone, setter: setDraftEmergPhone, placeholder: 'e.g. +91 98765 43210' },
            ].map((field, i) => (
              <View key={i} style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.gray300}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.emergencyProtocolBtn}
              onPress={() => {
                setActiveModal(null);
                router.push('/emergency');
              }}
            >
              <Ionicons name="alert-circle-outline" size={18} color={Colors.red} />
              <Text style={styles.emergencyProtocolText}>Open Full Emergency Protocol Screen</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: Colors.red }]}
                onPress={saveEmergencyContact}
              >
                <Ionicons name="checkmark" size={16} color={Colors.white} />
                <Text style={styles.modalSaveText}>Save Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'help':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Frequently asked questions and direct assistance for your CareRobo health companion.
            </Text>

            {[
              {
                q: 'How do I connect CareRobo to Wi-Fi?',
                a: 'Navigate to "Robot & Device Controls" > "CareBot AI Settings" and choose Wi-Fi Configuration to select your 2.4GHz or 5GHz network.',
              },
              {
                q: 'How does automated medication delivery work?',
                a: 'CareRobo dispenses prescribed doses from its locked internal chamber right on schedule, navigating directly to the patient room.',
              },
              {
                q: 'What triggers an automatic Emergency SOS?',
                a: 'Sudden fall detection via 3D LiDAR, heart rate exceeding safe thresholds, or when the patient presses the manual red bumper button.',
              },
              {
                q: 'How do I recalibrate the indoor SLAM floor plan?',
                a: 'Go to the Live Location tab, place CareRobo at the charging dock, and select "Recalibrate Map" for an automated scan.',
              },
            ].map((faq, idx) => {
              const isOpen = faqExpanded === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.faqCard}
                  activeOpacity={0.8}
                  onPress={() => setFaqExpanded(isOpen ? null : idx)}
                >
                  <View style={styles.faqHeader}>
                    <Ionicons name="help-circle" size={18} color={Colors.teal} />
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={Colors.gray400}
                    />
                  </View>
                  {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.helplineBtn}
              onPress={() =>
                Alert.alert(
                  '24/7 Care Helpline',
                  'Connecting you to CareRobo Emergency Clinical Desk (+1-800-CARE-ROBO)...',
                  [{ text: 'Cancel', style: 'cancel' }, { text: 'Call Desk', onPress: () => {} }]
                )
              }
            >
              <Ionicons name="headset" size={18} color={Colors.white} />
              <Text style={styles.helplineBtnText}>Call 24/7 Clinical Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalSaveBtn, { marginTop: 12 }]}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalSaveText}>Close</Text>
            </TouchableOpacity>
          </View>
        );

      case 'about':
        return (
          <View style={styles.formContainer}>
            <View style={styles.aboutHeader}>
              <View style={styles.aboutLogoBg}>
                <Ionicons name="medical" size={28} color={Colors.white} />
              </View>
              <Text style={styles.aboutTitle}>CareRobo Health</Text>
              <Text style={styles.aboutSubtitle}>Autonomous Clinical Companion v1.0.0</Text>
            </View>

            <View style={styles.specCard}>
              {[
                { label: 'Firmware Engine', val: 'CareOS v3.8.2-RT' },
                { label: 'Hardware Spec', val: 'CareBot Pro 4WD (Rev 3.2)' },
                { label: 'Device Serial', val: 'CB-9942-881A' },
                { label: 'SLAM Navigation', val: 'LiDAR + Dual Depth v3.8' },
                { label: 'Telemetry Link', val: 'Encrypted (AES-256) · 28ms' },
                { label: 'Cloud Status', val: 'Connected & Healthy' },
              ].map((spec, i) => (
                <View key={i} style={[styles.specRow, i < 5 && styles.specBorder]}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.val}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.updateCheckBtn}
              onPress={() => Alert.alert('System Update', 'CareRobo Firmware is up to date (Version 3.8.2).')}
            >
              <Ionicons name="refresh-circle-outline" size={18} color={Colors.teal} />
              <Text style={styles.updateCheckText}>Check for Firmware Updates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalSaveBtn, { marginTop: 14 }]}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalSaveText}>Close</Text>
            </TouchableOpacity>
          </View>
        );

      case 'report':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionNotice}>
              Select the data sections to include in your verified medical PDF report.
            </Text>

            {[
              { id: 'full', title: 'Complete Health Record', desc: 'Vitals, medications, adherence history, robot dispatch logs' },
              { id: 'vitals', title: 'Vital Signs & ECG History', desc: 'Heart rate, blood pressure, oxygen saturation trends' },
              { id: 'meds', title: 'Medication Adherence Audit', desc: 'Dispensing logs, dosage times, missed alert records' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.reportOptionCard,
                  selectedReportType === option.id && styles.reportOptionCardActive,
                ]}
                onPress={() => setSelectedReportType(option.id)}
              >
                <Ionicons
                  name={selectedReportType === option.id ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selectedReportType === option.id ? Colors.teal : Colors.gray400}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportOptionTitle}>{option.title}</Text>
                  <Text style={styles.reportOptionDesc}>{option.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleDownloadReport}
              >
                <Ionicons name="download-outline" size={18} color={Colors.white} />
                <Text style={styles.modalSaveText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'personal': return 'Edit Personal Information';
      case 'conditions': return 'Manage Medical Conditions';
      case 'allergies': return 'Allergies & Intolerances';
      case 'insurance': return 'Insurance Details';
      case 'doctors': return 'Care Team & Doctors';
      case 'emergency-contact': return 'Emergency Contact';
      case 'help': return 'CareRobo Help & FAQ';
      case 'about': return 'About CareRobo System';
      case 'report': return 'Download Health Report';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header + Avatar Hero ─────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientHero as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.userName}>{profileName}</Text>
          <Text style={styles.userMeta}>Patient ID: {profilePatientId}</Text>

          {/* Condition Tags */}
          <View style={styles.tagsRow}>
            {conditions.map((tag, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tag}
                onPress={() => openModal('conditions')}
                accessibilityLabel={`Condition ${tag}`}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addTagBtn}
              onPress={() => openModal('conditions')}
              accessibilityLabel="Add condition"
            >
              <Ionicons name="add" size={14} color={Colors.white} />
              <Text style={styles.addTagText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Action Buttons */}
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => openModal('personal')}
              accessibilityLabel="Edit profile"
            >
              <Ionicons name="pencil-outline" size={15} color={Colors.white} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => openModal('report')}
              accessibilityLabel="Download health report"
            >
              <Ionicons name="download-outline" size={15} color={Colors.tealLight} />
              <Text style={styles.downloadBtnText}>Health Report</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Stats Row (All interactive) ───────────────────────── */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.statItem}
              onPress={() => router.push(stat.route as any)}
              accessibilityLabel={stat.label}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Bio Info Strip (Interactive to Edit) ──────────────── */}
        <TouchableOpacity
          style={styles.bioStrip}
          onPress={() => openModal('personal')}
          accessibilityLabel="Edit vitals and bio information"
          activeOpacity={0.85}
        >
          {[
            { label: 'Age', value: `${profileAge} yrs` },
            { label: 'Blood', value: profileBlood },
            { label: 'Height', value: profileHeight },
            { label: 'Weight', value: profileWeight },
          ].map((item, idx) => (
            <View key={idx} style={[styles.bioItem, idx < 3 && styles.bioItemBorder]}>
              <Text style={styles.bioValue}>{item.value}</Text>
              <Text style={styles.bioLabel}>{item.label}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* ── Menu Sections (Health Profile & Care Team have explicit Edit options) ─────────────────────── */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              {section.action && (
                <TouchableOpacity
                  style={styles.sectionHeaderBtn}
                  onPress={section.action.onPress}
                  accessibilityLabel={section.action.label}
                >
                  <Ionicons name={section.action.icon} size={12} color={Colors.tealDark} />
                  <Text style={styles.sectionHeaderBtnText}>{section.action.label}</Text>
                </TouchableOpacity>
              )}
            </View>

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
                      <Text style={styles.menuItemSublabel} numberOfLines={1}>{item.sublabel}</Text>
                    </View>

                    {/* Explicit Edit Option Badge */}
                    {item.editBadge ? (
                      <View style={styles.editPill}>
                        <Ionicons name="pencil" size={12} color={Colors.tealDark} />
                        <Text style={styles.editPillText}>{item.editBadge}</Text>
                      </View>
                    ) : (
                      item.hasArrow && <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
                    )}
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* ── Sign Out ─────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          accessibilityLabel="Sign out"
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* ── Unified Interactive Bottom-Sheet Modal ─────────────── */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          {/* Absolute Backdrop */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setActiveModal(null)}
          />

          <KeyboardAvoidingView
            style={styles.modalSheetContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                  <Text style={styles.modalHeaderSubtitle}>CareRobo Profile & Health System</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveModal(null)}
                  style={styles.modalCloseBtn}
                  accessibilityLabel="Close sheet"
                >
                  <Ionicons name="close" size={20} color={Colors.gray500} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderModalContent()}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
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
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tagText: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  addTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
  },
  addTagText: { fontSize: 12, color: Colors.white, fontWeight: '600' },

  heroActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  editBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(144,224,239,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(144,224,239,0.35)',
  },
  downloadBtnText: { color: Colors.tealLight, fontWeight: '700', fontSize: 13 },

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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.teal + '15',
  },
  sectionHeaderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.tealDark,
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

  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.teal + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.teal + '30',
  },
  editPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.tealDark,
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.redLight,
    borderWidth: 1.5,
    borderColor: Colors.red + '30',
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.red },

  // ── Unified Modal Styles ────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheetContainer: {
    width: '100%',
    maxHeight: '90%',
  },
  modalSheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    maxHeight: '100%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 18 },
      android: { elevation: 16 },
    }),
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gray200,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalHeaderSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  sectionNotice: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalField: {
    marginBottom: 12,
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1.2,
    borderColor: Colors.gray200,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: Colors.gray100,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.teal,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },

  // Chips & Presets
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  editableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.orangeLight + '40',
    borderWidth: 1,
    borderColor: Colors.orange + '40',
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chipRemoveBtn: {
    padding: 2,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.teal + '35',
    backgroundColor: Colors.teal + '08',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.tealDark,
  },
  emptyNotice: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Doctors
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.background,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  doctorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  doctorRole: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  doctorPhone: { fontSize: 11, color: Colors.tealDark, marginTop: 2, fontWeight: '600' },
  doctorActions: { flexDirection: 'row', gap: 6 },
  docCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docRemoveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.redLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDoctorSection: {
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  modalSubheading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  addDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.teal,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addDoctorBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },

  // Emergency Contact
  emergencyProtocolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: Colors.red + '40',
    marginVertical: 10,
  },
  emergencyProtocolText: {
    color: Colors.red,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },

  // FAQ
  faqCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  faqAnswer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
    paddingLeft: 26,
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.tealDark,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  helplineBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // About
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutLogoBg: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  aboutTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  aboutSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  specCard: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  specBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  specLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  specValue: { fontSize: 12, color: Colors.textPrimary, fontWeight: '700' },
  updateCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.teal + '50',
    backgroundColor: Colors.teal + '10',
    marginTop: 14,
  },
  updateCheckText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.tealDark,
  },

  // Report
  reportOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    marginBottom: 10,
  },
  reportOptionCardActive: {
    borderColor: Colors.teal,
    backgroundColor: Colors.teal + '08',
  },
  reportOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reportOptionDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
});
