/**
 * components/Button.js
 * ──────────────────────────────────────────────────────────────
 * Button component with variants: primary, secondary, destructive, success, text.
 * §5.7 Button specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius, typography } from '../theme';
import { useTheme } from '../ThemeContext';

export const Button = ({
  children,
  variant = 'primary',
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    if (variant === 'primary') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const variantStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
    destructive: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primaryPressed },
    success: { backgroundColor: colors.status.success },
    text: { backgroundColor: 'transparent' },
  };

  const textColors = {
    primary: colors.surface,
    secondary: colors.primary,
    destructive: colors.primaryPressed,
    success: colors.surface,
    text: colors.primary,
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'text' && styles.text,
        variantStyles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.label, { color: textColors[variant] }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  text: {
    height: 40,
    paddingHorizontal: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
