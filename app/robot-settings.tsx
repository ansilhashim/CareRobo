import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

export default function RobotSettingsScreen() {
  // Device Identification
  const [robotName, setRobotName] = useState('CareBot Alpha-1');
  const [deviceId] = useState('CRB-ROBO-9942');
  const [firmwareVer] = useState('v2.4.1-rc3');

  // Network & Communication
  const [wifiSsid, setWifiSsid] = useState('CMC-Hospital-IoT-5G');
  const [robotIp, setRobotIp] = useState('192.168.1.145');
  const [bleEnabled, setBleEnabled] = useState(true);
  const [rosBridgeEnabled, setRosBridgeEnabled] = useState(true);

  // Motion & Speed Parameters
  const [defaultSpeed, setDefaultSpeed] = useState('1.0');
  const [maxSpeed, setMaxSpeed] = useState('2.0');
  const [collisionSafetyDistance, setCollisionSafetyDistance] = useState('0.5'); // meters

  // Battery Warning Thresholds
  const [lowBatteryWarning, setLowBatteryWarning] = useState('20');
  const [criticalDockThreshold, setCriticalDockThreshold] = useState('10');

  // Location & Navigation
  const [highPrecisionTracking, setHighPrecisionTracking] = useState(true);
  const [autoMapCalibration, setAutoMapCalibration] = useState(true);

  // Notification Preferences
  const [notifyObstacles, setNotifyObstacles] = useState(true);
  const [notifyLowBattery, setNotifyLowBattery] = useState(true);
  const [notifyTaskComplete, setNotifyTaskComplete] = useState(true);
  const [notifyOffline, setNotifyOffline] = useState(true);

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    Alert.alert(
      'Settings Saved',
      'CareBot parameters successfully updated and synced with robot onboard controller.',
      [{ text: 'OK' }]
    );
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Factory Defaults',
      'Are you sure you want to revert all robot parameters to factory defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Defaults',
          style: 'destructive',
          onPress: () => {
            setRobotName('CareBot Alpha-1');
            setWifiSsid('CMC-Hospital-IoT-5G');
            setRobotIp('192.168.1.145');
            setBleEnabled(true);
            setRosBridgeEnabled(true);
            setDefaultSpeed('1.0');
            setMaxSpeed('2.0');
            setCollisionSafetyDistance('0.5');
            setLowBatteryWarning('20');
            setCriticalDockThreshold('10');
            setHighPrecisionTracking(true);
            setAutoMapCalibration(true);
            setNotifyObstacles(true);
            setNotifyLowBattery(true);
            setNotifyTaskComplete(true);
            setNotifyOffline(true);
            Alert.alert('Reset Complete', 'Default values restored.');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Device Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Robot Hardware Profile</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Robot Unit Name</Text>
            <TextInput
              style={styles.textInput}
              value={robotName}
              onChangeText={setRobotName}
              placeholder="e.g. CareBot Alpha-1"
            />
          </View>

          <View style={styles.readOnlyRow}>
            <View style={styles.readOnlyCol}>
              <Text style={styles.readOnlyLabel}>Device ID</Text>
              <Text style={styles.readOnlyValue}>{deviceId}</Text>
            </View>
            <View style={styles.readOnlyCol}>
              <Text style={styles.readOnlyLabel}>Firmware Version</Text>
              <Text style={styles.readOnlyValue}>{firmwareVer}</Text>
            </View>
          </View>
        </View>

        {/* Network & Communication */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Communication & Network</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Wi-Fi Network (SSID)</Text>
            <TextInput
              style={styles.textInput}
              value={wifiSsid}
              onChangeText={setWifiSsid}
              placeholder="Hospital Wi-Fi SSID"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Static IP Address / Host</Text>
            <TextInput
              style={styles.textInput}
              value={robotIp}
              onChangeText={setRobotIp}
              placeholder="192.168.1.145"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Bluetooth LE Telemetry</Text>
              <Text style={styles.toggleSub}>Direct smartphone BLE beacon pairing</Text>
            </View>
            <Switch
              value={bleEnabled}
              onValueChange={setBleEnabled}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>ROS2 WebSocket Bridge</Text>
              <Text style={styles.toggleSub}>Real-time topic pub/sub on port 9090</Text>
            </View>
            <Switch
              value={rosBridgeEnabled}
              onValueChange={setRosBridgeEnabled}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>
        </View>

        {/* Speed & Motion Parameters */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Movement & Velocity Limits</Text>

          <View style={styles.speedInputsRow}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Default Speed (m/s)</Text>
              <TextInput
                style={styles.textInput}
                value={defaultSpeed}
                onChangeText={setDefaultSpeed}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Max Speed Cap (m/s)</Text>
              <TextInput
                style={styles.textInput}
                value={maxSpeed}
                onChangeText={setMaxSpeed}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Obstacle Detection Margin (meters)</Text>
            <TextInput
              style={styles.textInput}
              value={collisionSafetyDistance}
              onChangeText={setCollisionSafetyDistance}
              keyboardType="numeric"
            />
            <Text style={styles.fieldHelper}>
              Robot decelerates automatically when obstacles are detected within this radius.
            </Text>
          </View>
        </View>

        {/* Battery Thresholds */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Battery Warning Thresholds</Text>

          <View style={styles.speedInputsRow}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Low Battery Alert (%)</Text>
              <TextInput
                style={styles.textInput}
                value={lowBatteryWarning}
                onChangeText={setLowBatteryWarning}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Auto-Dock Cutoff (%)</Text>
              <TextInput
                style={styles.textInput}
                value={criticalDockThreshold}
                onChangeText={setCriticalDockThreshold}
                keyboardType="numeric"
              />
            </View>
          </View>
          <Text style={styles.fieldHelper}>
            When power drops below {criticalDockThreshold}%, robot will suspend tasks and navigate directly to charging cradle.
          </Text>
        </View>

        {/* Location & Tracking Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Location Tracking</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>High-Precision UWB Tracking</Text>
              <Text style={styles.toggleSub}>50Hz ultra-wideband beacon updates</Text>
            </View>
            <Switch
              value={highPrecisionTracking}
              onValueChange={setHighPrecisionTracking}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Automatic Map Re-alignment</Text>
              <Text style={styles.toggleSub}>Aligns SLAM coordinate frame at docking</Text>
            </View>
            <Switch
              value={autoMapCalibration}
              onValueChange={setAutoMapCalibration}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Alert Notifications</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Robot Offline / Disconnected</Text>
              <Text style={styles.toggleSub}>Instant push alert if ping lost for &gt; 30s</Text>
            </View>
            <Switch
              value={notifyOffline}
              onValueChange={setNotifyOffline}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Low & Critical Battery Warnings</Text>
              <Text style={styles.toggleSub}>Alert on battery threshold breaches</Text>
            </View>
            <Switch
              value={notifyLowBattery}
              onValueChange={setNotifyLowBattery}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Delivery Task Completions</Text>
              <Text style={styles.toggleSub}>Notifies upon successful medicine drop-off</Text>
            </View>
            <Switch
              value={notifyTaskComplete}
              onValueChange={setNotifyTaskComplete}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Obstacle & Collision Alerts</Text>
              <Text style={styles.toggleSub}>Audio-visual warning when path is obstructed</Text>
            </View>
            <Switch
              value={notifyObstacles}
              onValueChange={setNotifyObstacles}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>
        </View>

        {/* Save / Reset / Cancel Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
            <Text style={styles.saveBtnText}>
              {savedFeedback ? 'Settings Saved ✓' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh-outline" size={16} color={Colors.red} />
              <Text style={styles.resetBtnText}>Reset Defaults</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 12,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  fieldHelper: {
    fontSize: 11,
    color: Colors.gray400,
    lineHeight: 15,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  readOnlyRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  readOnlyCol: {
    flex: 1,
  },
  readOnlyLabel: {
    fontSize: 11,
    color: Colors.gray400,
    fontWeight: '600',
  },
  readOnlyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },
  speedInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
    gap: 6,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.tealDark,
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.redLight,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.red,
  },
});
