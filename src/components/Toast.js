/**
 * components/Toast.js
 * ──────────────────────────────────────────────────────────────
 * Toast notification system with slide-in animation and auto-dismiss.
 * ──────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, WarningCircle } from 'phosphor-react-native';
import { spacing, typography, radius, elevation } from '../theme';
import { useTheme } from '../ThemeContext';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const { colors } = useTheme();
  const [toast, setToast] = useState(null);
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type });
    translateY.setValue(-150);
    opacity.setValue(0);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -150, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, 4000);
  }, [translateY, opacity]);

  const borderColor = toast?.type === 'error' ? colors.status.error : colors.status.success;
  const IconComponent = toast?.type === 'error' ? WarningCircle : CheckCircle;

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: colors.surface, transform: [{ translateY }], opacity, borderLeftColor: borderColor },
          ]}
        >
          <IconComponent size={20} color={borderColor} weight="fill" />
          <Text style={[styles.message, { color: colors.text.primary }]}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 9999,
    ...elevation.medium,
  },
  message: {
    ...typography.body,
    flex: 1,
  },
});
