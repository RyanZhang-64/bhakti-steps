/**
 * screens/AdminScreens.js
 * ──────────────────────────────────────────────────────────────
 * All Admin screens: Dashboard, Users, Batches, Settings
 * §6.11, §6.12, §6.13, §6.14
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
  Alert,
} from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { StepperControl } from '../components/StepperControl';
import { colors, spacing, typography, radius } from '../theme';
import { useTheme } from '../ThemeContext';
import { useToast } from '../components/Toast';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { MockData } from '../mockData';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { PaginatedScrollView } from '../components/PaginatedScrollView';
import {
  MagnifyingGlass,
  CaretRight,
  CaretDown,
  ArrowLeft,
  WarningCircle,
  UserPlus,
  Stack,
  CalendarCheck,
  Certificate,
  EnvelopeSimple,
  ShieldCheck,
} from 'phosphor-react-native';
import Svg, { Polyline, Polygon, Defs, LinearGradient as SvgLinearGradient, Stop, Line } from 'react-native-svg';
import { MenteeDetailScreen } from './MentorScreens';

// ═══════════════════════════════════════════════════════════
// Dashboard Screen (§6.11)
// ═══════════════════════════════════════════════════════════

export const AdminDashboardScreen = () => {
  const { colors } = useTheme();
  const showToast = useToast();
  const kpiSheetRef = useRef(null);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [pendingApps, setPendingApps] = useState([...MockData.pendingMentorApplications]);
  const [growthMetric, setGrowthMetric] = useState('users');

  const openKPIDrilldown = (kpiLabel) => {
    setSelectedKPI(kpiLabel);
    kpiSheetRef.current?.present();
  };

  const handleApproveApp = (app) => {
    Alert.alert(
      'Approve Mentor',
      `Approve ${app.name} as a mentor?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setPendingApps(prev => prev.filter(a => a.email !== app.email));
            showToast?.(`${app.name} approved as mentor`, 'success');
          },
        },
      ]
    );
  };

  const handleRejectApp = (app) => {
    Alert.alert(
      'Reject Application',
      `Reject ${app.name}'s mentor application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setPendingApps(prev => prev.filter(a => a.email !== app.email));
            showToast?.('Application rejected', 'success');
          },
        },
      ]
    );
  };

  const drilldown = selectedKPI ? MockData.adminKPIDrilldowns[selectedKPI] : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Platform KPIs</Text>

        <View style={styles.kpiGrid}>
          {MockData.adminKPIs.map((kpi, index) => (
            <Card key={index} variant="dashboard" style={styles.kpiCard} onPress={() => openKPIDrilldown(kpi.label)}>
              <Text style={[styles.kpiValue, { color: colors.text.primary }]}>{kpi.value}</Text>
              <Text style={[styles.kpiLabel, { color: colors.text.secondary }]}>{kpi.label}</Text>
              {kpi.trend && (
                <Text style={[
                  styles.kpiTrend,
                  kpi.trend === 'up' && styles.trendUp,
                  kpi.trend === 'flat' && styles.trendFlat,
                ]}>
                  {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'}{' '}
                  {kpi.trend === 'up' ? '8 this week' :
                   kpi.trend === 'flat' ? 'Flat' : 'Decreasing'}
                </Text>
              )}
              {kpi.subtitle && (
                <Text style={[styles.kpiSubtitle, { color: colors.text.secondary }]}>{kpi.subtitle}</Text>
              )}
              {kpi.pending && (
                <Text style={[styles.kpiPending, { color: colors.status.warning }]}>{kpi.pending} pending</Text>
              )}
            </Card>
          ))}
        </View>

        {/* Growth Chart */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: spacing.xl }]}>Growth</Text>
        <Card variant="dashboard" style={{ marginBottom: spacing.md }}>
          {/* Toggle */}
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.md }}>
            {['users', 'submissions'].map(m => (
              <TouchableOpacity
                key={m}
                style={{ flex: 1, paddingVertical: spacing.sm, backgroundColor: growthMetric === m ? colors.primary : 'transparent', alignItems: 'center' }}
                onPress={() => setGrowthMetric(m)}
              >
                <Text style={[typography.caption, { fontWeight: '600', color: growthMetric === m ? colors.surface : colors.text.primary }]}>
                  {m === 'users' ? 'Active Users' : 'Submission Rate %'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* SVG Chart */}
          {(() => {
            const gd = MockData.adminGrowthData;
            const data = growthMetric === 'users' ? gd.activeUsers : gd.submissionRate;
            const W = 280, H = 120, px = 10, py = 10;
            const maxVal = Math.max(...data) * 1.1;
            const minVal = Math.min(...data) * 0.9;
            const points = data.map((v, i) => {
              const x = px + (i / (data.length - 1)) * (W - 2 * px);
              const y = py + (1 - (v - minVal) / (maxVal - minVal)) * (H - 2 * py);
              return `${x},${y}`;
            }).join(' ');
            const polyPts = `${px},${H - py} ${points} ${W - px},${H - py}`;
            return (
              <View style={{ alignItems: 'center' }}>
                <Svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`}>
                  <Defs>
                    <SvgLinearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
                      <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
                    </SvgLinearGradient>
                  </Defs>
                  {[0, 1, 2].map(i => (
                    <Line key={i} x1={px} y1={py + i * ((H - 2 * py) / 2)} x2={W - px} y2={py + i * ((H - 2 * py) / 2)} stroke={colors.border} strokeWidth="0.5" />
                  ))}
                  <Polygon points={polyPts} fill="url(#adminGrad)" />
                  <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth="2" />
                </Svg>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: W, paddingHorizontal: px }}>
                  {gd.labels.map((l, i) => (
                    <Text key={i} style={[typography.caption, { color: colors.text.secondary, fontSize: 10 }]}>{l}</Text>
                  ))}
                </View>
              </View>
            );
          })()}
        </Card>

        {/* Pending Mentor Applications */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: spacing.xl }]}>
          Pending Mentor Applications ({pendingApps.length})
        </Text>
        {pendingApps.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No pending applications</Text>
        ) : (
          pendingApps.map((app, index) => (
            <Card key={index} variant="attention" style={styles.applicationCard}>
              <View style={styles.appHeader}>
                <Text style={[styles.appName, { color: colors.text.primary }]}>{app.name}</Text>
                <Text style={[styles.appDate, { color: colors.text.secondary }]}>Applied {app.appliedDate}</Text>
              </View>
              <Text style={[styles.appReason, { color: colors.text.secondary }]}>{app.reason}</Text>
              <View style={styles.appActions}>
                <Button variant="destructive" style={styles.appBtn} onPress={() => handleRejectApp(app)}>
                  Reject
                </Button>
                <Button variant="primary" style={styles.appBtn} onPress={() => handleApproveApp(app)}>
                  Approve
                </Button>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <BottomSheet ref={kpiSheetRef} snapPoints={['55%']} title={selectedKPI}>
        {drilldown && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[styles.sheetLabel, { color: colors.text.secondary, marginTop: 0 }]}>Breakdown</Text>
            <Card variant="form" style={{ marginTop: spacing.sm }}>
              {drilldown.breakdown.map((item, i) => (
                <View key={i} style={[
                  styles.breakdownRow,
                  { borderBottomColor: colors.border },
                  i === drilldown.breakdown.length - 1 && { borderBottomWidth: 0 },
                ]}>
                  <Text style={[styles.breakdownLabel, { color: colors.text.primary }]}>{item.label}</Text>
                  <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>{item.value}</Text>
                </View>
              ))}
            </Card>

            <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Recent</Text>
            {drilldown.recent.map((item, i) => (
              <View key={i} style={[styles.recentRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recentName, { color: colors.text.primary }]}>{item.name}</Text>
                  <Text style={[styles.recentAction, { color: colors.text.secondary }]}>{item.action}</Text>
                </View>
                <Text style={[styles.recentDate, { color: colors.text.secondary }]}>{item.date}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Users Screen (§6.12)
// ═══════════════════════════════════════════════════════════

export const UsersScreen = ({ onNavigate }) => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filters = ['All', 'Mentors', 'Mentees', 'Pending'];

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return styles.roleAdmin;
      case 'mentor':
        return styles.roleMentor;
      case 'mentee':
        return styles.roleMentee;
      default:
        return {};
    }
  };

  const filteredUsers = MockData.adminUsers.filter((user) => {
    const matchesSearch = !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' ||
      (filter === 'Mentors' && user.roles.includes('mentor')) ||
      (filter === 'Mentees' && user.roles.includes('mentee')) ||
      (filter === 'Pending' && user.status === 'pending');
    return matchesSearch && matchesFilter;
  });
  const { data: paginatedUsers, hasMore: usersHasMore, loadMore: loadMoreUsers } = usePaginatedList(filteredUsers, { initialCount: 30, pageSize: 10 });

  return (
    <PaginatedScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} hasMore={usersHasMore} onLoadMore={loadMoreUsers}>
      <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Users</Text>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MagnifyingGlass size={20} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search by name or email..."
          placeholderTextColor={colors.text.secondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterScroll}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }, filter === f && { backgroundColor: colors.accent.peach, borderColor: colors.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText, { color: colors.text.secondary },
              filter === f && { color: colors.primary, fontWeight: '600' }
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      {paginatedUsers.map((user, index) => (
        <TouchableOpacity key={index} style={[styles.userRow, { borderBottomColor: colors.border }]} onPress={() => onNavigate?.('adminUserDetail')}>
          <View style={styles.userLeft}>
            <View style={[styles.avatar, { backgroundColor: user.status === 'pending' ? colors.primaryPressed : colors.accent.peach }]}>
              <Text style={[styles.avatarText, { color: colors.surface }]}>{user.name[0]}</Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
              <Text style={[styles.userEmail, { color: colors.text.secondary }]}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.userRight}>
            {user.status === 'pending' ? (
              <Text style={[styles.lastActive, { color: colors.status.warning }]}>Pending</Text>
            ) : (
              <Text style={[styles.lastActive, { color: colors.text.secondary }]}>{user.lastActive}</Text>
            )}
            <View style={styles.roleChipsRow}>
              {user.roles.map((role) => (
                <View key={role} style={[styles.roleChip, getRoleStyle(role)]}>
                  <Text style={[styles.roleText, { color: colors.text.primary }]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <Button variant="primary" style={styles.inviteButton}>
        Invite Mentor
      </Button>
    </PaginatedScrollView>
  );
};

// ═══════════════════════════════════════════════════════════
// Admin User Detail Screen — reuses MenteeDetailScreen
// ═══════════════════════════════════════════════════════════

export const AdminUserDetailScreen = ({ onBack }) => {
  const { colors } = useTheme();
  const showToast = useToast();
  const reassignSheetRef = useRef(null);
  // For demo, use first mentor from adminUsers
  const [userRoles, setUserRoles] = useState(MockData.adminUsers[0].roles);
  const isAdmin = userRoles.includes('admin');
  const isMentee = userRoles.includes('mentee');

  const handleRemoveUser = () => {
    Alert.alert(
      'Remove User',
      'Are you sure you want to remove this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            showToast?.('User removed', 'success');
            onBack();
          },
        },
      ]
    );
  };

  const handleDemoteFromAdmin = () => {
    Alert.alert(
      'Remove Admin Role',
      'Remove admin privileges from this user? They will keep their other roles.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setUserRoles(prev => prev.filter(r => r !== 'admin'));
            showToast?.('Admin role removed', 'success');
          },
        },
      ]
    );
  };

  const handleReassign = (batch) => {
    Alert.alert(
      'Reassign Batch',
      `Reassign this user to "${batch.name}" (Mentor: ${batch.mentor})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reassign',
          onPress: () => {
            reassignSheetRef.current?.dismiss();
            showToast?.(`Reassigned to ${batch.name}`, 'success');
          },
        },
      ]
    );
  };

  const headerExtra = (
    <View style={styles.roleActions}>
      {isAdmin && (
        <TouchableOpacity onPress={handleDemoteFromAdmin}>
          <Text style={[styles.roleActionText, { color: colors.status.warning }]}>Demote from Admin</Text>
        </TouchableOpacity>
      )}
      {isMentee && (
        <TouchableOpacity onPress={() => reassignSheetRef.current?.present()} style={{ marginTop: spacing.xs }}>
          <Text style={[styles.roleActionText, { color: colors.primary }]}>Reassign Batch</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <MenteeDetailScreen onBack={onBack} onRemoveUser={handleRemoveUser} headerExtra={headerExtra} />
      <BottomSheet ref={reassignSheetRef} snapPoints={['50%']} title="Reassign to Batch">
        <ScrollView>
          <Text style={[typography.caption, { color: colors.text.secondary, marginBottom: spacing.md }]}>Select a batch to reassign this user:</Text>
          {MockData.adminBatchOptions.map(batch => (
            <TouchableOpacity
              key={batch.id}
              style={[styles.reassignRow, { borderBottomColor: colors.border }]}
              onPress={() => handleReassign(batch)}
            >
              <View>
                <Text style={[typography.body, { color: colors.text.primary, fontWeight: '600' }]}>{batch.name}</Text>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>Mentor: {batch.mentor}</Text>
              </View>
              <CaretRight size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// Batch Oversight Screen (§6.13)
// ═══════════════════════════════════════════════════════════

export const BatchOversightScreen = () => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Active', 'Pending Approval', 'Inactive'];
  const batchApprovalRef = useRef(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredBatches = MockData.adminBatches.filter((batch) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return batch.status === 'active';
    if (filter === 'Pending Approval') return batch.status === 'pending';
    return false;
  });

  const openBatchApproval = (batch) => {
    setSelectedBatch(batch);
    setAdminNote('');
    batchApprovalRef.current?.present();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Batch Oversight</Text>

      {/* Filters */}
      <View style={styles.filterScroll}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }, filter === f && { backgroundColor: colors.accent.peach, borderColor: colors.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText, { color: colors.text.secondary },
              filter === f && { color: colors.primary, fontWeight: '600' }
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Batch List */}
      {filteredBatches.map((batch, index) => (
        <Card
          key={index}
          variant={batch.status === 'pending' ? 'attention' : 'form'}
          style={styles.batchCard}
          onPress={batch.status === 'pending' ? () => openBatchApproval(batch) : undefined}
        >
          <View style={styles.batchHeader}>
            <Text style={[styles.batchName, { color: colors.text.primary }]}>{batch.name}</Text>
            <View style={[
              styles.statusChip, { borderColor: colors.border },
              batch.status === 'active' && { backgroundColor: `${colors.status.success}20`, borderColor: colors.status.success },
              batch.status === 'pending' && { backgroundColor: `${colors.status.warning}20`, borderColor: colors.status.warning },
            ]}>
              <Text style={[
                styles.statusText, { color: colors.text.secondary },
                batch.status === 'active' && { color: colors.status.success },
                batch.status === 'pending' && { color: colors.status.warning },
              ]}>
                {batch.status === 'active' ? 'Active' : 'Pending'}
              </Text>
            </View>
          </View>
          <Text style={[styles.batchMeta, { color: colors.text.secondary }]}>
            Mentor: {batch.mentor} • {' '}
            {batch.status === 'pending'
              ? `Expected: ${batch.expected}`
              : `${batch.menteeCount} Mentees • Last: 20 Feb`}
          </Text>
        </Card>
      ))}
    </ScrollView>

    <BottomSheet ref={batchApprovalRef} snapPoints={['60%']} title="Batch Approval">
      {selectedBatch && (
        <View>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Batch</Text>
          <Text style={[styles.sheetValue, { color: colors.text.primary }]}>{selectedBatch.name}</Text>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Mentor</Text>
          <Text style={[styles.sheetValue, { color: colors.text.primary }]}>{selectedBatch.mentor}</Text>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Expected Start</Text>
          <Text style={[styles.sheetValue, { color: colors.text.primary }]}>{selectedBatch.expected}</Text>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Admin Note</Text>
          <TextInput
            style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]}
            placeholder="Add a note..."
            value={adminNote}
            onChangeText={setAdminNote}
            placeholderTextColor={colors.text.secondary}
          />
          <View style={styles.sheetButtonRow}>
            <Button variant="success" style={styles.sheetBtn} onPress={() => batchApprovalRef.current?.dismiss()}>
              Approve
            </Button>
            <Button variant="destructive" style={styles.sheetBtn} onPress={() => batchApprovalRef.current?.dismiss()}>
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
// Settings Screen (§6.14)
// ═══════════════════════════════════════════════════════════

export const SettingsScreen = ({ onLogout, onNavigate }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const showToast = useToast();
  const settingsItems = [
    'Service Departments',
    'Course Categories',
    'Spiritual Masters',
    'Prabhupada Books',
    'Courses',
    'Curriculum Modules',
  ];

  const settingsSheetRef = useRef(null);
  const scoringSheetRef = useRef(null);
  const [selectedSettingKey, setSelectedSettingKey] = useState(null);
  const [settingsList, setSettingsList] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [scoringConfig, setScoringConfig] = useState({ ...MockData.sadhanaScoring });
  const scoringTotal = scoringConfig.roundsWeight + scoringConfig.morningProgrammeWeight + scoringConfig.bookReadingWeight + scoringConfig.moodWeight + scoringConfig.sevaWeight;

  const openSettingsList = (key) => {
    setSelectedSettingKey(key);
    setSettingsList([...MockData.adminSettingsLists[key]]);
    setNewItemText('');
    settingsSheetRef.current?.present();
  };

  const handleAddItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    Alert.alert(
      'Add Item',
      `Add "${trimmed}" to ${selectedSettingKey}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            setSettingsList(prev => [{ name: trimmed, active: true }, ...prev]);
            setNewItemText('');
            showToast?.(`Added "${trimmed}"`, 'success');
          },
        },
      ]
    );
  };

  const handleToggleItem = (itemName) => {
    setSettingsList(prev => prev.map(i =>
      i.name === itemName ? { ...i, active: !i.active } : i
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Settings</Text>

        <Card variant="form" style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingsRow, { borderBottomColor: colors.border },
                index === settingsItems.length - 1 && styles.settingsRowLast,
              ]}
              onPress={() => openSettingsList(item)}
            >
              <Text style={[styles.settingsText, { color: colors.text.primary }]}>{item}</Text>
              <CaretRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Sadhana Scoring Config */}
        <Card variant="form" style={styles.settingsCard}>
          <TouchableOpacity
            style={[styles.settingsRow, styles.settingsRowLast]}
            onPress={() => scoringSheetRef.current?.present()}
          >
            <Text style={[styles.settingsText, { color: colors.text.primary }]}>Sadhana Scoring</Text>
            <CaretRight size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </Card>

        {/* Data Manager */}
        <Card variant="form" style={styles.settingsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: spacing.sm }]}>Data Manager</Text>
          {MockData.adminTableNames.map((tableName, idx) => (
            <TouchableOpacity
              key={tableName}
              style={[styles.settingsRow, idx === MockData.adminTableNames.length - 1 && styles.settingsRowLast, { borderBottomColor: colors.border }]}
              onPress={() => onNavigate?.('dataEditor', tableName)}
            >
              <Text style={[styles.settingsText, { color: colors.text.primary }]}>{tableName}</Text>
              <CaretRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </Card>

        <Card variant="form" style={styles.settingsCard}>
          <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingsText, { color: colors.text.primary }]}>Dark Mode</Text>
            <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
          </View>
          <TouchableOpacity style={[styles.settingsRow, { borderBottomColor: colors.border }]} onPress={() => onNavigate?.('auditLog')}>
            <Text style={[styles.settingsText, { color: colors.text.primary }]}>Audit Log</Text>
            <CaretRight size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingsText, { color: colors.text.primary }]}>Notification Preferences</Text>
            <CaretRight size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingsRow, styles.settingsRowLast]} onPress={onLogout}>
            <Text style={[styles.settingsText, { color: colors.status.error }]}>Log Out</Text>
            <CaretRight size={20} color={colors.status.error} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <BottomSheet ref={settingsSheetRef} snapPoints={['75%']} title={selectedSettingKey}>
        <View style={styles.addItemRow}>
          <TextInput
            style={[styles.addItemInput, { borderColor: colors.border, color: colors.text.primary, backgroundColor: colors.background }]}
            placeholder="Add new item..."
            placeholderTextColor={colors.text.secondary}
            value={newItemText}
            onChangeText={setNewItemText}
            onSubmitEditing={handleAddItem}
          />
          <Button variant="primary" style={styles.addItemButton} onPress={handleAddItem}>
            + Add
          </Button>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {selectedSettingKey === 'Prabhupada Books' ? (() => {
            const sbItems = settingsList.filter(i => i.name.startsWith('SB '));
            const ccItems = settingsList.filter(i => i.name.startsWith('CC '));
            const standalone = settingsList.filter(i => !i.name.startsWith('SB ') && !i.name.startsWith('CC '));
            const groups = [
              { name: 'Srimad Bhagavatam', items: sbItems },
              { name: 'Caitanya-caritamrta', items: ccItems },
            ];

            return (
              <>
                {standalone.map((item, index) => (
                  <View key={index} style={[styles.listItemRow, { borderBottomColor: colors.border, opacity: item.active ? 1 : 0.4 }]}>
                    <Text style={[styles.listItemText, { color: colors.text.primary }]} numberOfLines={1}>{item.name}</Text>
                    <ToggleSwitch value={item.active} onValueChange={() => handleToggleItem(item.name)} />
                  </View>
                ))}
                {groups.map((group) => (
                  <React.Fragment key={group.name}>
                    <TouchableOpacity
                      style={[styles.settingsCollectionBand, { backgroundColor: colors.surface }]}
                      onPress={() => setExpandedGroups(prev => ({ ...prev, [group.name]: !prev[group.name] }))}
                      activeOpacity={0.7}
                    >
                      {expandedGroups[group.name]
                        ? <CaretDown size={18} color={colors.text.secondary} />
                        : <CaretRight size={18} color={colors.text.secondary} />
                      }
                      <Text style={[styles.settingsCollectionName, { color: colors.text.primary }]}>{group.name}</Text>
                      <Text style={[styles.settingsCollectionCount, { color: colors.text.secondary }]}>
                        {group.items.length} volumes
                      </Text>
                    </TouchableOpacity>
                    {expandedGroups[group.name] && group.items.map((item, idx) => (
                      <View key={idx} style={[styles.listItemRow, { borderBottomColor: colors.border, marginLeft: spacing.xl, opacity: item.active ? 1 : 0.4 }]}>
                        <Text style={[styles.listItemText, { color: colors.text.primary }]} numberOfLines={1}>{item.name}</Text>
                        <ToggleSwitch value={item.active} onValueChange={() => handleToggleItem(item.name)} />
                      </View>
                    ))}
                  </React.Fragment>
                ))}
              </>
            );
          })() : (
            settingsList.map((item, index) => (
              <View key={index} style={[styles.listItemRow, { borderBottomColor: colors.border, opacity: item.active ? 1 : 0.4 }]}>
                <Text style={[styles.listItemText, { color: colors.text.primary }]} numberOfLines={1}>{item.name}</Text>
                <ToggleSwitch value={item.active} onValueChange={() => handleToggleItem(item.name)} />
              </View>
            ))
          )}
        </ScrollView>
      </BottomSheet>

      <BottomSheet ref={scoringSheetRef} snapPoints={['80%']} title="Sadhana Scoring">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <Text style={{ ...typography.caption, color: scoringTotal === 100 ? colors.status.success : colors.status.error, fontWeight: '600' }}>
              Total Weight: {scoringTotal}% {scoringTotal !== 100 ? '(must equal 100%)' : '✓'}
            </Text>
          </View>
          {[
            { key: 'roundsWeight', label: 'Japa Rounds' },
            { key: 'morningProgrammeWeight', label: 'Morning Programme' },
            { key: 'bookReadingWeight', label: 'Book Reading' },
            { key: 'moodWeight', label: 'Mood' },
            { key: 'sevaWeight', label: 'Seva (optional)' },
          ].map(({ key, label }) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ ...typography.body, color: colors.text.primary, flex: 1 }}>{label}</Text>
              <StepperControl value={scoringConfig[key]} onValueChange={(v) => setScoringConfig(prev => ({ ...prev, [key]: v }))} min={0} max={100} step={5} />
              <Text style={{ ...typography.caption, color: colors.text.secondary, width: 30, textAlign: 'right' }}>{scoringConfig[key]}%</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, marginTop: spacing.md }}>
            <Text style={{ ...typography.body, color: colors.text.primary, flex: 1 }}>Book Reading Target</Text>
            <StepperControl value={scoringConfig.bookReadingTargetMinutes} onValueChange={(v) => setScoringConfig(prev => ({ ...prev, bookReadingTargetMinutes: v }))} min={5} max={120} step={5} />
            <Text style={{ ...typography.caption, color: colors.text.secondary, width: 36, textAlign: 'right' }}>{scoringConfig.bookReadingTargetMinutes}m</Text>
          </View>
          <Button variant="primary" style={{ marginTop: spacing.xl }} onPress={() => {
            showToast?.('Scoring configuration saved', 'success');
            scoringSheetRef.current?.dismiss();
          }}>
            Save
          </Button>
          <View style={{ height: 40 }} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Data Editor Screen
// ═══════════════════════════════════════════════════════════

export const DataEditorScreen = ({ onBack, tableName }) => {
  const { colors } = useTheme();
  const showToast = useToast();
  const editSheetRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [tableData, setTableData] = useState([...(MockData.adminTableData[tableName] || [])]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editValues, setEditValues] = useState({});
  const fields = MockData.adminTableFields[tableName] || [];

  const filtered = tableData.filter(record => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return fields.some(f => String(record[f.key] || '').toLowerCase().includes(q));
  });

  const openEdit = (record) => {
    setEditingRecord(record);
    setEditValues({ ...record });
    editSheetRef.current?.present();
  };

  const handleSave = () => {
    setTableData(prev => prev.map(r => r.id === editingRecord.id ? { ...editValues } : r));
    editSheetRef.current?.dismiss();
    showToast?.('Record updated', 'success');
  };

  const renderEditField = (field) => {
    if (!field.editable) {
      return (
        <View key={field.key} style={{ marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }]}>{field.label}</Text>
          <Text style={[typography.body, { color: colors.text.secondary }]}>{String(editValues[field.key] ?? '')}</Text>
        </View>
      );
    }
    if (field.type === 'boolean') {
      return (
        <View key={field.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '600' }]}>{field.label}</Text>
          <ToggleSwitch value={!!editValues[field.key]} onValueChange={(v) => setEditValues(prev => ({ ...prev, [field.key]: v }))} />
        </View>
      );
    }
    if (field.type === 'select') {
      return (
        <View key={field.key} style={{ marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }]}>{field.label}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
            {field.options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.filterChip, { backgroundColor: editValues[field.key] === opt ? colors.primary : colors.surface, borderColor: colors.border }]}
                onPress={() => setEditValues(prev => ({ ...prev, [field.key]: opt }))}
              >
                <Text style={[typography.caption, { color: editValues[field.key] === opt ? colors.surface : colors.text.primary }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    if (field.type === 'number') {
      return (
        <View key={field.key} style={{ marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }]}>{field.label}</Text>
          <View style={{ alignItems: 'flex-start' }}>
            <StepperControl
              value={editValues[field.key] || 0}
              onValueChange={(v) => setEditValues(prev => ({ ...prev, [field.key]: v }))}
              min={field.min || 0}
              max={field.max || 999}
            />
          </View>
        </View>
      );
    }
    // Default: text input
    return (
      <View key={field.key} style={{ marginBottom: spacing.md }}>
        <Text style={[typography.caption, { color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.xs }]}>{field.label}</Text>
        <TextInput
          style={[styles.searchInput, { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.text.primary, backgroundColor: colors.surface }]}
          value={String(editValues[field.key] ?? '')}
          onChangeText={(v) => setEditValues(prev => ({ ...prev, [field.key]: v }))}
          placeholderTextColor={colors.text.secondary}
        />
      </View>
    );
  };

  // Summary columns: show first 2-3 key fields
  const summaryFields = fields.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.drillDownHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.drillDownTitle, { color: colors.text.primary }]}>{tableName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: spacing.md, marginBottom: spacing.sm }]}>
        <MagnifyingGlass size={18} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search records..."
          placeholderTextColor={colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}>
        {filtered.map(record => (
          <TouchableOpacity key={record.id} onPress={() => openEdit(record)}>
            <Card variant="form" style={{ marginBottom: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  {summaryFields.map(f => (
                    <Text key={f.key} style={[f === summaryFields[0] ? { ...typography.body, fontWeight: '600' } : typography.caption, { color: f === summaryFields[0] ? colors.text.primary : colors.text.secondary }]}>
                      {f.label}: {String(record[f.key] ?? '')}
                    </Text>
                  ))}
                </View>
                <CaretRight size={18} color={colors.text.secondary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <Text style={[typography.body, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xl }]}>No records found</Text>
        )}
      </ScrollView>

      <BottomSheet ref={editSheetRef} snapPoints={['75%']} title="Edit Record">
        {editingRecord && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: spacing.xl }}>
            {fields.map(renderEditField)}
            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
              <Button variant="secondary" style={{ flex: 1 }} onPress={() => editSheetRef.current?.dismiss()}>
                Cancel
              </Button>
              <Button variant="primary" style={{ flex: 1 }} onPress={handleSave}>
                Save
              </Button>
            </View>
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Audit Log Screen
// ═══════════════════════════════════════════════════════════

const AUDIT_TYPE_ICONS = {
  user: UserPlus,
  batch: Stack,
  attendance: CalendarCheck,
  course: Certificate,
  invite: EnvelopeSimple,
  role: ShieldCheck,
};
const AUDIT_FILTER_CHIPS = ['All', 'User', 'Batch', 'Attendance', 'Course', 'Invite', 'Role'];

export const AuditLogScreen = ({ onBack }) => {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = MockData.auditLog.filter(entry => {
    if (activeFilter !== 'All' && entry.type !== activeFilter.toLowerCase()) return false;
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      return entry.actor.toLowerCase().includes(q) || entry.target.toLowerCase().includes(q) || entry.action.toLowerCase().includes(q);
    }
    return true;
  });
  const { data: paginatedAudit, hasMore: auditHasMore, loadMore: loadMoreAudit } = usePaginatedList(filtered, { initialCount: 30, pageSize: 10 });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.drillDownHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.drillDownTitle, { color: colors.text.primary }]}>Audit Log</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Read-only banner */}
      <View style={{ backgroundColor: `${colors.primary}10`, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginHorizontal: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm }}>
        <Text style={[typography.caption, { color: colors.primary, textAlign: 'center' }]}>Audit entries are read-only</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: spacing.md, marginBottom: spacing.sm }]}>
        <MagnifyingGlass size={18} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search by actor or target..."
          placeholderTextColor={colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 40, marginBottom: spacing.sm, paddingHorizontal: spacing.md }}>
        {AUDIT_FILTER_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            style={[styles.filterChip, { backgroundColor: activeFilter === chip ? colors.primary : colors.surface, borderColor: colors.border, marginRight: spacing.xs }]}
            onPress={() => setActiveFilter(chip)}
          >
            <Text style={[typography.caption, { color: activeFilter === chip ? colors.surface : colors.text.primary }]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Entries */}
      <PaginatedScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }} hasMore={auditHasMore} onLoadMore={loadMoreAudit}>
        {paginatedAudit.map(entry => {
          const IconComp = AUDIT_TYPE_ICONS[entry.type] || ShieldCheck;
          return (
            <View key={entry.id} style={[styles.auditRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.auditIcon, { backgroundColor: `${colors.primary}10` }]}>
                <IconComp size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.body, { color: colors.text.primary }]}>
                  <Text style={{ fontWeight: '600' }}>{entry.actor}</Text> {entry.action}
                </Text>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>{entry.target}</Text>
              </View>
              <Text style={[typography.caption, { color: colors.text.secondary, textAlign: 'right', minWidth: 80 }]}>{entry.date.split(', ')[0]}</Text>
            </View>
          );
        })}
        {paginatedAudit.length === 0 && (
          <Text style={[typography.body, { color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xl }]}>No matching entries</Text>
        )}
      </PaginatedScrollView>
    </View>
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
  },

  // Dashboard
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  kpiCard: {
    width: '47%',
    alignItems: 'center',
    padding: spacing.md,
  },
  kpiValue: {
    ...typography.metric,
    fontSize: 32,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  kpiTrend: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontSize: 11,
  },
  trendUp: {
    color: colors.status.success,
  },
  trendFlat: {
    color: colors.text.secondary,
  },
  kpiSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontSize: 11,
  },
  kpiPending: {
    ...typography.caption,
    color: colors.status.warning,
    marginTop: spacing.xs,
    fontSize: 11,
  },

  // Users
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.accent.peach,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  userName: {
    ...typography.bodyBold,
  },
  userEmail: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  userRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  lastActive: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
  },
  roleChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  roleAdmin: {
    backgroundColor: `${colors.primary}20`,
  },
  roleMentor: {
    backgroundColor: `${colors.status.warning}20`,
  },
  roleMentee: {
    backgroundColor: `${colors.status.success}20`,
  },
  roleText: {
    ...typography.overline,
    fontSize: 10,
  },
  roleChipsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  inviteButton: {
    marginTop: spacing.xl,
  },

  // Batches
  batchCard: {
    marginBottom: spacing.md,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  batchName: {
    ...typography.subtitle,
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusActive: {
    backgroundColor: `${colors.status.success}20`,
    borderColor: colors.status.success,
  },
  statusPending: {
    backgroundColor: `${colors.status.warning}20`,
    borderColor: colors.status.warning,
  },
  statusText: {
    ...typography.caption,
  },
  statusActiveText: {
    color: colors.status.success,
  },
  statusPendingText: {
    color: colors.status.warning,
  },
  batchMeta: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // Settings
  settingsCard: {
    marginBottom: spacing.lg,
    padding: 0,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsText: {
    ...typography.body,
    fontWeight: '600',
  },
  logoutText: {
    color: colors.status.error,
  },

  // Settings List Manager
  addItemRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  addItemInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    ...typography.body,
  },
  addItemButton: {
    height: 44,
    paddingHorizontal: spacing.md,
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  listItemText: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.md,
  },

  // KPI Drill-down Sheet
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  breakdownLabel: {
    ...typography.body,
  },
  breakdownValue: {
    ...typography.bodyBold,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  recentName: {
    ...typography.bodyBold,
  },
  recentAction: {
    ...typography.caption,
    marginTop: 2,
  },
  recentDate: {
    ...typography.caption,
    fontSize: 11,
  },

  // Bottom Sheet styles
  sheetLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  sheetValue: {
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
  sheetBtn: {
    flex: 1,
  },

  // Pending Applications
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  applicationCard: {
    marginBottom: spacing.md,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    ...typography.bodyBold,
  },
  appDate: {
    ...typography.caption,
    fontSize: 11,
  },
  appReason: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  appActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  appBtn: {
    flex: 1,
    height: 40,
  },

  // Role Management
  roleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  roleActionText: {
    ...typography.caption,
    fontWeight: '600',
  },

  // Settings Collection Bands
  settingsCollectionBand: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  settingsCollectionName: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginLeft: spacing.sm,
  },
  settingsCollectionCount: {
    ...typography.caption,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  auditIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  reassignRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
});
