/**
 * App.js
 * ──────────────────────────────────────────────────────────────
 * Main entry point for Bhakti Steps React Native app.
 * Handles role switching, tab navigation, and screen rendering.
 * ──────────────────────────────────────────────────────────────
 */

// Initialize Supabase client
import { initApiClient } from './src/api/client';
initApiClient();

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
// Theme
import { ThemeProvider, useTheme } from './src/ThemeContext';
// Theme
// Components
import { HeaderBand } from './src/components/HeaderBand';
import { BottomTabBar } from './src/components/BottomTabBar';
import { BottomSheet } from './src/components/BottomSheet';
import { ToastProvider } from './src/components/Toast';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { TodayScreen, ProgressScreen, SevaBooksScreen, ProfileScreen } from './src/screens/MenteeScreens';
import {
  MentorDashboardScreen,
  BatchesListScreen,
  BatchDetailScreen,
  MenteeDetailScreen,
  ApprovalsScreen,
  MentorProfileScreen,
  MentorSadhanaScreen,
} from './src/screens/MentorScreens';
import {
  AdminDashboardScreen,
  UsersScreen,
  BatchOversightScreen,
  SettingsScreen,
  AdminUserDetailScreen,
  AuditLogScreen,
} from './src/screens/AdminScreens';

// Data
import { MockData } from './src/mockData';
import { SadhanaService, CourseService } from './src/api';

// ═══════════════════════════════════════════════════════════
// Animated Tab Layer — smooth fade transitions
// ═══════════════════════════════════════════════════════════

const AnimatedTabLayer = ({ isActive, children }) => {
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[styles.tabLayer, { opacity }]}
      pointerEvents={isActive ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════
// Screen map for each role
// ═══════════════════════════════════════════════════════════

const MENTEE_SCREENS = {
  today: TodayScreen,
  progress: ProgressScreen,
  seva: SevaBooksScreen,
  profile: ProfileScreen,
};

const MENTOR_SCREENS = {
  sadhana: MentorSadhanaScreen,
  dashboard: MentorDashboardScreen,
  batches: BatchesListScreen,
  approvals: ApprovalsScreen,
  profile: MentorProfileScreen,
};

const ADMIN_SCREENS = {
  dashboard: AdminDashboardScreen,
  users: UsersScreen,
  batches: BatchOversightScreen,
  settings: SettingsScreen,
};

const ROLE_SCREENS = {
  mentee: MENTEE_SCREENS,
  mentor: MENTOR_SCREENS,
  admin: ADMIN_SCREENS,
};

// ═══════════════════════════════════════════════════════════
// App Content (inside ThemeProvider)
// ═══════════════════════════════════════════════════════════

function AppContent() {
  const { isDark, colors } = useTheme();
  const [loggedInAccount, setLoggedInAccount] = useState(null);
  const [authScreen, setAuthScreen] = useState('login');
  const [inviteToken, setInviteToken] = useState(null);
  const [currentRole, setCurrentRole] = useState('mentee');
  const [currentTab, setCurrentTab] = useState('today');
  const [drillDownScreen, setDrillDownScreen] = useState(null);
  const [drillDownData, setDrillDownData] = useState(null);
  const notificationSheetRef = useRef(null);
  const drillDownOpacity = useRef(new Animated.Value(0)).current;

  // Deep link handling — parse invite token from URL
  useEffect(() => {
    const handleDeepLink = (event) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.token) {
        setInviteToken(queryParams.token);
        setAuthScreen('register');
      }
    };

    // Check if app was opened via a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  // Streak (mentee) and badge/notification counts loaded from API
  const [streak, setStreak] = useState(null);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!loggedInAccount) return;
    const loadHeaderData = async () => {
      try {
        if (currentRole === 'mentee') {
          const { items } = await SadhanaService.listSadhanaEntries(loggedInAccount.id, { limit: 60 });
          if (items?.length) {
            // Compute streak: consecutive days with entries up to today
            const dates = new Set(items.map(e => e.date));
            let count = 0;
            const today = new Date();
            for (let i = 0; i < 60; i++) {
              const d = new Date(today);
              d.setDate(d.getDate() - i);
              const key = d.toISOString().split('T')[0];
              if (dates.has(key)) count++;
              else break;
            }
            setStreak(count);
          }
        } else if (currentRole === 'mentor') {
          const approvals = await CourseService.listPendingApprovals();
          setPendingApprovalCount(approvals?.length || 0);
          // Build lightweight notifications from pending approvals
          setNotifications(
            (approvals || []).slice(0, 10).map(a => ({
              menteeName: a.users ? `${a.users.firstName} ${a.users.lastName}`.trim() : 'Devotee',
              date: a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '',
              note: `Submitted: ${a.courses?.title || 'a course'}`,
              score: null,
              mood: null,
            }))
          );
        }
      } catch (e) { console.error('[App header load]', e); }
    };
    loadHeaderData();
  }, [loggedInAccount, currentRole]);

  const hasNotifications = currentRole === 'mentor' && pendingApprovalCount > 0;

  const handleNotificationPress = useCallback(() => {
    if (hasNotifications) {
      notificationSheetRef.current?.present();
    }
  }, [hasNotifications]);

  // Fade in drill-down screens on mount
  useEffect(() => {
    if (drillDownScreen) {
      drillDownOpacity.setValue(0);
      Animated.timing(drillDownOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drillDownScreen]);

  // Show login/register screen when not authenticated
  if (!loggedInAccount) {
    if (authScreen === 'register' && inviteToken) {
      return (
        <RegisterScreen
          inviteToken={inviteToken}
          onRegister={(account) => {
            setLoggedInAccount(account);
            setCurrentRole(account.defaultRole);
            setCurrentTab(MockData.roleTabs[account.defaultRole][0].id);
          }}
          onBack={() => {
            setAuthScreen('login');
            setInviteToken(null);
          }}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={(account) => {
          if (account.status === 'pending') {
            Alert.alert('Pending Approval', 'Your account is still under review.');
            return;
          }
          setLoggedInAccount(account);
          setCurrentRole(account.defaultRole);
          setCurrentTab(MockData.roleTabs[account.defaultRole][0].id);
        }}
      />
    );
  }

  // Get tabs for current role
  const tabs = MockData.roleTabs[currentRole];

  // Get user data for header
  const userName = loggedInAccount.firstName;
  const isDualRole = loggedInAccount.roles.length > 1;

  // Badge counts driven by API state
  const badgeCounts = currentRole === 'mentor'
    ? { approvals: pendingApprovalCount || undefined }
    : {};

  // Handle logout
  const handleLogout = () => {
    setLoggedInAccount(null);
    setCurrentRole('mentee');
    setCurrentTab('today');
    setDrillDownScreen(null);
    setStreak(null);
    setPendingApprovalCount(0);
    setNotifications([]);
  };

  // Handle role switch
  const handleRoleSwitch = (role) => {
    setCurrentRole(role);
    setCurrentTab(MockData.roleTabs[role][0].id);
    setDrillDownScreen(null);
  };

  // Handle tab press
  const handleTabPress = (tabId) => {
    if (tabId === currentTab) return;
    setCurrentTab(tabId);
    setDrillDownScreen(null);
  };

  // Handle navigation to drill-down screens
  const handleNavigate = (screen, data) => {
    setDrillDownData(data || null);
    setDrillDownScreen(screen);
  };

  const handleBack = () => {
    setDrillDownScreen(null);
    setDrillDownData(null);
  };

  // Render all tab screens simultaneously (hidden/shown via animated opacity)
  const renderTabScreens = () => {
    if (drillDownScreen) {
      let drillDownContent;
      switch (drillDownScreen) {
        case 'batchDetail':
          drillDownContent = <BatchDetailScreen batchId={drillDownData?.batchId} account={loggedInAccount} onBack={handleBack} onNavigate={handleNavigate} />;
          break;
        case 'menteeDetail':
          drillDownContent = <MenteeDetailScreen menteeId={drillDownData?.menteeId} account={loggedInAccount} onBack={handleBack} />;
          break;
        case 'adminUserDetail':
          drillDownContent = <AdminUserDetailScreen userId={drillDownData?.userId} account={loggedInAccount} onBack={handleBack} />;
          break;
        case 'auditLog':
          drillDownContent = <AuditLogScreen onBack={handleBack} />;
          break;
        default:
          setDrillDownScreen(null);
          return null;
      }
      return (
        <Animated.View style={[styles.tabLayer, { opacity: drillDownOpacity }]}>
          {drillDownContent}
        </Animated.View>
      );
    }

    const screens = ROLE_SCREENS[currentRole] || MENTEE_SCREENS;
    const tabIds = Object.keys(screens);

    return tabIds.map((tabId) => {
      const Screen = screens[tabId];
      const isActive = currentTab === tabId;

      // Pass user account + navigation props to screens that need them
      const extraProps = { account: loggedInAccount };
      if (tabId === 'dashboard' && currentRole === 'mentor') {
        extraProps.onNavigate = handleNavigate;
        extraProps.onTabSwitch = handleTabPress;
      }
      if (tabId === 'batches' && currentRole === 'mentor') {
        extraProps.onNavigate = handleNavigate;
      }
      if (tabId === 'users' && currentRole === 'admin') {
        extraProps.onNavigate = handleNavigate;
      }
      if (tabId === 'profile' || tabId === 'settings') {
        extraProps.onLogout = handleLogout;
      }
      if (tabId === 'settings' && currentRole === 'admin') {
        extraProps.onNavigate = handleNavigate;
      }

      return (
        <AnimatedTabLayer key={`${currentRole}-${tabId}`} isActive={isActive}>
          <Screen {...extraProps} />
        </AnimatedTabLayer>
      );
    });
  };

  return (
    <ToastProvider>
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent />

          {/* Header */}
          <HeaderBand
            userName={userName}
            streak={streak}
            date="Wed 26 Feb"
            onNotificationPress={handleNotificationPress}
            hasNotification={hasNotifications}
            dualRoles={isDualRole ? loggedInAccount.roles : null}
            activeRole={currentRole}
            onRoleSwitch={handleRoleSwitch}
          />

          {/* Main Content — all tabs rendered, shown/hidden */}
          <View style={styles.content}>
            {renderTabScreens()}
          </View>

          {/* Bottom Tab Bar (hidden when in drill-down) */}
          {!drillDownScreen && (
            <BottomTabBar
              tabs={tabs}
              activeTab={currentTab}
              onTabPress={handleTabPress}
              badgeCounts={badgeCounts}
            />
          )}

        </SafeAreaView>
      </View>

      {/* Notification Sheet — pending course approvals */}
      <BottomSheet ref={notificationSheetRef} snapPoints={['50%']} title="Notifications">
        <ScrollView>
          {notifications.length === 0 && (
            <Text style={[{ textAlign: 'center', padding: 24, color: colors.text.secondary }]}>No pending notifications</Text>
          )}
          {notifications.map((notif, index) => (
            <View key={index} style={[notifStyles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={notifStyles.header}>
                <Text style={[notifStyles.name, { color: colors.text.primary }]}>{notif.menteeName}</Text>
                <Text style={[notifStyles.date, { color: colors.text.secondary }]}>{notif.date}</Text>
              </View>
              <Text style={[notifStyles.note, { color: colors.text.primary }]}>{notif.note}</Text>
            </View>
          ))}
        </ScrollView>
      </BottomSheet>
    </ToastProvider>
  );
}

// ═══════════════════════════════════════════════════════════
// Main App — wraps in ThemeProvider
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [fontsLoaded] = useFonts({
    'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('./assets/fonts/DMSans-SemiBold.ttf'),
    'SourceSerif4-Medium': require('./assets/fonts/SourceSerif4-Medium.ttf'),
    'SourceSerif4-SemiBold': require('./assets/fonts/SourceSerif4-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F0' }}>
        <ActivityIndicator size="large" color="#E8732A" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.container}>
        <AppContent />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const notifStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
  },
  date: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
  },
  note: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
