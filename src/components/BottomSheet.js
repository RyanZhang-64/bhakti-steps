/**
 * components/BottomSheet.js
 * ──────────────────────────────────────────────────────────────
 * Reusable bottom sheet using React Native Modal + Animated.
 * §5.8 BottomSheet specifications.
 * ──────────────────────────────────────────────────────────────
 */

import React, { forwardRef, useImperativeHandle, useState, useRef, useCallback } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { spacing, radius, elevation } from '../theme';
import { useTheme } from '../ThemeContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BottomSheet = forwardRef(({
  children,
  snapPoints = ['40%'],
  title,
  onClose,
}, ref) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const sheetHeight = (parseInt(snapPoints[0]) / 100) * SCREEN_HEIGHT;

  const handleDismiss = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  }, [slideAnim, onClose]);

  useImperativeHandle(ref, () => ({
    present: () => {
      setVisible(true);
      slideAnim.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    },
    dismiss: handleDismiss,
    close: handleDismiss,
  }), [handleDismiss, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }], backgroundColor: colors.surface }]}>
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.content}
            keyboardVerticalOffset={SCREEN_HEIGHT - sheetHeight + 50}
          >
            {title && <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>}
            {children}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    ...elevation.high,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 22,
    marginBottom: spacing.lg,
  },
});
