/**
 * components/StepperControl.js
 * ──────────────────────────────────────────────────────────────
 * Circular increment/decrement control with animated value changes.
 * §5.5 StepperControl specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius, typography, animations } from '../theme';
import { useTheme } from '../ThemeContext';
import { Minus, Plus } from 'phosphor-react-native';

export const StepperControl = ({
  value,
  onValueChange,
  min = 0,
  max = 192,
  step = 1,
  showUnit = false,
  unit = '',
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [value]);

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    if (newValue !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange?.(newValue);
    }
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    if (newValue !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange?.(newValue);
    }
  };

  const isMinDisabled = value <= min;
  const isMaxDisabled = value >= max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.background, borderColor: colors.border }, isMinDisabled && styles.buttonDisabled]}
        onPress={decrement}
        disabled={isMinDisabled}
        activeOpacity={0.8}
      >
        <Minus size={18} color={isMinDisabled ? colors.text.secondary : colors.text.primary} weight="bold" />
      </TouchableOpacity>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={[styles.value, { color: colors.text.primary }]}>{value}</Text>
      </Animated.View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.background, borderColor: colors.border }, isMaxDisabled && styles.buttonDisabled]}
        onPress={increment}
        disabled={isMaxDisabled}
        activeOpacity={0.8}
      >
        <Plus size={18} color={isMaxDisabled ? colors.text.secondary : colors.text.primary} weight="bold" />
      </TouchableOpacity>

      {showUnit && <Text style={[styles.unit, { color: colors.text.secondary }]}>{unit}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: 160,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.circle,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  value: {
    ...typography.metric,
    minWidth: 60,
    textAlign: 'center',
  },
  unit: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
});
