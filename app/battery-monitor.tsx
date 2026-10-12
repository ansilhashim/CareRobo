import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

type ChargingState = 'charging' | 'discharging' | 'docked_full';

export default function BatteryMonitorScreen() {
  const [batteryPercent, setBatteryPercent] = useState<number>(88);
  const [chargingState, setChargingState] = useState<ChargingState>('charging');
  const [isRealHardwareTelemetry, setIsRealHardwareTelemetry] = useState<boolean>(false);

  // Settings
  const lowBatteryThreshold = 20;
  const criticalThreshold = 10;
  const [autoReturnToDock, setAutoReturnToDock] = useState<boolean>(true);
  const [soundChimeAlert, setSoundChimeAlert] = useState<boolean>(true);
  const [powerSaveMode, setPowerSaveMode] = useState<boolean>(false);

  const getStatusColor = () => {
    if (batteryPercent <= criticalThreshold) return Colors.red;
    if (batteryPercent <= lowBatteryThreshold) return Colors.orange;
    return Colors.green;
  };

  const getStatusBg = () => {
    if (batteryPercent <= criticalThreshold) return Colors.redLight;
    if (batteryPercent <= lowBatteryThreshold) return Colors.orangeLight;
    return Colors.greenLight;
  };

  const simulateDischarge = () => {
    setChargingState('discharging');
    setBatteryPercent((prev) => Math.max(8, prev - 15));
  };

  const simulateCharge = () => {
    setChargingState('charging');
    setBatteryPercent((prev) => Math.min(100, prev + 15));
  };

  const isLow = batteryPercent <= lowBatteryThreshold;
  const isCritical = batteryPercent <= criticalThreshold;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Real vs Demo Telemetry Notice */}
        <TouchableOpacity
          style={styles.noticeCard}
          onPress={() => setIsRealHardwareTelemetry((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isRealHardwareTelemetry ? 'checkmark-circle' : 'information-circle'}
            size={20}
            color={isRealHardwareTelemetry ? Colors.green : Colors.teal}
          />
          <View style={styles.noticeTextWrapper}>
            <Text style={styles.noticeTitle}>
              {isRealHardwareTelemetry
                ? 'Live BMS Hardware Telemetry Active'
                : 'Simulated Battery Management System (BMS)'}
            </Text>
            <Text style={styles.noticeDesc}>
              {isRealHardwareTelemetry
                ? 'Reading voltage cells & current draw via CAN bus battery sensor. Tap to toggle demo.'
                : 'Demo values active. Tap here to simulate real CAN bus hardware sensor pairing.'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Battery Main Visual Gauge */}
        <View style={styles.gaugeCard}>
          <View style={styles.gaugeHeader}>
            <View>
              <Text style={styles.robotLabel}>CareBot Power Cell · LiFePO4</Text>
              <Text style={styles.chargeStateText}>
                {chargingState === 'charging'
                  ? '⚡ Fast Charging on Dock'
                  : chargingState === 'docked_full'
                  ? '🔌 Fully Charged · Docked'
                  : '🔋 Discharging · In Service'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
                {isCritical ? 'CRITICAL' : isLow ? 'LOW' : 'HEALTHY'}
              </Text>
            </View>
          </View>

          <View style={styles.percentRow}>
            <Text style={[styles.percentNumber, { color: getStatusColor() }]}>
              {batteryPercent}%
            </Text>
            <Ionicons
              name={
                chargingState === 'charging'
                  ? 'battery-charging'
                  : batteryPercent > 70
                  ? 'battery-full'
                  : batteryPercent > 30
                  ? 'battery-half'
                  : 'battery-dead'
              }
              size={48}
              color={getStatusColor()}
            />
          </View>

          {/* Visual Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${batteryPercent}%`,
                  backgroundColor: getStatusColor(),
                },
              ]}
            />
          </View>

          {/* Low / Critical Alerts Banner */}
          {isCritical && (
            <View style={styles.criticalBanner}>
              <Ionicons name="alert-circle" size={20} color={Colors.red} />
              <Text style={styles.criticalText}>
                Critical Battery Alert: Under {criticalThreshold}%. CareBot is returning to docking bay immediately to prevent power loss.
              </Text>
            </View>
          )}

          {isLow && !isCritical && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={20} color={Colors.orange} />
              <Text style={styles.warningText}>
                Low Battery Notice: Under {lowBatteryThreshold}%. Schedule a return to dock soon.
              </Text>
            </View>
          )}
        </View>

        {/* Electrical & Diagnostic Telemetry */}
        <View style={styles.telemetryCard}>
          <Text style={styles.cardTitle}>Power Telemetry Details</Text>

          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Pack Voltage</Text>
              <Text style={styles.telemetryVal}>
                {isRealHardwareTelemetry ? '25.6 V' : '25.4 V (Est.)'}
              </Text>
              <Text style={styles.telemetrySub}>8S LiFePO4</Text>
            </View>

            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Estimated Runtime</Text>
              <Text style={styles.telemetryVal}>
                {Math.round((batteryPercent / 100) * 7.5)}h {Math.round(((batteryPercent % 15) / 15) * 60)}m
              </Text>
              <Text style={styles.telemetrySub}>Average discharge</Text>
            </View>

            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Cell Temp</Text>
              <Text style={styles.telemetryVal}>29.2 °C</Text>
              <Text style={styles.telemetrySub}>Optimal range</Text>
            </View>

            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Charge Cycles</Text>
              <Text style={styles.telemetryVal}>48</Text>
              <Text style={styles.telemetrySub}>98% Capacity</Text>
            </View>
          </View>
        </View>

        {/* Demo Simulation Trigger Controls */}
        <View style={styles.simCard}>
          <Text style={styles.cardTitle}>Simulation Tester Controls</Text>
          <Text style={styles.simDesc}>
            Test how the CareRobo app handles low battery thresholds and charging state changes:
          </Text>
          <View style={styles.simBtnsRow}>
            <TouchableOpacity style={styles.simBtn} onPress={simulateDischarge}>
              <Ionicons name="arrow-down" size={16} color={Colors.orange} />
              <Text style={styles.simBtnText}>Drain -15%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simBtn} onPress={simulateCharge}>
              <Ionicons name="arrow-up" size={16} color={Colors.green} />
              <Text style={styles.simBtnText}>Charge +15%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.simBtn}
              onPress={() => {
                setBatteryPercent(8);
                setChargingState('discharging');
              }}
            >
              <Ionicons name="flash-off" size={16} color={Colors.red} />
              <Text style={styles.simBtnText}>Test 8% Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Battery Management Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Battery Protection Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingLabel}>Auto-Return to Dock</Text>
              <Text style={styles.settingSub}>
                Automatically aborts non-emergency tasks when battery drops to {criticalThreshold}%
              </Text>
            </View>
            <Switch
              value={autoReturnToDock}
              onValueChange={setAutoReturnToDock}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingLabel}>Audible Low-Battery Chime</Text>
              <Text style={styles.settingSub}>
                CareBot emits sound alerts when battery drops below {lowBatteryThreshold}%
              </Text>
            </View>
            <Switch
              value={soundChimeAlert}
              onValueChange={setSoundChimeAlert}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingLabel}>Power Conservation Mode</Text>
              <Text style={styles.settingSub}>
                Dims robot ambient LEDs and reduces top speed to conserve 25% energy
              </Text>
            </View>
            <Switch
              value={powerSaveMode}
              onValueChange={setPowerSaveMode}
              trackColor={{ false: Colors.gray200, true: Colors.teal }}
            />
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
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  noticeTextWrapper: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  noticeDesc: {
    fontSize: 11,
    color: Colors.gray500,
    lineHeight: 16,
    marginTop: 2,
  },
  gaugeCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 14,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  robotLabel: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '600',
  },
  chargeStateText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  percentNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  progressTrack: {
    height: 14,
    backgroundColor: Colors.gray100,
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 7,
  },
  criticalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.redLight,
    padding: 12,
    borderRadius: 12,
  },
  criticalText: {
    flex: 1,
    fontSize: 12,
    color: Colors.red,
    fontWeight: '600',
    lineHeight: 16,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.orangeLight,
    padding: 12,
    borderRadius: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.orange,
    fontWeight: '600',
    lineHeight: 16,
  },
  telemetryCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  telemetryItem: {
    width: '48%',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
  },
  telemetryLabel: {
    fontSize: 11,
    color: Colors.gray500,
    fontWeight: '600',
  },
  telemetryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  telemetrySub: {
    fontSize: 11,
    color: Colors.gray400,
    marginTop: 2,
  },
  simCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 10,
  },
  simDesc: {
    fontSize: 12,
    color: Colors.gray500,
    lineHeight: 16,
  },
  simBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.lightGray,
    paddingVertical: 10,
    borderRadius: 10,
  },
  simBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  settingTextWrapper: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },
});
