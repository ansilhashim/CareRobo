import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

interface Waypoint {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  type: 'room' | 'dock' | 'pharmacy' | 'nurse';
}

const facilityWaypoints: Waypoint[] = [
  { id: 'dock', name: 'Dock Station', x: 15, y: 80, type: 'dock' },
  { id: 'pharmacy', name: 'Pharmacy', x: 20, y: 25, type: 'pharmacy' },
  { id: 'nurse', name: 'Nurse Station', x: 50, y: 50, type: 'nurse' },
  { id: 'room101', name: 'Room 101', x: 80, y: 25, type: 'room' },
  { id: 'room102', name: 'Room 102 (Ansil)', x: 82, y: 75, type: 'room' },
];

export default function RobotLocationScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gpsAvailable, setGpsAvailable] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('14s ago');
  const [robotPos, setRobotPos] = useState({ x: 58, y: 56 }); // near nurse station
  const [targetDestination, setTargetDestination] = useState<string>('Room 102 (Ansil)');
  const [trackingActive, setTrackingActive] = useState(true);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate('Just now');
      // small simulated position jitter
      setRobotPos((prev) => ({
        x: Math.min(85, Math.max(15, prev.x + (Math.random() * 4 - 2))),
        y: Math.min(85, Math.max(20, prev.y + (Math.random() * 4 - 2))),
      }));
    }, 800);
  };

  const handleLocate = () => {
    // Center focus on robot
    setLastUpdate('Locating...');
    setTimeout(() => {
      setLastUpdate('Centered');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* GPS Hardware Telemetry Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusRow}>
            <View style={[styles.dot, gpsAvailable ? styles.dotGreen : styles.dotOrange]} />
            <Text style={styles.statusTitle}>
              {gpsAvailable
                ? 'Indoor UWB SLAM + Assisted GPS Active'
                : 'Satellite GPS Unavailable (Indoor SLAM Fallback)'}
            </Text>
          </View>
          <Text style={styles.statusSubtitle}>
            {gpsAvailable
              ? 'Multi-sensor fusion: LiDAR odometry + Ultra-Wideband beacons provide sub-meter indoor precision.'
              : 'Direct satellite line-of-sight blocked by hospital structure. Using floorplan beacons.'}
          </Text>
          <TouchableOpacity
            style={styles.toggleGpsBtn}
            onPress={() => setGpsAvailable((prev) => !prev)}
          >
            <Text style={styles.toggleGpsText}>
              Toggle GPS Status (Simulate {gpsAvailable ? 'No Satellite' : 'Satellite Connected'})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Hospital Floor Map */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.mapTitle}>Facility Live Floor Plan</Text>
              <Text style={styles.mapSub}>City Medical Center · Level 2 Ward</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                style={[styles.locateBtn, { backgroundColor: trackingActive ? Colors.tealDark : Colors.gray400 }]}
                onPress={() => setTrackingActive((prev) => !prev)}
                accessibilityLabel="Toggle Route Tracking"
              >
                <Ionicons name="trail-sign-outline" size={15} color={Colors.white} />
                <Text style={styles.locateBtnText}>{trackingActive ? 'Route On' : 'Route Off'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locateBtn}
                onPress={handleLocate}
                accessibilityLabel="Locate Robot"
              >
                <Ionicons name="locate" size={15} color={Colors.white} />
                <Text style={styles.locateBtnText}>Locate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Map Canvas Visual Area */}
          <View style={styles.canvasArea}>
            {/* Grid Lines */}
            <View style={styles.gridOverlay} />

            {/* Waypoint / Route Trail Lines */}
            {trackingActive && (
              <View style={styles.routeTrailContainer}>
                {/* Simulated breadcrumb dots showing traveled path */}
                {[
                  { x: 22, y: 75 },
                  { x: 35, y: 65 },
                  { x: 45, y: 55 },
                  { x: 52, y: 54 },
                ].map((crumb, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.breadcrumb,
                      { left: `${crumb.x}%`, top: `${crumb.y}%` },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Landmarks / Rooms */}
            {facilityWaypoints.map((wp) => (
              <View
                key={wp.id}
                style={[
                  styles.landmarkPin,
                  { left: `${wp.x}%`, top: `${wp.y}%` },
                ]}
              >
                <View
                  style={[
                    styles.landmarkIcon,
                    wp.type === 'dock'
                      ? styles.iconDock
                      : wp.type === 'pharmacy'
                      ? styles.iconPharmacy
                      : wp.type === 'nurse'
                      ? styles.iconNurse
                      : styles.iconRoom,
                  ]}
                >
                  <Ionicons
                    name={
                      wp.type === 'dock'
                        ? 'flash'
                        : wp.type === 'pharmacy'
                        ? 'medkit'
                        : wp.type === 'nurse'
                        ? 'heart-circle'
                        : 'bed'
                    }
                    size={14}
                    color={Colors.white}
                  />
                </View>
                <Text style={styles.landmarkLabel}>{wp.name}</Text>
              </View>
            ))}

            {/* Robot Live Location Pin with animated pulsing aura */}
            <View
              style={[
                styles.robotMarkerContainer,
                { left: `${robotPos.x}%`, top: `${robotPos.y}%` },
              ]}
            >
              <View style={styles.pulseAura} />
              <View style={styles.robotMarker}>
                <Ionicons name="hardware-chip" size={18} color={Colors.white} />
              </View>
              <View style={styles.robotMarkerCallout}>
                <Text style={styles.calloutTitle}>CareBot Alpha</Text>
                <Text style={styles.calloutStatus}>En Route</Text>
              </View>
            </View>
          </View>

          {/* Map Controls Footer */}
          <View style={styles.mapFooter}>
            <View style={styles.trackingInfo}>
              <Ionicons name="navigate-circle" size={16} color={Colors.teal} />
              <Text style={styles.trackingText}>
                Destination: <Text style={styles.destBold}>{targetDestination}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={Colors.teal} />
              ) : (
                <Ionicons name="refresh" size={16} color={Colors.teal} />
              )}
              <Text style={styles.refreshText}>{isRefreshing ? 'Updating...' : 'Refresh'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* GPS Coordinates & Position Telemetry Card */}
        <View style={styles.coordsCard}>
          <Text style={styles.cardHeading}>Navigation Telemetry</Text>

          <View style={styles.coordsGrid}>
            <View style={styles.coordItem}>
              <Text style={styles.coordLabel}>Latitude / Longitude</Text>
              <Text style={styles.coordValue}>13.0827° N, 80.2707° E</Text>
              <Text style={styles.coordSub}>WGS84 Reference</Text>
            </View>

            <View style={styles.coordItem}>
              <Text style={styles.coordLabel}>Indoor Coordinates</Text>
              <Text style={styles.coordValue}>
                X: {robotPos.x.toFixed(1)}m · Y: {robotPos.y.toFixed(1)}m
              </Text>
              <Text style={styles.coordSub}>2nd Floor Local SLAM</Text>
            </View>

            <View style={styles.coordItem}>
              <Text style={styles.coordLabel}>Position Accuracy</Text>
              <Text style={styles.coordValue}>± 0.28 meters</Text>
              <Text style={styles.coordSub}>LiDAR + Beacon SLAM</Text>
            </View>

            <View style={styles.coordItem}>
              <Text style={styles.coordLabel}>Last Telemetry Ping</Text>
              <Text style={styles.coordValue}>{lastUpdate}</Text>
              <Text style={styles.coordSub}>50Hz Odometry Feed</Text>
            </View>
          </View>
        </View>

        {/* Quick Dispatch Actions */}
        <View style={styles.dispatchCard}>
          <Text style={styles.cardHeading}>Quick Dispatches</Text>
          <View style={styles.dispatchRow}>
            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={() => {
                setTargetDestination('Dock Station');
                setRobotPos({ x: 18, y: 78 });
              }}
            >
              <Ionicons name="flash-outline" size={18} color={Colors.primary} />
              <Text style={styles.dispatchText}>Send to Dock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={() => {
                setTargetDestination('Nurse Station');
                setRobotPos({ x: 50, y: 52 });
              }}
            >
              <Ionicons name="heart-outline" size={18} color={Colors.teal} />
              <Text style={styles.dispatchText}>Send to Nurse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={() => {
                setTargetDestination('Pharmacy');
                setRobotPos({ x: 22, y: 28 });
              }}
            >
              <Ionicons name="medkit-outline" size={18} color={Colors.green} />
              <Text style={styles.dispatchText}>Send to Pharmacy</Text>
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
  statusBanner: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotGreen: {
    backgroundColor: Colors.green,
  },
  dotOrange: {
    backgroundColor: Colors.orange,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusSubtitle: {
    fontSize: 11,
    color: Colors.gray500,
    lineHeight: 16,
  },
  toggleGpsBtn: {
    marginTop: 4,
    paddingVertical: 4,
  },
  toggleGpsText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.tealDark,
  },
  mapCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.white,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mapSub: {
    fontSize: 11,
    color: Colors.gray500,
  },
  locateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.teal,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  locateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  canvasArea: {
    height: 280,
    backgroundColor: '#0F1E36', // dark blueprint style
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: '#4A6984',
  },
  routeTrailContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  breadcrumb: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.tealLight,
    opacity: 0.7,
  },
  landmarkPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  landmarkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDock: { backgroundColor: Colors.orange },
  iconPharmacy: { backgroundColor: Colors.green },
  iconNurse: { backgroundColor: Colors.teal },
  iconRoom: { backgroundColor: Colors.primaryLight },
  landmarkLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  robotMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    zIndex: 10,
  },
  pulseAura: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 180, 216, 0.35)',
  },
  robotMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.teal,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotMarkerCallout: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginTop: 4,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.white,
  },
  calloutStatus: {
    fontSize: 8,
    color: Colors.green,
    fontWeight: '600',
  },
  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  destBold: {
    fontWeight: '700',
    color: Colors.primary,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
  },
  coordsCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 12,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  coordItem: {
    width: '48%',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
  },
  coordLabel: {
    fontSize: 11,
    color: Colors.gray500,
    fontWeight: '600',
  },
  coordValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  coordSub: {
    fontSize: 10,
    color: Colors.gray400,
    marginTop: 2,
  },
  dispatchCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 12,
  },
  dispatchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dispatchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.lightGray,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dispatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
