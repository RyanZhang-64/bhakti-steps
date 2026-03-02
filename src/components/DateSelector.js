/**
 * components/DateSelector.js
 * ──────────────────────────────────────────────────────────────
 * Simple date picker with left/right arrow navigation.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { spacing, radius, typography } from '../theme';
import { useTheme } from '../ThemeContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date) => {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const DateSelector = ({ value, onChange }) => {
  const { colors } = useTheme();

  const adjustDate = (days) => {
    const newDate = new Date(value);
    newDate.setDate(newDate.getDate() + days);
    onChange(newDate);
  };

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <TouchableOpacity onPress={() => adjustDate(-1)} style={styles.arrow} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <CaretLeft size={18} color={colors.text.secondary} />
      </TouchableOpacity>
      <Text style={[styles.dateText, { color: colors.text.primary }]}>{formatDate(value)}</Text>
      <TouchableOpacity onPress={() => adjustDate(1)} style={styles.arrow} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <CaretRight size={18} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  arrow: {
    padding: spacing.xs,
  },
  dateText: {
    ...typography.body,
    flex: 1,
    textAlign: 'center',
  },
});
