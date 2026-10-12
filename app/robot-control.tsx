import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

type MovementStatus = 'Idle' | 'Moving Forward' | 'Moving Backward' | 'Turning Left' | 'Turning Right' | 'Paused' | 'Emergency Stop';
type HardwareMode = 'demo' | 'hardware';

export default function RobotControlScreen() {
  const [mode, setMode] = useState<HardwareMode>('demo');
  const [movement, setMovement] = useState<MovementStatus>('Idle');
  const [speed, setSpeed] = useState<number>(1.0); // m/s
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [eStopTriggered, setEStopTriggered] = useState<boolean>(false);
  const [lastCommandTime, setLastCommandTime] = useState<string>('Just now');
  const [batteryLevel] = useState<number>(94);

  // Auto-reset movement in demo mode after momentary action
  useEffect(() => {
    if (movement !== 'Idle' && movement !== 'Emergency Stop' && movement !== 'Paused') {
      const timer = setTimeout(() => {
        if (!eStopTriggered && !isPaused) {
          setMovement('Idle');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [movement, eStopTriggered, isPaused]);

  const handleDirection = (dir: 'Forward' | 'Backward' | 'Left' | 'Right') => {
    if (eStopTriggered) {
      Alert.alert(
        'Emergency Stop Active',
        'Please release the Emergency Stop latch before issuing movement commands.',
        [{ text: 'OK' }]
      );
      return;
    }
    if (isPaused) {
      Alert.alert(
        'Robot Paused',
        'Resume the robot to allow manual control commands.',
        [{ text: 'OK' }]
      );
      return;
    }

    const map: Record<string, MovementStatus> = {
      Forward: 'Moving Forward',
      Backward: 'Moving Backward',
      Left: 'Turning Left',
      Right: 'Turning Right',
    };
    setMovement(map[dir]);
    setLastCommandTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleStop = () => {
    if (eStopTriggered) return;
    setMovement('Idle');
    setLastCommandTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleTogglePause = () => {
    if (eStopTriggered) return;
    if (isPaused) {
      setIsPaused(false);
      setMovement('Idle');
    } else {
      setIsPaused(true);
      setMovement('Paused');
    }
  };

  const handleEmergencyStop = () => {
    if (!eStopTriggered) {
      setEStopTriggered(true);
      setMovement('Emergency Stop');
      Alert.alert(
        '🚨 EMERGENCY STOP ACTIVATED',
        'CareBot motor power cut immediately. All active navigation stopped.',
        [{ text: 'Acknowledged', style: 'destructive' }]
      );
    } else {
      // Release
      setEStopTriggered(false);
      setMovement('Idle');
      Alert.alert('E-Stop Released', 'CareBot systems re-engaged and in Standby.');
    }
  };

  const adjustSpeed = (delta: number) => {
    setSpeed((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      if (next < 0.5) return 0.5;
      if (next > 2.5) return 2.5;
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hardware vs Demo Mode Banner */}
        <View style={styles.modeCard}>
          <View style={styles.modeCardHeader}>
            <View style={styles.modeTitleRow}>
              <Ionicons
                name={mode === 'hardware' ? 'radio' : 'laptop-outline'}
                size={20}
                color={mode === 'hardware' ? Colors.green : Colors.teal}
              />
              <Text style={styles.modeTitle}>
                {mode === 'hardware' ? 'Real Hardware Mode' : 'Interactive Demo Mode'}
              </Text>
            </View>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modePill, mode === 'demo' && styles.modePillActive]}
                onPress={() => setMode('demo')}
              >
                <Text style={[styles.modePillText, mode === 'demo' && styles.modePillTextActive]}>
                  Demo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modePill, mode === 'hardware' && styles.modePillActiveHardware]}
                onPress={() => {
                  setMode('hardware');
                  Alert.alert(
                    'Real Hardware Standby',
                    'CareBot ROS2 WebSocket / BLE connection is searching for hardware on local subnet (192.168.1.145). Control commands will be dispatched over ROS2 cmd_vel.',
                    [{ text: 'Understood' }]
                  );
                }}
              >
                <Text
                  style={[
                    styles.modePillText,
                    mode === 'hardware' && styles.modePillTextActiveHardware,
                  ]}
                >
                  Hardware
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.modeDesc}>
            {mode === 'demo'
              ? 'Simulating CareBot motor controllers. Safe for UI testing without physical robot motion.'
              : 'Connected to CareBot ROS2 Controller. Real physical motors respond to inputs.'}
          </Text>
        </View>

        {/* Robot Telemetry & Status HUD */}
        <View style={styles.hudCard}>
          <View style={styles.hudTopRow}>
            <View style={styles.robotIdBadge}>
              <Ionicons name="hardware-chip" size={16} color={Colors.teal} />
              <Text style={styles.robotIdText}>CareBot Alpha-1 (CRB-9942)</Text>
            </View>
            <TouchableOpacity
              style={styles.batteryBadge}
              onPress={() => router.push('/battery-monitor')}
            >
              <Ionicons name="battery-charging" size={16} color={Colors.green} />
              <Text style={styles.batteryText}>{batteryLevel}%</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>CURRENT STATUS</Text>
            <View style={styles.statusIndicatorRow}>
              <View
                style={[
                  styles.statusDot,
                  eStopTriggered
                    ? styles.statusDotCritical
                    : movement !== 'Idle' && movement !== 'Paused'
                    ? styles.statusDotActive
                    : isPaused
                    ? styles.statusDotPaused
                    : styles.statusDotIdle,
                ]}
              />
              <Text
                style={[
                  styles.statusMainText,
                  eStopTriggered && { color: Colors.red },
                ]}
              >
                {movement}
              </Text>
            </View>
            <Text style={styles.statusMeta}>
              Speed: {speed} m/s · Last cmd: {lastCommandTime}
            </Text>
          </View>
        </View>

        {/* Directional D-Pad Controller */}
        <View style={styles.dpadSection}>
          <Text style={styles.sectionHeader}>Motion Controls</Text>

          <View style={styles.dpadContainer}>
            {/* Forward Button */}
            <TouchableOpacity
              style={[
                styles.dpadBtn,
                styles.dpadUp,
                movement === 'Moving Forward' && styles.dpadBtnActive,
              ]}
              onPress={() => handleDirection('Forward')}
              disabled={eStopTriggered}
              accessibilityLabel="Move Forward"
            >
              <Ionicons name="chevron-up" size={36} color={Colors.primary} />
            </TouchableOpacity>

            {/* Middle Row: Left, Center Stop, Right */}
            <View style={styles.dpadMiddleRow}>
              <TouchableOpacity
                style={[
                  styles.dpadBtn,
                  styles.dpadLeft,
                  movement === 'Turning Left' && styles.dpadBtnActive,
                ]}
                onPress={() => handleDirection('Left')}
                disabled={eStopTriggered}
                accessibilityLabel="Turn Left"
              >
                <Ionicons name="chevron-back" size={36} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dpadStopBtn,
                  movement === 'Idle' && styles.dpadStopBtnActive,
                ]}
                onPress={handleStop}
                disabled={eStopTriggered}
                accessibilityLabel="Stop Motion"
              >
                <Ionicons name="hand-right" size={26} color={Colors.white} />
                <Text style={styles.stopBtnText}>STOP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dpadBtn,
                  styles.dpadRight,
                  movement === 'Turning Right' && styles.dpadBtnActive,
                ]}
                onPress={() => handleDirection('Right')}
                disabled={eStopTriggered}
                accessibilityLabel="Turn Right"
              >
                <Ionicons name="chevron-forward" size={36} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Backward Button */}
            <TouchableOpacity
              style={[
                styles.dpadBtn,
                styles.dpadDown,
                movement === 'Moving Backward' && styles.dpadBtnActive,
              ]}
              onPress={() => handleDirection('Backward')}
              disabled={eStopTriggered}
              accessibilityLabel="Move Backward"
            >
              <Ionicons name="chevron-down" size={36} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Speed Adjustment Controls */}
        <View style={styles.speedCard}>
          <View style={styles.speedHeader}>
            <View style={styles.speedTitleRow}>
              <Ionicons name="speedometer-outline" size={20} color={Colors.teal} />
              <Text style={styles.speedTitle}>Linear Speed Velocity</Text>
            </View>
            <Text style={styles.speedValue}>{speed.toFixed(1)} m/s</Text>
          </View>

          <View style={styles.speedControlsRow}>
            <TouchableOpacity
              style={[styles.speedBtn, speed <= 0.5 && styles.speedBtnDisabled]}
              onPress={() => adjustSpeed(-0.2)}
              disabled={speed <= 0.5}
            >
              <Ionicons name="remove" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            {/* Speed Visual Indicator Bar */}
            <View style={styles.speedTrack}>
              <View
                style={[
                  styles.speedFill,
                  { width: `${((speed - 0.5) / 2.0) * 100}%` },
                ]}
              />
            </View>

            <TouchableOpacity
              style={[styles.speedBtn, speed >= 2.5 && styles.speedBtnDisabled]}
              onPress={() => adjustSpeed(0.2)}
              disabled={speed >= 2.5}
            >
              <Ionicons name="add" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.speedPresetsRow}>
            {[
              { label: 'Care (0.6)', val: 0.6 },
              { label: 'Normal (1.0)', val: 1.0 },
              { label: 'Rapid (1.8)', val: 1.8 },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.speedPresetPill,
                  Math.abs(speed - preset.val) < 0.1 && styles.speedPresetPillActive,
                ]}
                onPress={() => setSpeed(preset.val)}
              >
                <Text
                  style={[
                    styles.speedPresetText,
                    Math.abs(speed - preset.val) < 0.1 && styles.speedPresetTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Primary Operational Controls: Pause/Resume & EMERGENCY STOP */}
        <View style={styles.opsSection}>
          <TouchableOpacity
            style={[styles.pauseBtn, isPaused && styles.resumeBtn]}
            onPress={handleTogglePause}
            disabled={eStopTriggered}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={20}
              color={Colors.white}
            />
            <Text style={styles.pauseBtnText}>
              {isPaused ? 'Resume Robot' : 'Pause Routine'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.eStopBtn,
              eStopTriggered && styles.eStopBtnTriggered,
            ]}
            onPress={handleEmergencyStop}
            activeOpacity={0.8}
            accessibilityLabel="Emergency Stop"
          >
            <Ionicons
              name={eStopTriggered ? 'lock-closed' : 'warning'}
              size={24}
              color={Colors.white}
            />
            <Text style={styles.eStopBtnText}>
              {eStopTriggered ? 'RELEASE E-STOP LATCH' : 'EMERGENCY STOP (E-STOP)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Hub Navigation Bar */}
        <View style={styles.hubGrid}>
          <TouchableOpacity
            style={styles.hubCard}
            onPress={() => router.push('/robot-location')}
          >
            <View style={[styles.hubIconBg, { backgroundColor: Colors.teal + '20' }]}>
              <Ionicons name="map-outline" size={22} color={Colors.teal} />
            </View>
            <Text style={styles.hubTitle}>Live Map</Text>
            <Text style={styles.hubSubtitle}>GPS & Indoor Floor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hubCard}
            onPress={() => router.push('/robot-tasks')}
          >
            <View style={[styles.hubIconBg, { backgroundColor: Colors.green + '20' }]}>
              <Ionicons name="file-tray-full-outline" size={22} color={Colors.green} />
            </View>
            <Text style={styles.hubTitle}>Tasks</Text>
            <Text style={styles.hubSubtitle}>Delivery & Escorts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hubCard}
            onPress={() => router.push('/battery-monitor')}
          >
            <View style={[styles.hubIconBg, { backgroundColor: Colors.orange + '20' }]}>
              <Ionicons name="battery-charging-outline" size={22} color={Colors.orange} />
            </View>
            <Text style={styles.hubTitle}>Battery</Text>
            <Text style={styles.hubSubtitle}>{batteryLevel}% Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hubCard}
            onPress={() => router.push('/robot-settings')}
          >
            <View style={[styles.hubIconBg, { backgroundColor: Colors.primaryLight + '20' }]}>
              <Ionicons name="settings-outline" size={22} color={Colors.primaryLight} />
            </View>
            <Text style={styles.hubTitle}>Settings</Text>
            <Text style={styles.hubSubtitle}>Network & Speeds</Text>
          </TouchableOpacity>
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
  modeCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    padding: 2,
  },
  modePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  modePillActive: {
    backgroundColor: Colors.teal,
  },
  modePillActiveHardware: {
    backgroundColor: Colors.green,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray500,
  },
  modePillTextActive: {
    color: Colors.white,
  },
  modePillTextActiveHardware: {
    color: Colors.white,
  },
  modeDesc: {
    fontSize: 12,
    color: Colors.gray500,
    lineHeight: 16,
  },
  hudCard: {
    backgroundColor: Colors.dark,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  hudTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  robotIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  robotIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6,214,160,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
  },
  statusBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: Colors.gray400,
    fontWeight: '700',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDotIdle: { backgroundColor: Colors.teal },
  statusDotActive: { backgroundColor: Colors.green },
  statusDotPaused: { backgroundColor: Colors.orange },
  statusDotCritical: { backgroundColor: Colors.red },
  statusMainText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  statusMeta: {
    fontSize: 12,
    color: Colors.gray300,
  },
  dpadSection: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  dpadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
  },
  dpadBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dpadBtnActive: {
    backgroundColor: Colors.tealLight,
    borderColor: Colors.teal,
  },
  dpadUp: {
    marginBottom: 6,
  },
  dpadDown: {
    marginTop: 6,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dpadLeft: {},
  dpadRight: {},
  dpadStopBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: Colors.red,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dpadStopBtnActive: {
    backgroundColor: '#C1121F',
  },
  stopBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  speedCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 12,
  },
  speedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  speedValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.tealDark,
  },
  speedControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speedBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedBtnDisabled: {
    opacity: 0.4,
  },
  speedTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  speedFill: {
    height: '100%',
    backgroundColor: Colors.teal,
    borderRadius: 4,
  },
  speedPresetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  speedPresetPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignItems: 'center',
  },
  speedPresetPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  speedPresetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray600,
  },
  speedPresetTextActive: {
    color: Colors.white,
  },
  opsSection: {
    gap: 10,
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.darkSecondary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  resumeBtn: {
    backgroundColor: Colors.tealDark,
  },
  pauseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  eStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.red,
    paddingVertical: 16,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.red,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eStopBtnTriggered: {
    backgroundColor: '#8B0000',
    borderWidth: 2,
    borderColor: '#FFAAAA',
  },
  eStopBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hubCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 4,
  },
  hubIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  hubTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hubSubtitle: {
    fontSize: 11,
    color: Colors.gray500,
  },
});
