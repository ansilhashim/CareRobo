import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

type TaskStatus = 'active' | 'pending' | 'completed' | 'cancelled';
type TaskType = 'medicine' | 'supply' | 'nurse_assist' | 'escort';

interface HealthcareTask {
  id: string;
  type: TaskType;
  title: string;
  destination: string;
  recipient: string;
  items: string;
  status: TaskStatus;
  priority: 'high' | 'routine';
  createdAt: string;
  eta: string;
}

const initialTasks: HealthcareTask[] = [
  {
    id: 'TASK-101',
    type: 'medicine',
    title: 'Deliver Metformin 500mg',
    destination: 'Room 102 · Level 2',
    recipient: 'Ansil Mohamed',
    items: 'Metformin 500mg (1 Box, Sealed)',
    status: 'active',
    priority: 'high',
    createdAt: 'Today, 2:15 PM',
    eta: '3 mins remaining',
  },
  {
    id: 'TASK-102',
    type: 'nurse_assist',
    title: 'Nurse Station Tele-presence Request',
    destination: 'Room 105 · Cardiology',
    recipient: 'Staff Nurse Priya',
    items: 'Two-way video link & vital sensor kit',
    status: 'pending',
    priority: 'routine',
    createdAt: 'Today, 2:30 PM',
    eta: 'Queued',
  },
  {
    id: 'TASK-103',
    type: 'supply',
    title: 'Deliver Sterile Gauze & Syringes',
    destination: 'ICU Ward · Bed 4',
    recipient: 'Dr. Sarah Johnson',
    items: 'Sterile dressing pack, 5ml Syringes',
    status: 'completed',
    priority: 'high',
    createdAt: 'Today, 11:00 AM',
    eta: 'Delivered at 11:14 AM',
  },
  {
    id: 'TASK-104',
    type: 'medicine',
    title: 'Deliver Atorvastatin 20mg',
    destination: 'Room 204 · Level 2',
    recipient: 'Rahim Mohamed',
    items: 'Atorvastatin 20mg strip',
    status: 'completed',
    priority: 'routine',
    createdAt: 'Today, 9:30 AM',
    eta: 'Delivered at 9:45 AM',
  },
  {
    id: 'TASK-105',
    type: 'escort',
    title: 'Patient Corridor Walking Escort',
    destination: 'Physiotherapy Room B',
    recipient: 'Patient Walker Assister',
    items: 'Mobility support handlebar',
    status: 'cancelled',
    priority: 'routine',
    createdAt: 'Yesterday, 4:00 PM',
    eta: 'Cancelled by caregiver',
  },
];

export default function RobotTasksScreen() {
  const [tasks, setTasks] = useState<HealthcareTask[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  // Confirmation Modal state
  const [confirmTask, setConfirmTask] = useState<HealthcareTask | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // New Task Modal state
  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newType, setNewType] = useState<TaskType>('medicine');

  const filteredTasks = tasks.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  const requestStartTask = (task: HealthcareTask) => {
    setConfirmTask(task);
    setConfirmModalVisible(true);
  };

  const executeStartTask = () => {
    if (!confirmTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === confirmTask.id ? { ...t, status: 'active', eta: 'En route' } : t))
    );
    setConfirmModalVisible(false);
    Alert.alert(
      'Robot Dispatched',
      `CareBot Alpha is now navigating to ${confirmTask.destination} for ${confirmTask.title}.`
    );
    setConfirmTask(null);
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              eta: `Completed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            }
          : t
      )
    );
  };

  const cancelTask = (taskId: string) => {
    Alert.alert('Cancel Task', 'Are you sure you want to cancel this robot dispatch?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, status: 'cancelled', eta: 'Cancelled by operator' } : t
            )
          );
        },
      },
    ]);
  };

  const handleCreateTask = () => {
    if (!newTitle.trim() || !newDestination.trim()) {
      Alert.alert('Required Fields', 'Please enter a task title and destination.');
      return;
    }
    const created: HealthcareTask = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      type: newType,
      title: newTitle,
      destination: newDestination,
      recipient: newRecipient || 'Patient',
      items: 'Dispensed medical container',
      status: 'pending',
      priority: 'high',
      createdAt: 'Just now',
      eta: 'Ready to dispatch',
    };
    setTasks([created, ...tasks]);
    setNewTitle('');
    setNewDestination('');
    setNewRecipient('');
    setNewTaskModalVisible(false);
    Alert.alert('Task Queued', 'New robot task added to dispatch queue.');
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'medicine':
        return { name: 'medkit' as const, color: Colors.green, bg: Colors.greenLight };
      case 'supply':
        return { name: 'flask' as const, color: Colors.teal, bg: Colors.tealLight };
      case 'nurse_assist':
        return { name: 'heart' as const, color: Colors.red, bg: Colors.redLight };
      case 'escort':
        return { name: 'walk' as const, color: Colors.orange, bg: Colors.orangeLight };
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'active':
        return { label: 'IN PROGRESS', color: Colors.tealDark, bg: Colors.tealLight };
      case 'pending':
        return { label: 'PENDING', color: Colors.orange, bg: Colors.orangeLight };
      case 'completed':
        return { label: 'COMPLETED', color: Colors.greenDark, bg: Colors.greenLight };
      case 'cancelled':
        return { label: 'CANCELLED', color: Colors.gray500, bg: Colors.gray100 };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Header with New Task Button */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.screenHeading}>Robot Healthcare Tasks</Text>
            <Text style={styles.screenSubheading}>
              Autonomous delivery & caregiver assistance
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newTaskBtn}
            onPress={() => setNewTaskModalVisible(true)}
          >
            <Ionicons name="add-circle" size={18} color={Colors.white} />
            <Text style={styles.newTaskBtnText}>New Task</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'active' as const, label: 'Active' },
            { key: 'pending' as const, label: 'Pending' },
            { key: 'completed' as const, label: 'Done' },
            { key: 'cancelled' as const, label: 'Cancelled' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterPill, filter === tab.key && styles.filterPillActive]}
              onPress={() => setFilter(tab.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === tab.key && styles.filterPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task Cards List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={56} color={Colors.gray300} />
              <Text style={styles.emptyTitle}>No tasks found</Text>
              <Text style={styles.emptySubtitle}>
                There are no {filter !== 'all' ? filter : ''} tasks in this view.
              </Text>
            </View>
          ) : (
            filteredTasks.map((task) => {
              const iconMeta = getTypeIcon(task.type);
              const statusMeta = getStatusBadge(task.status);

              return (
                <View key={task.id} style={styles.taskCard}>
                  {/* Card Header */}
                  <View style={styles.taskCardHeader}>
                    <View style={styles.typeRow}>
                      <View style={[styles.typeIconBg, { backgroundColor: iconMeta.bg }]}>
                        <Ionicons name={iconMeta.name} size={18} color={iconMeta.color} />
                      </View>
                      <View>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.taskId}>{task.id} · {task.createdAt}</Text>
                      </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: statusMeta.bg }]}>
                      <Text style={[styles.badgeText, { color: statusMeta.color }]}>
                        {statusMeta.label}
                      </Text>
                    </View>
                  </View>

                  {/* Task Details */}
                  <View style={styles.taskDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={14} color={Colors.gray400} />
                      <Text style={styles.detailLabel}>Destination:</Text>
                      <Text style={styles.detailValue}>{task.destination}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={14} color={Colors.gray400} />
                      <Text style={styles.detailLabel}>Recipient:</Text>
                      <Text style={styles.detailValue}>{task.recipient}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="cube-outline" size={14} color={Colors.gray400} />
                      <Text style={styles.detailLabel}>Payload:</Text>
                      <Text style={styles.detailValue}>{task.items}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={14} color={Colors.gray400} />
                      <Text style={styles.detailLabel}>ETA / Progress:</Text>
                      <Text style={[styles.detailValue, { color: Colors.tealDark, fontWeight: '700' }]}>
                        {task.eta}
                      </Text>
                    </View>
                  </View>

                  {/* Contextual Action Buttons */}
                  <View style={styles.taskActionsRow}>
                    {task.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={styles.startBtn}
                          onPress={() => requestStartTask(task)}
                        >
                          <Ionicons name="play" size={14} color={Colors.white} />
                          <Text style={styles.startBtnText}>Dispatch Robot</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelActionBtn}
                          onPress={() => cancelTask(task.id)}
                        >
                          <Text style={styles.cancelActionText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {task.status === 'active' && (
                      <>
                        <TouchableOpacity
                          style={styles.completeBtn}
                          onPress={() => completeTask(task.id)}
                        >
                          <Ionicons name="checkmark-done" size={14} color={Colors.white} />
                          <Text style={styles.completeBtnText}>Mark Completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelActionBtn}
                          onPress={() => cancelTask(task.id)}
                        >
                          <Text style={styles.cancelActionText}>Abort</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {(task.status === 'completed' || task.status === 'cancelled') && (
                      <Text style={styles.closedNote}>
                        Task archived · Stored in hospital telemetry log
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Safety Confirmation Modal */}
        <Modal
          visible={confirmModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.confirmHeader}>
                <Ionicons name="warning" size={32} color={Colors.orange} />
                <Text style={styles.confirmTitle}>Confirm Robot Dispatch</Text>
              </View>

              <Text style={styles.confirmMessage}>
                You are about to dispatch CareBot Alpha to:
              </Text>

              <View style={styles.confirmBox}>
                <Text style={styles.confirmDest}>{confirmTask?.destination}</Text>
                <Text style={styles.confirmItem}>Cargo: {confirmTask?.items}</Text>
              </View>

              <Text style={styles.safetyChecklist}>
                ✓ Corridors verified clear of temporary obstacles{'\n'}
                ✓ Recipient ward nurse informed{'\n'}
                ✓ Compartment lid locked
              </Text>

              <View style={styles.modalBtnsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={executeStartTask}
                >
                  <Ionicons name="navigate" size={16} color={Colors.white} />
                  <Text style={styles.modalConfirmText}>Confirm & Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* New Task Creation Modal */}
        <Modal
          visible={newTaskModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setNewTaskModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.newTaskCard}>
              <View style={styles.newTaskHeader}>
                <Text style={styles.newTaskHeading}>Create Healthcare Dispatch</Text>
                <TouchableOpacity onPress={() => setNewTaskModalVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Task Type Selector */}
              <Text style={styles.inputLabel}>Task Category</Text>
              <View style={styles.typeSelectRow}>
                {[
                  { key: 'medicine' as const, label: 'Medicine', icon: 'medkit' as const },
                  { key: 'supply' as const, label: 'Supplies', icon: 'flask' as const },
                  { key: 'nurse_assist' as const, label: 'Nurse Assist', icon: 'heart' as const },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.typeOption,
                      newType === item.key && styles.typeOptionActive,
                    ]}
                    onPress={() => setNewType(item.key)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={newType === item.key ? Colors.white : Colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.typeOptionText,
                        newType === item.key && styles.typeOptionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Task Description / Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Deliver Metformin 500mg"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Destination Ward / Room</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Room 102 · Level 2"
                value={newDestination}
                onChangeText={setDestinationHelper}
              />

              <Text style={styles.inputLabel}>Patient or Staff Recipient</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Ansil Mohamed"
                value={newRecipient}
                onChangeText={setNewRecipient}
              />

              <TouchableOpacity
                style={styles.createTaskSubmitBtn}
                onPress={handleCreateTask}
              >
                <Text style={styles.createTaskSubmitText}>Add to Dispatch Queue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );

  function setDestinationHelper(val: string) {
    setNewDestination(val);
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  screenHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubheading: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  newTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.tealDark,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  newTaskBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
    gap: 12,
  },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  typeIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  taskId: {
    fontSize: 11,
    color: Colors.gray400,
    marginTop: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskDetails: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.gray500,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  taskActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.teal,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  completeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.green,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  cancelActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  cancelActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.red,
  },
  closedNote: {
    fontSize: 11,
    color: Colors.gray400,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    gap: 14,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  confirmBox: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  confirmDest: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  confirmItem: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  safetyChecklist: {
    fontSize: 11,
    color: Colors.gray500,
    lineHeight: 18,
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.tealDark,
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  newTaskCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  newTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newTaskHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  typeSelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  typeOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  typeOptionTextActive: {
    color: Colors.white,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    fontSize: 13,
  },
  createTaskSubmitBtn: {
    backgroundColor: Colors.tealDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  createTaskSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
