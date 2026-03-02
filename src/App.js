/**
 * App.js
 * ──────────────────────────────────────────────────────────────
 * Main entry point for Bhakti Steps React Native app.
 * Handles role switching, tab navigation, and screen rendering.
 * ──────────────────────────────────────────────────────────────
 */

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
  MentorProfileScreen
} from './src/screens/MentorScreens';
import {
  AdminDashboardScreen,
  UsersScreen,
  BatchOversightScreen,
  SettingsScreen,
  AdminUserDetailScreen,
} from './src/screens/AdminScreens';

// Data
import { MockData } from './src/mockData';

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
  const [currentRole, setCurrentRole] = useState('mentee');
  const [currentTab, setCurrentTab] = useState('today');
  const [drillDownScreen, setDrillDownScreen] = useState(null);
  const notificationSheetRef = useRef(null);
  const drillDownOpacity = useRef(new Animated.Value(0)).current;

  // Notification data
  const hasNotifications = currentRole === 'mentor' && MockData.mentorNotifications.length > 0;

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
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegister={(account) => {
            if (account.status === 'pending') {
              Alert.alert(
                'Application Submitted',
                'Your mentor application has been submitted for review. You will be notified once approved.',
                [{ text: 'OK', onPress: () => setAuthScreen('login') }]
              );
              return;
            }
            setLoggedInAccount(account);
            setCurrentRole(account.defaultRole);
            setCurrentTab(MockData.roleTabs[account.defaultRole][0].id);
          }}
          onBack={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={(account) => {
          if (account.status === 'pending') {
            Alert.alert('Pending Approval', 'Your mentor application is still under review.');
            return;
          }
          setLoggedInAccount(account);
          setCurrentRole(account.defaultRole);
          setCurrentTab(MockData.roleTabs[account.defaultRole][0].id);
        }}
        onNavigateRegister={() => setAuthScreen('register')}
      />
    );
  }

  // Get tabs for current role
  const tabs = MockData.roleTabs[currentRole];

  // Get user data for header
  const userName = loggedInAccount.firstName;
  const streak = currentRole === 'mentee' ? MockData.progressStats.streak : null;
  const isDualRole = loggedInAccount.roles.length > 1;

  // Badge counts (simplified)
  const badgeCounts = currentRole === 'mentor'
    ? { approvals: MockData.mentorDashboard.pendingActions }
    : {};

  // Handle logout
  const handleLogout = () => {
    setLoggedInAccount(null);
    setCurrentRole('mentee');
    setCurrentTab('today');
    setDrillDownScreen(null);
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
  const handleNavigate = (screen) => {
    setDrillDownScreen(screen);
  };

  const handleBack = () => {
    setDrillDownScreen(null);
  };

  // Render all tab screens simultaneously (hidden/shown via animated opacity)
  const renderTabScreens = () => {
    if (drillDownScreen) {
      let drillDownContent;
      switch (drillDownScreen) {
        case 'batchDetail':
          drillDownContent = <BatchDetailScreen onBack={handleBack} onNavigate={handleNavigate} />;
          break;
        case 'menteeDetail':
          drillDownContent = <MenteeDetailScreen onBack={handleBack} />;
          break;
        case 'adminUserDetail':
          drillDownContent = <AdminUserDetailScreen onBack={handleBack} />;
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

      // Pass navigation props to screens that need them
      const extraProps = {};
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

      {/* Notification Sheet */}
      <BottomSheet ref={notificationSheetRef} snapPoints={['50%']} title="Notifications">
        <ScrollView>
          {MockData.mentorNotifications.map((notif, index) => (
            <View key={index} style={[notifStyles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={notifStyles.header}>
                <Text style={[notifStyles.name, { color: colors.text.primary }]}>{notif.menteeName}</Text>
                <Text style={[notifStyles.date, { color: colors.text.secondary }]}>{notif.date}</Text>
              </View>
              <View style={notifStyles.meta}>
                <Text style={[notifStyles.metaText, { color: colors.text.secondary }]}>Score: {notif.score}</Text>
                <Text style={[notifStyles.metaText, { color: colors.text.secondary }]}> · </Text>
                <Text style={[notifStyles.metaText, { color: colors.text.secondary, textTransform: 'capitalize' }]}>{notif.mood}</Text>
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
