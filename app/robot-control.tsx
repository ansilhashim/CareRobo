import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/colors';

type MovementStatus = 'IDLE' | 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'PAUSED' | 'E-STOP';

// ── Radar Component ──────────────────────────────────────────────────────
function RadarDisplay({ movement, distance }: { movement: MovementStatus; distance: number }) {
  // useMemo avoids the react-hooks/refs lint error (no .current access during render)
  const sweepAnim = useMemo(() => new Animated.Value(0), []);
  const pingAnim  = useMemo(() => new Animated.Value(0), []);
  const sweepRotate = useMemo(
    () => sweepAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }),
    [sweepAnim]
  );

  useEffect(() => {
    Animated.loop(
      Animated.timing(sweepAnim, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [sweepAnim, pingAnim]);

  const statusColor =
    movement === 'E-STOP' ? Colors.red
    : movement === 'PAUSED' ? Colors.orange
    : movement === 'IDLE' ? Colors.teal
    : Colors.green;

  const statusLabel =
    movement === 'IDLE'     ? '● IDLE'
    : movement === 'FORWARD'  ? '▲ FWD'
    : movement === 'BACKWARD' ? '▼ REV'
    : movement === 'LEFT'     ? '◄ LEFT'
    : movement === 'RIGHT'    ? '► RIGHT'
    : movement === 'PAUSED'   ? '⏸ PAUSED'
    : '🚨 E-STOP';

  const pingBottom = Math.min(75, (distance / 400) * 75);

  return (
    <View style={radarS.wrap}>
      <Text style={[radarS.statusBadge, { color: statusColor }]}>{statusLabel}</Text>
      <View style={radarS.circle3} />
      <View style={radarS.circle2} />
      <View style={radarS.circle1} />
      <View style={radarS.crossH} />
      <View style={radarS.crossV} />
      <Animated.View style={[radarS.sweepWrap, { transform: [{ rotate: sweepRotate }] }]}>
        <View style={radarS.sweepArm} />
      </Animated.View>
      <Animated.View style={[radarS.ping, { opacity: pingAnim, bottom: `${pingBottom}%` as any }]} />
      <View style={[radarS.centerDot, { backgroundColor: statusColor }]} />
      <View style={radarS.distanceWrap}>
        <Text style={[radarS.distanceValue, { color: statusColor }]}>{distance}</Text>
        <Text style={radarS.distanceUnit}>cm</Text>
      </View>
      <Text style={[radarS.ringLabel, { bottom: '28%', right: '10%' }]}>100</Text>
      <Text style={[radarS.ringLabel, { bottom: '52%', right: '10%' }]}>200</Text>
      <Text style={[radarS.ringLabel, { bottom: '76%', right: '10%' }]}>300</Text>
    </View>
  );
}

const RADAR_SIZE = 170;

const radarS = StyleSheet.create({
  wrap: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: -22,
    alignSelf: 'center',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  circle3: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.22)',
  },
  circle2: {
    position: 'absolute',
    width: RADAR_SIZE * 0.66,
    height: RADAR_SIZE * 0.66,
    borderRadius: (RADAR_SIZE * 0.66) / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.32)',
  },
  circle1: {
    position: 'absolute',
    width: RADAR_SIZE * 0.34,
    height: RADAR_SIZE * 0.34,
    borderRadius: (RADAR_SIZE * 0.34) / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.5)',
  },
  crossH: { position: 'absolute', width: RADAR_SIZE, height: 1, backgroundColor: 'rgba(0,180,216,0.18)' },
  crossV: { position: 'absolute', width: 1, height: RADAR_SIZE, backgroundColor: 'rgba(0,180,216,0.18)' },
  sweepWrap: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepArm: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: RADAR_SIZE / 2,
    height: 2,
    backgroundColor: 'rgba(6,214,160,0.7)',
    borderRadius: 1,
  },
  ping: {
    position: 'absolute',
    left: '50%',
    marginLeft: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.teal,
  },
  centerDot: { position: 'absolute', width: 9, height: 9, borderRadius: 5 },
  distanceWrap: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  distanceValue: { fontSize: 16, fontWeight: '800' },
  distanceUnit: { fontSize: 9, color: Colors.gray300, fontWeight: '600' },
  ringLabel: { position: 'absolute', fontSize: 7, color: 'rgba(0,180,216,0.38)', fontWeight: '600' },
});

// ── D-Pad Component ──────────────────────────────────────────────────────
function DPad({ movement, onDir, disabled }: {
  movement: MovementStatus;
  onDir: (d: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT') => void;
  disabled: boolean;
}) {
  const btnColor = (active: boolean) => active ? Colors.teal : Colors.gray300;
  return (
    <View style={dpadS.wrap}>
      {/* Forward */}
      <View style={dpadS.row}>
        <TouchableOpacity
          style={[dpadS.btn, movement === 'FORWARD' && dpadS.active]}
          onPress={() => onDir('FORWARD')}
          disabled={disabled}
          accessibilityLabel="Forward"
        >
          <Ionicons name="chevron-up" size={26} color={btnColor(movement === 'FORWARD')} />
        </TouchableOpacity>
      </View>

      {/* Left · Hub · Right */}
      <View style={dpadS.midRow}>
        <TouchableOpacity
          style={[dpadS.btn, movement === 'LEFT' && dpadS.active]}
          onPress={() => onDir('LEFT')}
          disabled={disabled}
          accessibilityLabel="Left"
        >
          <Ionicons name="chevron-back" size={26} color={btnColor(movement === 'LEFT')} />
        </TouchableOpacity>

        <View style={dpadS.hub}>
          <View style={dpadS.hubDot} />
        </View>

        <TouchableOpacity
          style={[dpadS.btn, movement === 'RIGHT' && dpadS.active]}
          onPress={() => onDir('RIGHT')}
          disabled={disabled}
          accessibilityLabel="Right"
        >
          <Ionicons name="chevron-forward" size={26} color={btnColor(movement === 'RIGHT')} />
        </TouchableOpacity>
      </View>

      {/* Backward */}
      <View style={dpadS.row}>
        <TouchableOpacity
          style={[dpadS.btn, movement === 'BACKWARD' && dpadS.active]}
          onPress={() => onDir('BACKWARD')}
          disabled={disabled}
          accessibilityLabel="Backward"
        >
          <Ionicons name="chevron-down" size={26} color={btnColor(movement === 'BACKWARD')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const DPAD_BTN = 54;
const DPAD_HUB = 38;

const dpadS = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 5 },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DPAD_BTN * 3 + 5 * 2,
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  btn: {
    width: DPAD_BTN,
    height: DPAD_BTN,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: 'rgba(0,180,216,0.22)',
    borderColor: Colors.teal,
  },
  hub: {
    width: DPAD_HUB,
    height: DPAD_HUB,
    borderRadius: DPAD_HUB / 2,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(0,180,216,0.45)' },
});

// ── Action Buttons (gamepad face buttons) ────────────────────────────────
function ActionButtons({ onStop, onPause, onHorn, isPaused, eStop, onEStop }: {
  onStop: () => void;
  onPause: () => void;
  onHorn: () => void;
  isPaused: boolean;
  eStop: boolean;
  onEStop: () => void;
}) {
  return (
    <View style={abS.wrap}>
      {/* Y — Horn (top) */}
      <TouchableOpacity style={[abS.btn, abS.yellow]} onPress={onHorn} accessibilityLabel="Horn">
        <Text style={abS.letter}>Y</Text>
        <Text style={abS.sub}>HORN</Text>
      </TouchableOpacity>

      {/* X · B (middle row) */}
      <View style={abS.midRow}>
        <TouchableOpacity style={[abS.btn, abS.blue]} onPress={onStop} accessibilityLabel="Stop">
          <Text style={abS.letter}>X</Text>
          <Text style={abS.sub}>STOP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[abS.btn, eStop ? abS.eStopOn : abS.red]}
          onPress={onEStop}
          accessibilityLabel="Emergency Stop"
        >
          <Text style={abS.letter}>B</Text>
          <Text style={abS.sub}>{eStop ? 'RLSE' : 'SOS'}</Text>
        </TouchableOpacity>
      </View>

      {/* A — Pause / Resume (bottom) */}
      <TouchableOpacity
        style={[abS.btn, isPaused ? abS.resume : abS.green]}
        onPress={onPause}
        accessibilityLabel="Pause/Resume"
      >
        <Text style={abS.letter}>A</Text>
        <Text style={abS.sub}>{isPaused ? 'RESM' : 'PAUS'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const AB_BTN = 52;

const abS = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
  midRow: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  btn: {
    width: AB_BTN,
    height: AB_BTN,
    borderRadius: AB_BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  letter: { fontSize: 15, fontWeight: '900', color: Colors.white, lineHeight: 18 },
  sub: { fontSize: 7, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5, lineHeight: 9 },
  yellow:  { backgroundColor: '#B8960C' },
  blue:    { backgroundColor: Colors.primaryLight },
  red:     { backgroundColor: Colors.red },
  green:   { backgroundColor: Colors.greenDark },
  resume:  { backgroundColor: Colors.tealDark },
  eStopOn: { backgroundColor: '#7B0000', borderColor: '#FF6666' },
});

// ── Main Screen ──────────────────────────────────────────────────────────
export default function RobotControlScreen() {
  const [movement, setMovement] = useState<MovementStatus>('IDLE');
  const [isPaused, setIsPaused] = useState(false);
  const [eStop, setEStop]       = useState(false);
  const [speed, setSpeed]       = useState(1.0);
  const [distance, setDistance] = useState(114);
  const [batteryLevel]          = useState(94);
  const [latency]               = useState(20);

  // Lock to landscape
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // Auto reset to idle after 3 s
  useEffect(() => {
    if (!['IDLE', 'E-STOP', 'PAUSED'].includes(movement)) {
      const t = setTimeout(() => { if (!eStop && !isPaused) setMovement('IDLE'); }, 3000);
      return () => clearTimeout(t);
    }
  }, [movement, eStop, isPaused]);

  // Simulate sensor distance
  useEffect(() => {
    const t = setInterval(() => {
      setDistance((d) => Math.max(40, Math.min(350, d + Math.round((Math.random() - 0.48) * 12))));
    }, 800);
    return () => clearInterval(t);
  }, []);

  const handleDir = (dir: 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT') => {
    if (eStop)    { Alert.alert('E-Stop Active', 'Release E-Stop first.',   [{ text: 'OK' }]); return; }
    if (isPaused) { Alert.alert('Robot Paused',  'Resume before moving.',   [{ text: 'OK' }]); return; }
    setMovement(dir);
  };

  const handleStop  = () => { if (!eStop) setMovement('IDLE'); };

  const handlePause = () => {
    if (eStop) return;
    if (isPaused) { setIsPaused(false); setMovement('IDLE'); }
    else          { setIsPaused(true);  setMovement('PAUSED'); }
  };

  const handleEStop = () => {
    if (!eStop) {
      setEStop(true); setMovement('E-STOP');
      Alert.alert('🚨 E-STOP ACTIVATED', 'Motor power cut. All motion halted.', [{ text: 'Acknowledged', style: 'destructive' }]);
    } else {
      setEStop(false); setMovement('IDLE');
      Alert.alert('E-Stop Released', 'CareBot back in standby.');
    }
  };

  const handleHorn = () => Alert.alert('📢 Horn', 'Beep beep! Clearing path.', [{ text: 'OK' }]);

  const adjustSpeed = (delta: number) =>
    setSpeed((p) => Math.min(2.5, Math.max(0.5, Math.round((p + delta) * 10) / 10)));

  const speedPct = Math.round(((speed - 0.5) / 2.0) * 100);

  return (
    <View style={s.root}>
      <StatusBar hidden />

      {/* ── Top HUD Bar ─────────────────────────────────────────────── */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={14} color={Colors.gray300} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>

        <View style={s.topCenter}>
          <Text style={s.appTitle}>RoboCare Controller</Text>
          <Text style={s.appSub}>Manual drive mode · v2.1</Text>
        </View>

        <View style={s.pillRow}>
          <View style={[s.pill, { borderColor: Colors.green + '44' }]}>
            <View style={[s.dot, { backgroundColor: Colors.green }]} />
            <Text style={[s.pillTxt, { color: Colors.green }]}>Connected</Text>
          </View>

          <View style={s.pill}>
            <Ionicons name="timer-outline" size={9} color={Colors.gray300} style={{ marginRight: 2 }} />
            <Text style={s.pillTxt}>{latency} ms</Text>
          </View>

          <View style={s.pill}>
            <Text style={s.pillTxt}>
              Speed{' '}
              <Text style={[s.pillTxt, { color: Colors.teal, fontWeight: '800' }]}>{speed.toFixed(1)} m/s</Text>
            </Text>
          </View>

          <View style={s.pill}>
            <Text style={s.pillTxt}>
              Mode{' '}
              <Text style={[s.pillTxt, { color: Colors.orange, fontWeight: '800' }]}>Manual</Text>
            </Text>
          </View>

          <TouchableOpacity style={s.pill} onPress={() => router.push('/battery-monitor')}>
            <Ionicons name="battery-charging" size={11} color={Colors.green} />
            <Text style={[s.pillTxt, { color: Colors.green, fontWeight: '800', marginLeft: 3 }]}>{batteryLevel}%</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Controller Body ──────────────────────────────────────────── */}
      <View style={s.body}>

        {/* LEFT PANEL ─ D-Pad */}
        <View style={s.sidePanel}>
          <Text style={s.panelLabel}>MOVE</Text>
          <DPad movement={movement} onDir={handleDir} disabled={eStop || isPaused} />
        </View>

        {/* CENTER PANEL */}
        <View style={s.centerPanel}>

          {/* Sensor label + Radar */}
          <View style={s.radarSection}>
            <Text style={s.sensorLabel}>ULTRASONIC SENSOR</Text>
            {/* marginTop reserves space for the floating status badge */}
            <View style={s.radarWrapper}>
              <RadarDisplay movement={movement} distance={distance} />
            </View>
          </View>

          {/* Speed control */}
          <View style={s.speedSection}>
            <View style={s.speedHeader}>
              <Text style={s.speedLabel}>SPEED</Text>
              <Text style={s.speedValue}>{speed.toFixed(1)} m/s</Text>
              <Text style={s.speedPct}>{speedPct}%</Text>
            </View>
            <View style={s.sliderRow}>
              <TouchableOpacity onPress={() => adjustSpeed(-0.2)} style={s.sliderBtn} accessibilityLabel="Decrease speed">
                <Ionicons name="remove" size={14} color={Colors.gray300} />
              </TouchableOpacity>
              <View style={s.sliderTrack}>
                <View style={[s.sliderFill, { width: `${speedPct}%` as any }]} />
              </View>
              <TouchableOpacity onPress={() => adjustSpeed(0.2)} style={s.sliderBtn} accessibilityLabel="Increase speed">
                <Ionicons name="add" size={14} color={Colors.gray300} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick controls */}
          <View style={s.quickRow}>
            <TouchableOpacity
              style={[s.quickBtn, eStop && s.quickBtnRed]}
              onPress={handleEStop}
              accessibilityLabel="E-Stop toggle"
            >
              <Ionicons
                name={eStop ? 'warning' : 'stop-circle-outline'}
                size={13}
                color={eStop ? Colors.red : Colors.gray300}
              />
              <Text style={[s.quickTxt, eStop && { color: Colors.red }]}>
                {eStop ? 'RELEASE' : 'E-STOP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.quickBtn}
              onPress={() => Alert.alert('Mode', 'Toggle demo / hardware mode.')}
              accessibilityLabel="Mode"
            >
              <Ionicons name="swap-horizontal-outline" size={13} color={Colors.gray300} />
              <Text style={s.quickTxt}>MODE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.quickBtn} onPress={handleHorn} accessibilityLabel="Horn">
              <Ionicons name="megaphone-outline" size={13} color={Colors.gray300} />
              <Text style={s.quickTxt}>HORN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT PANEL ─ Action Buttons */}
        <View style={s.sidePanel}>
          <Text style={s.panelLabel}>ACTION</Text>
          <ActionButtons
            onStop={handleStop}
            onPause={handlePause}
            onHorn={handleHorn}
            isPaused={isPaused}
            eStop={eStop}
            onEStop={handleEStop}
          />
        </View>

      </View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050E1F' },

  // ── Top HUD bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,180,216,0.14)',
    gap: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  backText: { fontSize: 11, color: Colors.gray300, fontWeight: '600' },
  topCenter: { flex: 1, alignItems: 'center' },
  appTitle: { fontSize: 13, fontWeight: '800', color: Colors.white, letterSpacing: 0.4 },
  appSub: { fontSize: 9, color: Colors.gray300, letterSpacing: 0.2, marginTop: 1 },

  // Pill row
  pillRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flexShrink: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dot: { width: 5, height: 5, borderRadius: 3, marginRight: 4 },
  pillTxt: { fontSize: 9, color: Colors.gray300 },

  // ── Controller body
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  // Side panels
  sidePanel: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: 176,
  },
  panelLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray400,
    letterSpacing: 2.5,
  },

  // ── Center panel
  centerPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },

  // Radar section
  radarSection: {
    alignItems: 'center',
    gap: 4,
  },
  sensorLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(0,180,216,0.55)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  // Extra top margin so the absolute-positioned status badge doesn't clip
  radarWrapper: {
    marginTop: 22,
  },

  // ── Speed section
  speedSection: {
    width: '80%',
    gap: 5,
    alignItems: 'stretch',
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.gray400,
    letterSpacing: 2,
  },
  speedValue: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.teal,
  },
  speedPct: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.gray300,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.teal,
    borderRadius: 3,
  },
  sliderBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // ── Quick-control row
  quickRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickBtnRed: {
    backgroundColor: 'rgba(239,35,60,0.15)',
    borderColor: Colors.red,
  },
  quickTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.gray300,
    letterSpacing: 0.6,
  },
});
