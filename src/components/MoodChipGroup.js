/**
 * components/MoodChipGroup.js
 * ──────────────────────────────────────────────────────────────
 * Horizontal row of 4 mood selection chips.
 * §5.6 MoodChipGroup specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius } from '../theme';
import { useTheme } from '../ThemeContext';

const MOODS = [
  { id: 'struggling', label: 'Struggling' },
  { id: 'steady', label: 'Steady' },
  { id: 'inspired', label: 'Inspired' },
  { id: 'blissful', label: 'Blissful' },
];

export const MoodChipGroup = ({ selected, onSelect }) => {
  const { colors } = useTheme();
  const scaleAnims = useRef(
    MOODS.reduce((acc, mood) => {
      acc[mood.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const handlePress = (mood) => {
    if (selected === mood.id) return;

    Haptics.selectionAsync();

    Animated.sequence([
      Animated.timing(scaleAnims[mood.id], { toValue: 1.05, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnims[mood.id], { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();

    onSelect?.(mood.id);
  };

  return (
    <View style={styles.container}>
      {MOODS.map((mood) => {
        const isSelected = selected === mood.id;
        const moodColor = colors.mood[mood.id];

        return (
          <TouchableOpacity
            key={mood.id}
            style={styles.chipWrapper}
            onPress={() => handlePress(mood)}
            activeOpacity={0.8}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Animated.View
              style={[
                styles.chip,
                { borderColor: colors.border },
                { transform: [{ scale: scaleAnims[mood.id] }] },
                isSelected && {
                  backgroundColor: `${moodColor}20`,
                  borderColor: moodColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: colors.text.secondary },
                  isSelected && {
                    color: moodColor,
                    fontFamily: 'DMSans-SemiBold',
                  },
                ]}
                numberOfLines={1}
              >
                {mood.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chipWrapper: {
    flex: 1,
    minWidth: 0,
  },
  chip: {
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  label: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    lineHeight: 14,
  },
});
