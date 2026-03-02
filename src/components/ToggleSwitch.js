/**
 * components/ToggleSwitch.js
 * ──────────────────────────────────────────────────────────────
 * Binary toggle switch for morning programme items.
 * §5.4 ToggleSwitch specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, radius, animations } from '../theme';
import { useTheme } from '../ThemeContext';

export const ToggleSwitch = ({ value, onValueChange, disabled = false }) => {
  const { colors } = useTheme();
  const translateX = React.useRef(new Animated.Value(value ? 24 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: animations.toggleSwitch,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync();
    onValueChange?.(!value);
  };

  return (
    <TouchableOpacity
      style={[
        styles.track,
        { backgroundColor: colors.background, borderColor: colors.border },
        value && { backgroundColor: colors.primary, borderColor: colors.primary },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      activeOpacity={1}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.thumb,
          { backgroundColor: colors.text.secondary },
          { transform: [{ translateX }] },
          value && { backgroundColor: colors.surface },
          disabled && { backgroundColor: colors.text.secondary },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: radius.circle,
  },
});
