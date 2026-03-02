/**
 * screens/MentorScreens.js
 * ──────────────────────────────────────────────────────────────
 * All Mentor screens: Dashboard, Batches, MenteeDetail, Approvals, Profile
 * §6.7, §6.8, §6.9, §6.10
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Line, Polyline, Polygon, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { useToast } from '../components/Toast';
import { colors, spacing, typography, radius } from '../theme';
import { useTheme } from '../ThemeContext';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { MockData } from '../mockData';
import {
  Cake,
  X,
  Fire,
  Star,
  Clock,
  CheckCircle,
  ArrowLeft,
  CaretLeft,
  CaretRight,
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
  PaperPlaneRight,
  CalendarCheck,
  UserPlus,
  UserMinus,
  Play,
  PencilSimple,
} from 'phosphor-react-native';

// ═══════════════════════════════════════════════════════════
// Dashboard Screen (§6.7)
// ═══════════════════════════════════════════════════════════

export const MentorDashboardScreen = ({ onNavigate, onTabSwitch }) => {
  const { colors } = useTheme();
  const dashboard = MockData.mentorDashboard;
  const [dismissedBirthdays, setDismissedBirthdays] = useState([]);

  const visibleBirthdays = dashboard.birthdays.filter((_, i) => !dismissedBirthdays.includes(i));

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Birthday Banner */}
      {visibleBirthdays.map((birthday, index) => {
        const originalIndex = dashboard.birthdays.indexOf(birthday);
        return (
          <Card key={originalIndex} variant="banner" style={styles.birthdayBanner}>
            <Cake size={20} color={colors.primary} weight="duotone" />
            <Text style={[styles.bannerText, { color: colors.text.primary }]}>
              <Text style={[styles.bannerBold, { color: colors.text.primary }]}>{birthday.name}'s</Text> birthday is {birthday.date}
            </Text>
            <TouchableOpacity onPress={() => setDismissedBirthdays([...dismissedBirthdays, originalIndex])}>
              <X size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          </Card>
        );
      })}

      {/* Summary Metrics — G2: No circle on Submitted, consistent padding */}
      <View style={styles.metricsRow}>
        <Card variant="dashboard" style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: colors.text.primary }]}>{dashboard.totalMentees}</Text>
          <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>Mentees</Text>
        </Card>
        <Card variant="dashboard" style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: colors.status.success }]}>
            {dashboard.submittedToday}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>Submitted</Text>
        </Card>
        <Card variant="dashboard"
          style={styles.metricCard}
          onPress={() => onTabSwitch?.('approvals')}
        >
          <Text style={[styles.metricValue, { color: colors.status.warning }]}>
            {dashboard.pendingActions}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>Pending</Text>
        </Card>
      </View>

      {/* Needs Attention — G1: No dot */}
      {dashboard.needsAttention.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Needs Attention</Text>
          {dashboard.needsAttention.map((item, index) => (
            <Card key={index} variant="attention" onPress={() => onNavigate?.('menteeDetail')}>
              <View style={styles.attentionRow}>
                <View style={styles.attentionLeft}>
                  <View style={[styles.avatar, { backgroundColor: item.color }]}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                  <View>
                    <Text style={[styles.attentionName, { color: colors.text.primary }]}>{item.name}</Text>
                    <Text style={[styles.attentionReason, { color: colors.text.secondary }]}>{item.reason}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={[styles.contactButton, { color: colors.primary }]}>Contact</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </>
      )}

      {/* Batches */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Batches</Text>
      {MockData.batches.map((batch, index) => (
        <Card key={index} variant="form" onPress={() => onNavigate?.('batchDetail')}>
          <View style={styles.batchHeader}>
            <Text style={[styles.batchName, { color: colors.text.primary }]}>{batch.name}</Text>
            <Text style={[styles.batchSchedule, { color: colors.text.secondary }]}>{batch.schedule}</Text>
          </View>
          <View style={styles.menteeAvatars}>
            {batch.mentees.map((mentee, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.smallAvatar,
                  { backgroundColor: mentee.color },
                  mentee.ring === 'error' && styles.avatarRingError,
                  mentee.ring === 'success' && styles.avatarRingSuccess,
                  mentee.ring === 'warning' && styles.avatarRingWarning,
                ]}
                onPress={() => onNavigate?.('menteeDetail')}
              >
                <Text style={styles.smallAvatarText}>{mentee.initials}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.batchBottomRow}>
            <Text style={[styles.nextSession, { color: colors.text.secondary }]}>Next session: Thu 27 Feb, 18:30</Text>
            <TouchableOpacity onPress={() => onNavigate?.('batchDetail')}>
              <Text style={[styles.viewLink, { color: colors.primary }]}>View</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════════
// Batches List Screen (§6.8 – list view)
// ═══════════════════════════════════════════════════════════

export const BatchesListScreen = ({ onNavigate }) => {
  const { colors } = useTheme();
  const batches = MockData.batches;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Batches</Text>

      {batches.map((batch, index) => (
        <Card key={index} variant="form" onPress={() => onNavigate?.('batchDetail')}>
          <Text style={[styles.batchName, { color: colors.text.primary }]}>{batch.name}</Text>
          <Text style={[styles.batchSchedule, { color: colors.text.secondary }]}>{batch.schedule} • {batch.location}</Text>
          <View style={styles.batchBottomRow}>
            <View style={styles.batchAvatars}>
              {batch.mentees.map((m, i) => (
                <View key={i} style={[styles.smallAvatar, { backgroundColor: m.color }]}>
                  <Text style={styles.smallAvatarText}>{m.initials}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.viewLink, { color: colors.primary }]}>View</Text>
          </View>
        </Card>
      ))}

      <Button variant="secondary" style={{ marginTop: spacing.lg }}>
        + Request New Batch
      </Button>
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════════
// Batch Detail Screen (§6.8) — Enhanced with Sessions, History, Edit, New Session
// ═══════════════════════════════════════════════════════════

const HISTORY_ICONS = {
  session: CalendarCheck,
  module_start: Play,
  module_complete: CheckCircle,
  member_join: UserPlus,
  member_left: UserMinus,
  allocation: PencilSimple,
};

export const BatchDetailScreen = ({ onBack, onNavigate }) => {
  const { colors } = useTheme();
  const batch = MockData.batches[0];
  const showToast = useToast();
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const sessionDetailRef = useRef(null);
  const editBatchRef = useRef(null);
  const newSessionRef = useRef(null);
  const moduleSessionsRef = useRef(null);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState(null);
  const [selectedModuleForHistory, setSelectedModuleForHistory] = useState(null);

  // Edit Batch state
  const [editName, setEditName] = useState(batch.name);
  const [editSchedule, setEditSchedule] = useState(batch.schedule);
  const [editLocation, setEditLocation] = useState(batch.location);
  const [editStatus, setEditStatus] = useState(batch.status);
  const [editModules, setEditModules] = useState(batch.modules.map(m => ({ ...m })));

  // New Session state
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionNotes, setNewSessionNotes] = useState('');
  const [newSessionModules, setNewSessionModules] = useState([]);
  const [newSessionAttendance, setNewSessionAttendance] = useState(
    batch.mentees.reduce((acc, m) => ({ ...acc, [m.name]: 'present' }), {})
  );

  const sessions = batch.sessions || [];
  const activeSession = sessions[activeSessionIndex];

  // H2: Next session reminder
  const daysUntilNext = 2; // Mock: 2 days until Thu 27 Feb

  const openSessionDetail = (session) => {
    setSelectedSessionForDetail(session);
    sessionDetailRef.current?.present();
  };

  const openModuleSessions = (moduleTitle) => {
    setSelectedModuleForHistory(moduleTitle);
    moduleSessionsRef.current?.present();
  };

  const cycleModuleStatus = (index) => {
    const cycle = { upcoming: 'active', active: 'completed', completed: 'upcoming' };
    const updated = [...editModules];
    updated[index] = { ...updated[index], status: cycle[updated[index].status] };
    setEditModules(updated);
  };

  const toggleNewSessionModule = (title) => {
    setNewSessionModules(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const cycleAttendance = (name) => {
    const cycle = { present: 'late', late: 'absent', absent: 'present' };
    setNewSessionAttendance(prev => ({ ...prev, [name]: cycle[prev[name]] }));
  };

  const moduleSessions = selectedModuleForHistory
    ? sessions.filter(s => s.module === selectedModuleForHistory)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color={colors.text.primary} />
          <Text style={[styles.backText, { color: colors.text.primary }]}>Back</Text>
        </TouchableOpacity>

        <View style={styles.batchHeaderLarge}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.batchTitle, { color: colors.text.primary }]}>{batch.name}</Text>
            <Text style={[styles.batchSubtitle, { color: colors.text.secondary }]}>
              {batch.schedule} • {batch.location}
            </Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: `${colors.status.success}20` }]}>
            <Text style={[styles.statusChipText, { color: colors.status.success }]}>Active</Text>
          </View>
        </View>

        {/* H2: Next session reminder */}
        <View style={[styles.reminderChip, { backgroundColor: `${colors.primary}10` }]}>
          <Clock size={14} color={colors.primary} />
          <Text style={[styles.reminderText, { color: colors.primary }]}>
            Next session in {daysUntilNext} days — Thu 27 Feb, 18:30
          </Text>
        </View>

        {/* Members */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Members</Text>
        {batch.mentees.map((mentee, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.memberRow, { borderBottomColor: colors.border }]}
            onPress={() => onNavigate?.('menteeDetail')}
          >
            <View style={styles.memberLeft}>
              <View style={[styles.avatar, { backgroundColor: mentee.color }]}>
                <Text style={styles.avatarText}>{mentee.initials}</Text>
              </View>
              <View>
                <Text style={[styles.memberName, { color: colors.text.primary }]}>{mentee.name}</Text>
                <Text style={[styles.memberStatus, { color: colors.text.secondary }]}>Last: {mentee.ring === 'success' ? 'today' : '4 days ago'}</Text>
              </View>
            </View>
            <View style={[
              styles.statusDot,
              mentee.ring === 'success' && styles.dotSuccess,
              mentee.ring === 'warning' && styles.dotWarning,
              mentee.ring === 'error' && styles.dotError,
            ]} />
          </TouchableOpacity>
        ))}

        {/* H1: Sessions section */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Sessions</Text>
        {sessions.length > 0 && (
          <>
            {/* Session date navigator */}
            <View style={styles.sessionNav}>
              <TouchableOpacity
                onPress={() => setActiveSessionIndex(Math.max(activeSessionIndex - 1, 0))}
                disabled={activeSessionIndex <= 0}
              >
                <CaretLeft size={20} color={activeSessionIndex <= 0 ? colors.border : colors.text.primary} />
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.sessionDateBoxes}>
                  {sessions.map((s, i) => {
                    const [day, month] = s.date.split('/');
                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    const monthLabel = months[parseInt(month) - 1] || month;
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.sessionDateBox,
                          { borderColor: colors.border },
                          i === activeSessionIndex && { backgroundColor: colors.primary, borderColor: colors.primary },
                        ]}
                        onPress={() => setActiveSessionIndex(i)}
                      >
                        <Text style={[styles.sessionDateMonth, { color: colors.text.secondary }, i === activeSessionIndex && { color: colors.surface }]}>{monthLabel}</Text>
                        <Text style={[styles.sessionDateDay, { color: colors.text.primary }, i === activeSessionIndex && { color: colors.surface }]}>{day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => setActiveSessionIndex(Math.min(activeSessionIndex + 1, sessions.length - 1))}
                disabled={activeSessionIndex >= sessions.length - 1}
              >
                <CaretRight size={20} color={activeSessionIndex >= sessions.length - 1 ? colors.border : colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Session briefing card */}
            {activeSession && (
              <Card variant="form" onPress={() => openSessionDetail(activeSession)}>
                <Text style={[styles.sessionTitle, { color: colors.text.primary }]}>{activeSession.title}</Text>
                <View style={[styles.sessionModuleTag, { backgroundColor: `${colors.status.warning}20` }]}>
                  <Text style={[styles.sessionModuleTagText, { color: colors.status.warning }]}>{activeSession.module}</Text>
                </View>
                <Text style={[styles.sessionDescription, { color: colors.text.secondary }]} numberOfLines={2}>{activeSession.description}</Text>
              </Card>
            )}
          </>
        )}

        {/* H7: Attendance Grid — horizontal scroll */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Attendance</Text>
        <Card variant="form">
          <View style={styles.attendanceGrid}>
            {/* Fixed left column + scrollable right area */}
            <View style={styles.gridRow}>
              {/* Fixed name column */}
              <View>
                <Text style={[styles.gridHeaderLeft, { color: colors.text.secondary }]}>Mentee</Text>
                {batch.mentees.map((mentee, mIndex) => (
                  <View key={mIndex} style={styles.gridFixedCell}>
                    <Text style={[styles.gridCellLeft, { color: colors.text.primary }]}>{mentee.name}</Text>
                  </View>
                ))}
              </View>
              {/* Scrollable data columns */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
                <View>
                  {/* Date headers */}
                  <View style={styles.gridRow}>
                    {batch.attendance.map((a, i) => (
                      <TouchableOpacity key={i} onPress={() => {
                        const matchingSession = sessions.find(s => s.date === a.date);
                        if (matchingSession) openSessionDetail(matchingSession);
                      }}>
                        <Text style={[styles.gridHeader, { width: 52, color: colors.text.secondary }]}>{a.date}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Data rows */}
                  {batch.mentees.map((mentee, mIndex) => (
                    <View key={mIndex} style={[styles.gridRow, styles.gridFixedCell]}>
                      {batch.attendance.map((session, sIndex) => {
                        const status = session.data[mentee.name];
                        return (
                          <View key={sIndex} style={[styles.gridCell, { width: 52 }]}>
                            <View style={[
                              styles.statusDot,
                              status === 'present' && styles.dotSuccess,
                              status === 'late' && styles.dotWarning,
                              status === 'absent' && styles.dotError,
                              !status && styles.dotEmpty,
                            ]} />
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Card>

        {/* Modules — H8: tappable to show session history */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Modules</Text>
        {batch.modules.map((module, index) => (
          <TouchableOpacity key={index} style={[styles.moduleRow, { borderBottomColor: colors.border }]} onPress={() => openModuleSessions(module.title)}>
            <Text style={[styles.moduleName, { color: colors.text.primary }]}>{module.title}</Text>
            <View style={[
              styles.moduleChip,
              module.status === 'completed' && styles.moduleCompleted,
              module.status === 'active' && styles.moduleActive,
            ]}>
              <Text style={[
                styles.moduleChipText,
                module.status === 'completed' && styles.moduleCompletedText,
                module.status === 'active' && styles.moduleActiveText,
              ]}>
                {module.status === 'completed' ? 'Completed' :
                 module.status === 'active' ? 'Active' : 'Upcoming'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* H3: History section — capped at 4 visible rows */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>History</Text>
        <View style={[styles.batchHistoryContainer, { borderColor: colors.border }]}>
          <ScrollView nestedScrollEnabled>
            {(batch.history || []).map((entry, index) => {
              const Icon = HISTORY_ICONS[entry.type] || CalendarCheck;
              return (
                <View key={index} style={[styles.historyRow, { borderBottomColor: colors.border }]}>
                  <Icon size={16} color={colors.text.secondary} />
                  <View style={styles.historyContent}>
                    <Text style={[styles.historyText, { color: colors.text.primary }]}>{entry.text}</Text>
                    <Text style={[styles.historyDate, { color: colors.text.secondary }]}>{entry.date}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <Button variant="secondary" onPress={() => editBatchRef.current?.present()}>
            Edit Batch
          </Button>
          <Button variant="secondary" onPress={() => {
            showToast('Invite link copied! Share with your mentee to join this batch.', 'success');
          }}>
            Invite Mentee
          </Button>
          <Button variant="primary" onPress={() => {
            setNewSessionName('');
            setNewSessionNotes('');
            setNewSessionModules([]);
            setNewSessionAttendance(batch.mentees.reduce((acc, m) => ({ ...acc, [m.name]: 'present' }), {}));
            newSessionRef.current?.present();
          }}>
            New Session
          </Button>
        </View>
      </ScrollView>

      {/* Session Detail Sheet */}
      <BottomSheet ref={sessionDetailRef} snapPoints={['70%']} title="Session Details">
        {selectedSessionForDetail && (
          <ScrollView>
            <Text style={[styles.sheetSessionTitle, { color: colors.text.primary }]}>{selectedSessionForDetail.title}</Text>
            <View style={[styles.sessionModuleTag, { backgroundColor: `${colors.status.warning}20` }]}>
              <Text style={[styles.sessionModuleTagText, { color: colors.status.warning }]}>{selectedSessionForDetail.module}</Text>
            </View>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Date</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>{selectedSessionForDetail.date}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Description</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary, marginBottom: spacing.md }]}>{selectedSessionForDetail.description}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Attendees</Text>
            {Object.entries(selectedSessionForDetail.attendees).map(([name, status]) => (
              <View key={name} style={[styles.attendeeRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.attendeeName, { color: colors.text.primary }]}>{name}</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: status === 'present' ? `${colors.status.success}20` :
                    status === 'late' ? `${colors.status.warning}20` : `${colors.status.error}20`
                }]}>
                  <Text style={{
                    color: status === 'present' ? colors.status.success :
                      status === 'late' ? colors.status.warning : colors.status.error,
                    ...typography.caption,
                    textTransform: 'capitalize',
                  }}>{status}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </BottomSheet>

      {/* H4: Edit Batch Sheet */}
      <BottomSheet ref={editBatchRef} snapPoints={['80%']} title="Edit Batch">
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Name</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editName} onChangeText={setEditName} />
          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Schedule</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editSchedule} onChangeText={setEditSchedule} />
          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Location</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editLocation} onChangeText={setEditLocation} />

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Status</Text>
          <View style={[styles.statusToggle, { borderColor: colors.border }]}>
            {['active', 'inactive', 'planned'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.statusToggleOption, editStatus === s && { backgroundColor: colors.accent?.peach || `${colors.primary}20` }]}
                onPress={() => setEditStatus(s)}
              >
                <Text style={[styles.statusToggleText, { color: colors.text.secondary }, editStatus === s && { color: colors.primary, fontWeight: '600' }]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Members</Text>
          {batch.mentees.map((m, i) => (
            <TouchableOpacity key={i} style={[styles.editMemberRow, { borderBottomColor: colors.border }]} onPress={() => {
              showToast(`Remove ${m.name} from batch?`, 'error');
            }}>
              <View style={[styles.smallAvatar, { backgroundColor: m.color, borderWidth: 0 }]}>
                <Text style={styles.smallAvatarText}>{m.initials}</Text>
              </View>
              <Text style={[styles.editMemberName, { color: colors.text.primary }]}>{m.name}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Modules</Text>
          {editModules.map((module, index) => (
            <TouchableOpacity key={index} style={[styles.moduleRow, { borderBottomColor: colors.border }]} onPress={() => cycleModuleStatus(index)}>
              <Text style={[styles.moduleName, { color: colors.text.primary }]}>{module.title}</Text>
              <View style={[
                styles.moduleChip,
                module.status === 'completed' && styles.moduleCompleted,
                module.status === 'active' && styles.moduleActive,
              ]}>
                <Text style={[
                  styles.moduleChipText,
                  module.status === 'completed' && styles.moduleCompletedText,
                  module.status === 'active' && styles.moduleActiveText,
                ]}>
                  {module.status === 'completed' ? 'Completed' :
                   module.status === 'active' ? 'Active' : 'Upcoming'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <Button variant="secondary" style={{ marginTop: spacing.sm }} onPress={() => showToast('Add module placeholder', 'success')}>
            + Add Module
          </Button>

          <Button variant="primary" style={{ marginTop: spacing.lg }} onPress={() => {
            editBatchRef.current?.dismiss();
            showToast('Batch updated successfully', 'success');
          }}>
            Save Changes
          </Button>
        </ScrollView>
      </BottomSheet>

      {/* H5: New Session Sheet */}
      <BottomSheet ref={newSessionRef} snapPoints={['85%']} title="Log New Session">
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Session Name</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={newSessionName} onChangeText={setNewSessionName} placeholder="e.g. Japa Workshop Pt 4" placeholderTextColor={colors.text.secondary} />

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Notes</Text>
          <TextInput style={[styles.sheetInput, { height: 80, textAlignVertical: 'top', borderColor: colors.border, color: colors.text.primary }]} value={newSessionNotes} onChangeText={setNewSessionNotes} multiline placeholder="Session notes..." placeholderTextColor={colors.text.secondary} />

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Modules</Text>
          <View style={styles.moduleTagRow}>
            {batch.modules.filter(m => m.status === 'active').map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.moduleTag, { borderColor: colors.border }, newSessionModules.includes(m.title) && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => toggleNewSessionModule(m.title)}
              >
                <Text style={[styles.moduleTagText, { color: colors.text.primary }, newSessionModules.includes(m.title) && { color: colors.surface }]}>{m.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Attendance</Text>
          {batch.mentees.map((m, i) => (
            <TouchableOpacity key={i} style={[styles.attendanceToggleRow, { borderBottomColor: colors.border }]} onPress={() => cycleAttendance(m.name)}>
              <Text style={[styles.attendeeName, { color: colors.text.primary }]}>{m.name}</Text>
              <View style={[styles.statusBadge, {
                backgroundColor: newSessionAttendance[m.name] === 'present' ? `${colors.status.success}20` :
                  newSessionAttendance[m.name] === 'late' ? `${colors.status.warning}20` : `${colors.status.error}20`
              }]}>
                <Text style={{
                  color: newSessionAttendance[m.name] === 'present' ? colors.status.success :
                    newSessionAttendance[m.name] === 'late' ? colors.status.warning : colors.status.error,
                  ...typography.caption,
                  textTransform: 'capitalize',
                }}>{newSessionAttendance[m.name]}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Button variant="primary" style={{ marginTop: spacing.lg }} onPress={() => {
            newSessionRef.current?.dismiss();
            showToast('Session logged successfully', 'success');
          }}>
            Log Session
          </Button>
        </ScrollView>
      </BottomSheet>

      {/* H8: Module Sessions Sheet */}
      <BottomSheet ref={moduleSessionsRef} snapPoints={['60%']} title={selectedModuleForHistory || 'Module Sessions'}>
        <ScrollView>
          {moduleSessions.length === 0 ? (
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>No sessions recorded for this module yet.</Text>
          ) : (
            moduleSessions.map((s, i) => (
              <TouchableOpacity key={i} style={[styles.moduleSessionRow, { borderBottomColor: colors.border }]} onPress={() => {
                moduleSessionsRef.current?.dismiss();
                setTimeout(() => openSessionDetail(s), 300);
              }}>
                <Text style={[styles.moduleSessionDate, { color: colors.text.secondary }]}>{s.date}</Text>
                <Text style={[styles.moduleSessionTitle, { color: colors.text.primary }]}>{s.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Mentee Detail Screen (§6.9) — Enhanced
// ═══════════════════════════════════════════════════════════

export const MenteeDetailScreen = ({ onBack, onRemoveUser, headerExtra }) => {
  const { colors } = useTheme();
  const mentee = MockData.menteeDetail;
  const [activeTab, setActiveTab] = useState('sadhana');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(mentee.notes);
  const [timescale, setTimescale] = useState('7');
  const sessionDetailRef = useRef(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    setNotes([{ date: 'Just now', text: noteText.trim() }, ...notes]);
    setNoteText('');
  };

  const openSessionFromAttendance = (entry) => {
    // Find matching session from batch sessions data
    const sessions = MockData.batches[0].sessions || [];
    const match = sessions.find(s => s.title === entry.session);
    if (match) {
      setSelectedSession(match);
      sessionDetailRef.current?.present();
    }
  };

  const tabs = ['sadhana', 'seva', 'courses', 'attendance', 'notes'];

  // I2: Chart data (reuse mentee's submission history for David)
  const chartDataAll = MockData.submissionHistory;
  const timeFilteredData = chartDataAll.slice(0, parseInt(timescale));
  const chartData = timeFilteredData.slice().reverse();
  const scores = chartData.map(d => d.score);
  const minScore = Math.min(...scores);
  const yMin = Math.max(0, Math.floor((minScore - 10) / 5) * 5);
  const yMax = 100;
  const yLabels = Array.from({ length: 5 }, (_, i) =>
    Math.round(yMin + ((yMax - yMin) * (4 - i)) / 4)
  );

  // I7: Contact linking
  const handleWhatsApp = () => {
    const phone = mentee.phone.replace(/\s/g, '').replace('+', '');
    Linking.openURL(`whatsapp://send?phone=${phone}`).catch(() => {});
  };
  const handlePhone = () => {
    Linking.openURL(`tel:${mentee.phone}`).catch(() => {});
  };
  const handleEmail = () => {
    Linking.openURL(`mailto:${mentee.email}`).catch(() => {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.detailHeaderRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={20} color={colors.text.primary} />
            <Text style={[styles.backText, { color: colors.text.primary }]}>Back</Text>
          </TouchableOpacity>
          {onRemoveUser && (
            <TouchableOpacity onPress={onRemoveUser}>
              <Text style={[styles.removeUserText, { color: colors.status.error }]}>Remove User</Text>
            </TouchableOpacity>
          )}
        </View>
        {headerExtra}

        {/* Profile Header — I1: icon and label on same line */}
        <View style={styles.menteeHeader}>
          <View style={[styles.largeAvatar, { backgroundColor: mentee.color }]}>
            <Text style={styles.largeAvatarText}>{mentee.initials}</Text>
          </View>
          <Text style={[styles.menteeName, { color: colors.text.primary }]}>{mentee.name}</Text>
          <Text style={[styles.menteeBatch, { color: colors.text.secondary }]}>{mentee.batch}</Text>

          <View style={styles.contactChips}>
            <TouchableOpacity style={[styles.contactChip, styles.whatsappChip]} onPress={handleWhatsApp}>
              <WhatsappLogo size={18} color="#25D366" weight="fill" />
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactChip, styles.phoneChip]} onPress={handlePhone}>
              <Phone size={18} color={colors.status.info} weight="fill" />
              <Text style={styles.phoneText}>Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactChip, styles.emailChip]} onPress={handleEmail}>
              <EnvelopeSimple size={18} color={colors.text.secondary} weight="fill" />
              <Text style={styles.emailText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub Tabs — I4: prevent text wrapping */}
        <View style={[styles.subTabStrip, { borderBottomColor: colors.border }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.subTab, activeTab === tab && [styles.subTabActive, { borderBottomColor: colors.primary }]]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.subTabText, { color: colors.text.secondary }, activeTab === tab && [styles.subTabTextActive, { color: colors.primary }]]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'sadhana' && (
          <View>
            {/* I2: Fixed stat boxes + chart with timescale */}
            <View style={styles.statsRow}>
              <View style={[styles.statChip, { backgroundColor: `${colors.primary}10` }]}>
                <View style={styles.statValue}>
                  <Fire size={16} color={colors.status.error} weight="fill" />
                  <Text style={[styles.statNumber, { color: colors.text.primary }]}>{mentee.streak}</Text>
                </View>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Streak</Text>
              </View>
              <View style={[styles.statChip, { backgroundColor: `${colors.primary}10` }]}>
                <View style={styles.statValue}>
                  <Star size={16} color={colors.text.primary} weight="fill" />
                  <Text style={[styles.statNumber, { color: colors.text.primary }]}>62</Text>
                </View>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Avg Score</Text>
              </View>
            </View>

            {/* SVG Chart with embedded timescale */}
            <Card variant="dashboard" style={{ position: 'relative', marginBottom: spacing.md }}>
              {/* Timescale toggle — embedded top-right */}
              <View style={[styles.timescaleRowEmbedded, { borderColor: colors.border }]}>
                {['7', '30', '90'].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.timescaleOption, timescale === val && [styles.timescaleOptionActive, { backgroundColor: `${colors.primary}20` }]]}
                    onPress={() => setTimescale(val)}
                  >
                    <Text style={[styles.timescaleText, { color: colors.text.secondary }, timescale === val && [styles.timescaleTextActive, { color: colors.primary }]]}>
                      {val}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {(() => {
                const data = chartData;
                if (data.length === 0) return <View style={{ height: 120 }} />;
                const chartW = 280;
                const chartH = 120;
                const padL = 32;
                const padR = 8;
                const padT = 8;
                const padB = 24;
                const plotW = chartW - padL - padR;
                const plotH = chartH - padT - padB;
                const points = data.map((d, i) => {
                  const x = padL + (i / Math.max(data.length - 1, 1)) * plotW;
                  const y = padT + plotH - ((d.score - yMin) / (yMax - yMin)) * plotH;
                  return `${x},${y}`;
                });
                const polyPoints = points.join(' ');
                const firstX = padL;
                const lastX = padL + plotW;
                const polygonPoints = `${polyPoints} ${lastX},${padT + plotH} ${firstX},${padT + plotH}`;
                const gridYs = yLabels.map(v => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH);

                return (
                  <Svg width={chartW} height={chartH} style={{ alignSelf: 'center' }}>
                    <Defs>
                      <SvgLinearGradient id="mentorChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
                        <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
                      </SvgLinearGradient>
                    </Defs>
                    {gridYs.map((y, i) => (
                      <Line key={i} x1={padL} y1={y} x2={padL + plotW} y2={y}
                        stroke={colors.border} strokeWidth={1} strokeDasharray="4,4" />
                    ))}
                    <Polygon points={polygonPoints} fill="url(#mentorChartGrad)" />
                    <Polyline points={polyPoints} fill="none" stroke={colors.primary} strokeWidth={2} />
                  </Svg>
                );
              })()}
              <View style={styles.yLabelsOverlay}>
                {yLabels.map((val) => (
                  <Text key={val} style={[styles.yLabel, { color: colors.text.secondary }]}>{val}</Text>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* I3: Seva tab — styled consistently */}
        {activeTab === 'seva' && (
          <View>
            {MockData.sevaLogs.map((log, index) => (
              <Card key={index} variant="form" style={{ marginBottom: spacing.sm }}>
                <View style={styles.sevaHeader}>
                  <Text style={[styles.sevaDate, { color: colors.text.primary }]}>{log.date}</Text>
                  <Text style={[styles.sevaHours, { color: colors.primary }]}>{log.hours} hrs</Text>
                </View>
                <View style={[styles.departmentChip, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[styles.departmentText, { color: colors.primary }]}>{log.department.toUpperCase()}</Text>
                </View>
                <Text style={[styles.sevaDescription, { color: colors.text.secondary }]}>{log.description}</Text>
              </Card>
            ))}
          </View>
        )}

        {/* I3: Courses tab — styled consistently */}
        {activeTab === 'courses' && (
          <View>
            {MockData.courses.map((course, index) => (
              <Card key={index} variant="form" style={{ marginBottom: spacing.sm }}>
                <Text style={[styles.courseName, { color: colors.text.primary }]}>{course.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
                  <Text style={[styles.courseDate, { color: colors.text.secondary }]}>Submitted: {course.submitted}</Text>
                  <View style={[styles.statusBadge, {
                    backgroundColor: course.status === 'approved' ? `${colors.status.success}20` : `${colors.status.warning}20`
                  }]}>
                    <Text style={{
                      color: course.status === 'approved' ? colors.status.success : colors.status.warning,
                      ...typography.caption,
                      textTransform: 'capitalize',
                    }}>{course.status}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* I5: Attendance tab — includes session title */}
        {activeTab === 'attendance' && (
          <View>
            {MockData.menteeDetailAttendance.map((entry, index) => (
              <TouchableOpacity key={index} style={[styles.attendanceRow, { borderBottomColor: colors.border }]} onPress={() => openSessionFromAttendance(entry)}>
                <View>
                  <Text style={[styles.attendanceDateText, { color: colors.text.primary }]}>{entry.date}</Text>
                  <Text style={[styles.attendanceSessionText, { color: colors.text.secondary }]}>{entry.session}</Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: entry.status === 'present' ? `${colors.status.success}20` :
                    entry.status === 'late' ? `${colors.status.warning}20` : `${colors.status.error}20`
                }]}>
                  <Text style={{
                    color: entry.status === 'present' ? colors.status.success :
                      entry.status === 'late' ? colors.status.warning : colors.status.error,
                    ...typography.caption,
                    textTransform: 'capitalize',
                  }}>{entry.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'notes' && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={120}>
            <View>
              {notes.map((note, index) => (
                <View key={index} style={[styles.noteBubble, { backgroundColor: colors.background }]}>
                  <Text style={[styles.noteDate, { color: colors.text.secondary }]}>{note.date}</Text>
                  <Text style={[styles.noteText, { color: colors.text.primary }]}>{note.text}</Text>
                </View>
              ))}
              <View style={styles.noteInputArea}>
                <TextInput
                  style={[styles.noteInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text.primary }]}
                  placeholder="Type a private note..."
                  placeholderTextColor={colors.text.secondary}
                  value={noteText}
                  onChangeText={setNoteText}
                  onSubmitEditing={handleSendNote}
                />
                <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSendNote}>
                  <PaperPlaneRight size={18} color={colors.surface} weight="fill" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </ScrollView>

      {/* I9: Session detail sheet from attendance tab */}
      <BottomSheet ref={sessionDetailRef} snapPoints={['70%']} title="Session Details">
        {selectedSession && (
          <ScrollView>
            <Text style={[styles.sheetSessionTitle, { color: colors.text.primary }]}>{selectedSession.title}</Text>
            <View style={[styles.sessionModuleTag, { backgroundColor: `${colors.status.warning}20` }]}>
              <Text style={[styles.sessionModuleTagText, { color: colors.status.warning }]}>{selectedSession.module}</Text>
            </View>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Date</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>{selectedSession.date}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Description</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary, marginBottom: spacing.md }]}>{selectedSession.description}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Attendees</Text>
            {Object.entries(selectedSession.attendees).map(([name, status]) => (
              <View key={name} style={[styles.attendeeRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.attendeeName, { color: colors.text.primary }]}>{name}</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: status === 'present' ? `${colors.status.success}20` :
                    status === 'late' ? `${colors.status.warning}20` : `${colors.status.error}20`
                }]}>
                  <Text style={{
                    color: status === 'present' ? colors.status.success :
                      status === 'late' ? colors.status.warning : colors.status.error,
                    ...typography.caption,
                    textTransform: 'capitalize',
                  }}>{status}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Approvals Screen (§6.10) — J1: trailing border fix
// ═══════════════════════════════════════════════════════════

export const ApprovalsScreen = () => {
  const { colors } = useTheme();
  const approvalSheetRef = useRef(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalComment, setApprovalComment] = useState('');

  const openReview = (approval) => {
    setSelectedApproval(approval);
    setApprovalComment('');
    approvalSheetRef.current?.present();
  };

  const recentDecisions = [
    { name: 'Jaya Kumar', course: 'Bhakti Shastri Module 1', status: 'approved' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Pending Approvals</Text>

        {MockData.pendingApprovals.map((approval, index) => (
          <Card key={index} variant="form" style={styles.approvalCard}>
            <View style={styles.approvalHeader}>
              <View>
                <Text style={[styles.approvalName, { color: colors.text.primary }]}>{approval.menteeName}</Text>
                <Text style={[styles.approvalCourse, { color: colors.text.secondary }]}>
                  {approval.courseName} • {approval.submitted}
                </Text>
              </View>
            </View>
            <Button variant="secondary" style={styles.reviewButton} onPress={() => openReview(approval)}>
              Review
            </Button>
          </Card>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Decisions</Text>
        {recentDecisions.map((decision, index) => (
          <View key={index} style={[
            styles.decisionRow,
            { borderBottomColor: colors.border },
            index === recentDecisions.length - 1 && { borderBottomWidth: 0 },
          ]}>
            <View>
              <Text style={[styles.decisionName, { color: colors.text.primary }]}>{decision.name}</Text>
              <Text style={[styles.decisionCourse, { color: colors.text.secondary }]}>{decision.course}</Text>
            </View>
            <View style={[styles.decisionChip, { backgroundColor: `${colors.status.success}20` }]}>
              <Text style={{ color: colors.status.success, ...typography.caption }}>Approved</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomSheet ref={approvalSheetRef} snapPoints={['60%']} title="Review Submission">
        {selectedApproval && (
          <View>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Mentee</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>{selectedApproval.menteeName}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Course</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>{selectedApproval.courseName}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Submitted</Text>
            <Text style={[styles.sheetDetailValue, { color: colors.text.primary }]}>{selectedApproval.submitted}</Text>
            <Text style={[styles.sheetDetailLabel, { color: colors.text.secondary }]}>Comment</Text>
            <TextInput
              style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]}
              placeholder="Add a comment..."
              value={approvalComment}
              onChangeText={setApprovalComment}
              placeholderTextColor={colors.text.secondary}
            />
            <View style={styles.sheetButtonRow}>
              <Button variant="success" style={styles.sheetButton} onPress={() => approvalSheetRef.current?.dismiss()}>
                Approve
              </Button>
              <Button variant="destructive" style={styles.sheetButton} onPress={() => approvalSheetRef.current?.dismiss()}>
                Reject
              </Button>
            </View>
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Mentor Profile Screen
// ═══════════════════════════════════════════════════════════

export const MentorProfileScreen = ({ onLogout }) => {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.accent.peach }]}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.text.primary }]}>Syamasundara Das</Text>
        <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>syama@example.com</Text>
      </View>

      <View style={styles.profileDetails}>
        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Dark Mode</Text>
          <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
        </View>
        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Phone</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>+44 7700 900789</Text>
        </View>
        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Initiated</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>Yes — 2018</Text>
        </View>
        <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Spiritual Master</Text>
          <Text style={[styles.detailValue, { color: colors.text.primary }]}>HH Sivarama Swami</Text>
        </View>
      </View>

      <Button variant="secondary" style={styles.profileButton}>
        Edit Profile
      </Button>
      <Button variant="destructive" onPress={onLogout}>
        Log Out
      </Button>
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  screenTitle: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },

  // Dashboard
  birthdayBanner: {
    height: 48,
  },
  bannerText: {
    ...typography.body,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bannerBold: {
    ...typography.bodyBold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  metricValue: {
    ...typography.metric,
    fontSize: 32,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  attentionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attentionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontWeight: '600',
  },
  attentionName: {
    ...typography.bodyBold,
  },
  attentionReason: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  contactButton: {
    color: colors.primary,
    ...typography.body,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  batchName: {
    ...typography.subtitle,
  },
  batchSchedule: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  batchBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  batchAvatars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  viewLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  menteeAvatars: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarRingError: {
    borderColor: colors.status.error,
  },
  avatarRingSuccess: {
    borderColor: colors.status.success,
  },
  avatarRingWarning: {
    borderColor: colors.status.warning,
  },
  smallAvatarText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  nextSession: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // Batch Detail
  detailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...typography.body,
    marginLeft: spacing.xs,
  },
  removeUserText: {
    ...typography.caption,
    fontWeight: '600',
  },
  batchHeaderLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  batchTitle: {
    ...typography.display,
    fontSize: 28,
  },
  batchSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusChip: {
    backgroundColor: `${colors.status.success}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  statusChipText: {
    color: colors.status.success,
    ...typography.caption,
    fontWeight: '600',
  },
  reminderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  reminderText: {
    ...typography.caption,
    color: colors.primary,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  memberName: {
    ...typography.bodyBold,
  },
  memberStatus: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: radius.circle,
  },
  dotSuccess: {
    backgroundColor: colors.status.success,
  },
  dotWarning: {
    backgroundColor: colors.status.warning,
  },
  dotError: {
    backgroundColor: colors.status.error,
  },
  dotEmpty: {
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Sessions
  sessionNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sessionDateBoxes: {
    flexDirection: 'row',
    gap: 6,
  },
  sessionDateBox: {
    width: 44,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionDateMonth: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
  },
  sessionDateDay: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  sessionTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.xs,
  },
  sessionModuleTag: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.status.warning}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  sessionModuleTagText: {
    ...typography.caption,
    color: colors.status.warning,
    fontSize: 11,
  },
  sessionDescription: {
    ...typography.body,
    color: colors.text.secondary,
  },
  sheetSessionTitle: {
    ...typography.title,
    marginBottom: spacing.sm,
  },

  // Attendance Grid
  attendanceGrid: {
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridHeader: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  gridHeaderLeft: {
    width: 80,
    ...typography.caption,
    color: colors.text.secondary,
  },
  gridCell: {
    alignItems: 'center',
  },
  gridFixedCell: {
    height: 36,
    justifyContent: 'center',
  },
  gridCellLeft: {
    width: 80,
    ...typography.bodyBold,
    fontSize: 13,
  },
  moduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  moduleName: {
    ...typography.body,
    flex: 1,
  },
  moduleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moduleCompleted: {
    backgroundColor: `${colors.status.success}20`,
    borderColor: colors.status.success,
  },
  moduleActive: {
    backgroundColor: `${colors.status.warning}20`,
    borderColor: colors.status.warning,
  },
  moduleChipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  moduleCompletedText: {
    color: colors.status.success,
  },
  moduleActiveText: {
    color: colors.status.warning,
  },
  actionButtons: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  // History
  batchHistoryContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    ...typography.body,
    fontSize: 14,
  },
  historyDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // Edit Batch
  editMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editMemberName: {
    ...typography.body,
  },
  statusToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  statusToggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  statusToggleText: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // New Session
  moduleTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  moduleTag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  moduleTagText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  attendanceToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Module Sessions Sheet
  moduleSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  moduleSessionDate: {
    ...typography.caption,
    color: colors.text.secondary,
    width: 50,
  },
  moduleSessionTitle: {
    ...typography.body,
    flex: 1,
  },

  // Mentee Detail
  menteeHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  largeAvatar: {
    width: 72,
    height: 72,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  largeAvatarText: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '600',
  },
  menteeName: {
    ...typography.title,
  },
  menteeBatch: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  contactChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  // I1: icon + label on same line
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  whatsappChip: {
    backgroundColor: '#25D36620',
  },
  whatsappText: {
    color: '#25D366',
    ...typography.caption,
  },
  phoneChip: {
    backgroundColor: `${colors.status.info}20`,
  },
  phoneText: {
    color: colors.status.info,
    ...typography.caption,
  },
  emailChip: {
    backgroundColor: `${colors.text.secondary}20`,
  },
  emailText: {
    color: colors.text.secondary,
    ...typography.caption,
  },
  subTabStrip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  subTab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  subTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  subTabText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  subTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // I2: Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statChip: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statNumber: {
    ...typography.subtitle,
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },

  // Chart
  timescaleRowEmbedded: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  timescaleRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  timescaleOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  timescaleOptionActive: {
    backgroundColor: `${colors.primary}20`,
  },
  timescaleText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  timescaleTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  yLabelsOverlay: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    bottom: spacing.lg + 4,
    justifyContent: 'space-between',
  },
  yLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
  },

  // Seva
  sevaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sevaDate: {
    ...typography.body,
  },
  sevaHours: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  departmentChip: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  departmentText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  sevaDescription: {
    ...typography.body,
    color: colors.text.secondary,
  },

  // Courses
  courseName: {
    ...typography.bodyBold,
  },
  courseDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // Attendance (mentee detail)
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  attendanceDateText: {
    ...typography.body,
  },
  attendanceSessionText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  attendeeName: {
    ...typography.body,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },

  noteBubble: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noteDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  noteText: {
    ...typography.body,
  },
  noteInputArea: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  noteInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Approvals
  approvalCard: {
    marginBottom: spacing.md,
  },
  approvalHeader: {
    marginBottom: spacing.md,
  },
  approvalName: {
    ...typography.bodyBold,
  },
  approvalCourse: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  reviewButton: {
    height: 40,
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  decisionName: {
    ...typography.bodyBold,
  },
  decisionCourse: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  decisionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },

  // Profile
  profileHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  profileName: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
    color: colors.text.secondary,
  },
  profileDetails: {
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body,
  },
  profileButton: {
    marginBottom: spacing.sm,
  },

  // Bottom Sheet styles
  sheetDetailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  sheetDetailValue: {
    ...typography.body,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...typography.body,
    marginTop: spacing.sm,
  },
  sheetButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  sheetButton: {
    flex: 1,
  },
});
