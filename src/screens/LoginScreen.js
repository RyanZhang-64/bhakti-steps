/**
 * screens/LoginScreen.js
 * ──────────────────────────────────────────────────────────────
 * Mock login screen with email/password authentication.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTheme } from '../ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { spacing, typography, radius } from '../theme';
import { MockData } from '../mockData';

export const LoginScreen = ({ onLogin, onNavigateRegister }) => {
  const { isDark, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = () => {
    setErrorMsg('');
    const found = MockData.accounts.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!found) {
      setErrorMsg('Incorrect email or password.');
      return;
    }
    onLogin(found);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errorMsg) setErrorMsg('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errorMsg) setErrorMsg('');
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <SafeAreaView style={styles.outerContainer}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} translucent />
        <KeyboardAvoidingView
          style={styles.outerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand */}
            <View style={styles.brandBlock}>
              <Text style={[styles.brandTitle, { color: colors.primary }]}>Bhakti Steps</Text>
              <Text style={[styles.brandTagline, { color: colors.text.secondary }]}>Track your spiritual practice</Text>
            </View>

            {/* Login Card */}
            <Card variant="form" style={styles.loginCard}>
              <Text style={[styles.signInTitle, { color: colors.text.primary }]}>Sign in</Text>

              {/* Email */}
              <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>Email</Text>
              <View style={[
                styles.inputContainer,
                { borderColor: focusedField === 'email' ? colors.primary : colors.border, backgroundColor: colors.background },
              ]}>
                <TextInput
                  style={[styles.textInput, { color: colors.text.primary }]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              {/* Password */}
              <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>Password</Text>
              <View style={[
                styles.inputContainer,
                { borderColor: focusedField === 'password' ? colors.primary : colors.border, backgroundColor: colors.background },
              ]}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput, { color: colors.text.primary }]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter password"
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.eyeButton}
                >
                  {showPassword
                    ? <EyeSlash size={20} color={colors.text.secondary} />
                    : <Eye size={20} color={colors.text.secondary} />}
                </TouchableOpacity>
              </View>

              {/* Error */}
              {errorMsg !== '' && (
                <Text style={[styles.errorText, { color: colors.status.error }]}>{errorMsg}</Text>
              )}

              {/* Submit */}
              <Button variant="primary" onPress={handleLogin} style={styles.loginButton}>
                Sign In
              </Button>

              {/* Register link */}
              <Button variant="text" onPress={onNavigateRegister} style={styles.registerButton}>
                Don't have an account? Sign Up
              </Button>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  brandTitle: {
    ...typography.display,
    fontSize: 32,
  },
  brandTagline: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  loginCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  signInTitle: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: radius.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  textInput: {
    ...typography.body,
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: spacing.xl,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerButton: {
    marginTop: spacing.sm,
  },
});
