/**
 * components/BottomTabBar.js
 * ──────────────────────────────────────────────────────────────
 * Floating bottom tab bar with role-specific tabs.
 * §5.1 BottomTabBar specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Sun, TrendUp, BookOpen, User, SquaresFour, Users,
  CheckCircle, ChartBar, Stack, Gear,
} from 'phosphor-react-native';
import { spacing, radius, elevation, typography } from '../theme';
import { useTheme } from '../ThemeContext';

const ICONS = { Sun, TrendUp, BookOpen, User, SquaresFour, Users, CheckCircle, ChartBar, Stack, Gear };

const TabItem = ({ tab, isActive, badgeCount, onPress, colors }) => {
  const Icon = ICONS[tab.icon];
  const dotScale = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(dotScale, {
      toValue: isActive ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isActive, dotScale]);

  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Icon
          size={24}
          color={isActive ? colors.primary : colors.text.secondary}
          weight={isActive ? 'fill' : 'light'}
        />
        {badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
            <Text style={[styles.badgeText, { color: colors.surface }]}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text
        style={[styles.label, { color: colors.text.secondary }, isActive && { color: colors.primary }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {tab.label}
      </Text>
      <Animated.View style={[styles.activeDot, { backgroundColor: colors.primary, transform: [{ scale: dotScale }] }]} />
    </TouchableOpacity>
  );
};

export const BottomTabBar = ({ tabs, activeTab, onTabPress, badgeCounts = {} }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          badgeCount={badgeCounts[tab.id] || 0}
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onTabPress?.(tab.id);
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: spacing.lg,
    right: spacing.lg,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: radius.lg,
    ...elevation.high,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    position: 'relative',
  },
  label: {
    ...typography.overline,
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: radius.circle,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
