/**
 * components/HeaderBand.js
 * ──────────────────────────────────────────────────────────────
 * Header band with greeting, streak badge, date, and notification bell.
 * §5.2 HeaderBand specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Fire } from 'phosphor-react-native';
import { colors, spacing, typography, radius } from '../theme';
import { useTheme } from '../ThemeContext';

export const HeaderBand = ({
  userName,
  streak = null,
  date = 'Wed 26 Feb',
  onNotificationPress,
  hasNotification = false,
  dualRoles = null,
  activeRole = null,
  onRoleSwitch = null,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background, borderBottomColor: colors.border, paddingBottom: dualRoles ? spacing.sm : 0 }]}>
      <View style={styles.mainRow}>
        <View style={styles.left}>
          <View style={styles.greetingBlock}>
            <Text style={[styles.greetingLine, { color: colors.text.secondary }]}>Hare Krishna,</Text>
            <View style={styles.nameRow}>
              <Text style={[styles.nameText, { color: colors.text.primary }]} numberOfLines={1}>{userName}</Text>
              {streak !== null && streak > 0 && (
                <View style={[styles.streakBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Fire size={12} color={colors.primary} weight="fill" />
                  <Text style={[styles.streakCount, { color: colors.primary }]}>{streak}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={[styles.date, { color: colors.text.secondary }]}>{date}</Text>
          <TouchableOpacity
            onPress={onNotificationPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ position: 'relative' }}
          >
            <Bell size={24} color={colors.text.primary} weight="light" />
            {hasNotification && (
              <View style={styles.notificationDot} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {dualRoles && (
        <View style={styles.roleRow}>
          {dualRoles.map(role => (
            <TouchableOpacity
              key={role}
              onPress={() => onRoleSwitch?.(role)}
              style={[
                styles.rolePill,
                { borderColor: colors.border, backgroundColor: colors.surface },
                activeRole === role && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.rolePillText,
                { color: colors.text.secondary },
                activeRole === role && { color: colors.surface },
              ]}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    borderBottomWidth: 1,
  },
  mainRow: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  greetingBlock: {
    flexShrink: 1,
    minWidth: 0,
  },
  greetingLine: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
    borderWidth: 1,
    flexShrink: 0,
  },
  streakCount: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 0,
  },
  date: {
    ...typography.caption,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    justifyContent: 'flex-end',
  },
  rolePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  rolePillText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
