/**
 * components/Card.js
 * ──────────────────────────────────────────────────────────────
 * Card component with variants: form, dashboard, list-row, attention, banner.
 * §5.3 Card specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, radius, elevation } from '../theme';
import { useTheme } from '../ThemeContext';

export const Card = ({
  children,
  variant = 'form',
  onPress,
  style
}) => {
  const { colors } = useTheme();
  const isTappable = !!onPress;

  const Wrapper = isTappable ? TouchableOpacity : View;

  const variantColors = {
    form: { backgroundColor: colors.surface, borderColor: colors.border },
    dashboard: { backgroundColor: colors.surface },
    listRow: { backgroundColor: colors.surface, borderBottomColor: colors.border },
    attention: { backgroundColor: colors.surface, borderLeftColor: colors.status.warning, borderColor: colors.border },
    banner: { backgroundColor: colors.accent.peach },
  };

  return (
    <Wrapper
      style={[styles.base, styles[variant], variantColors[variant], style]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  form: {
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  dashboard: {
    ...elevation.low,
    marginBottom: spacing.md,
  },
  listRow: {
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 0,
    marginBottom: 0,
  },
  attention: {
    borderLeftWidth: 2,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  banner: {
    borderWidth: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    marginBottom: spacing.md,
  },
});
