/**
 * screens/RegisterScreen.js
 * ──────────────────────────────────────────────────────────────
 * Invite-only registration screen. The user arrives via a deep
 * link with a token — the role is pre-assigned and read-only.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTheme } from '../ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { spacing, typography, radius } from '../theme';
import { AuthService, InviteService } from '../api';

export const RegisterScreen = ({ inviteToken, onRegister, onBack }) => {
  const { isDark, colors } = useTheme();
  const [invite, setInvite] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [inviteError, setInviteError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [spiritualName, setSpiritualName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Validate invite token on mount
  useEffect(() => {
    const validate = async () => {
      try {
        const data = await InviteService.validateInvite(inviteToken);
        setInvite(data);
        if (data.email) setEmail(data.email);
      } catch (err) {
        setInviteError(err.message || 'Invalid or expired invite link.');
      } finally {
        setInviteLoading(false);
      }
    };
    validate();
  }, [inviteToken]);

  const clearError = () => { if (errorMsg) setErrorMsg(''); };

  const handleRegister = async () => {
    setErrorMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First name and last name are required.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const account = await AuthService.signUp({
        token: inviteToken,
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        dob: dob.trim() || undefined,
        address: address.trim() || undefined,
      });
      onRegister(account);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value, onChangeText, placeholder, fieldKey, options = {}) => (
    <>
      <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        { borderColor: focusedField === fieldKey ? colors.primary : colors.border, backgroundColor: colors.background },
        options.multiline && { height: 64 },
        options.editable === false && { opacity: 0.6 },
      ]}>
        <TextInput
          style={[styles.textInput, options.secureTextEntry && styles.passwordInput, { color: colors.text.primary }, options.multiline && { textAlignVertical: 'top', paddingTop: spacing.sm }]}
          value={value}
          onChangeText={(text) => { onChangeText(text); clearError(); }}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          keyboardType={options.keyboardType || 'default'}
          autoCapitalize={options.autoCapitalize || 'words'}
          autoCorrect={false}
          secureTextEntry={options.secureTextEntry}
          multiline={options.multiline || false}
          editable={options.editable !== false}
          onFocus={() => setFocusedField(fieldKey)}
          onBlur={() => setFocusedField(null)}
        />
        {options.toggleSecure && (
          <TouchableOpacity
            onPress={options.toggleSecure}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.eyeButton}
          >
            {options.secureTextEntry
              ? <Eye size={20} color={colors.text.secondary} />
              : <EyeSlash size={20} color={colors.text.secondary} />}
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  // Loading state while validating invite
  if (inviteLoading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Validating invite...</Text>
      </View>
    );
  }

  // Invalid/expired invite
  if (inviteError) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.status.error }]}>Invalid Invite</Text>
        <Text style={[styles.errorDesc, { color: colors.text.secondary }]}>{inviteError}</Text>
        <Button variant="primary" onPress={onBack} style={{ marginTop: spacing.xl }}>
          Back to Sign In
        </Button>
      </View>
    );
  }

  const roleName = (invite?.role || 'mentee').toLowerCase();
  const roleDisplay = roleName.charAt(0).toUpperCase() + roleName.slice(1);

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

            {/* Registration Card */}
            <Card variant="form" style={styles.formCard}>
              <Text style={[styles.heading, { color: colors.text.primary }]}>Create Account</Text>

              {/* Role chip — read-only */}
              <View style={styles.roleChipRow}>
                <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>Role</Text>
                <View style={[styles.roleChip, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
                  <Text style={[styles.roleChipText, { color: colors.primary }]}>{roleDisplay}</Text>
                </View>
              </View>

              {/* Name fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  {renderField('First Name', firstName, setFirstName, 'First name', 'firstName')}
                </View>
                <View style={styles.nameField}>
                  {renderField('Last Name', lastName, setLastName, 'Last name', 'lastName')}
                </View>
              </View>

              {renderField('Email', email, setEmail, 'you@example.com', 'email', {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                editable: !invite?.email,
              })}

              {renderField('Phone (Optional)', phone, setPhone, '+44 7700 900000', 'phone', {
                keyboardType: 'phone-pad',
                autoCapitalize: 'none',
              })}

              {renderField('Spiritual Name (Optional)', spiritualName, setSpiritualName, 'e.g. Bhakta John', 'spiritualName')}

              {renderField('Date of Birth (Optional)', dob, setDob, 'e.g. 15 March 1995', 'dob')}

              {renderField('Address (Optional)', address, setAddress, 'Home address', 'address', {
                multiline: true,
              })}

              {renderField('Password', password, setPassword, 'Min. 8 characters', 'password', {
                secureTextEntry: !showPassword,
                autoCapitalize: 'none',
                toggleSecure: () => setShowPassword(v => !v),
              })}

              {renderField('Confirm Password', confirmPassword, setConfirmPassword, 'Re-enter password', 'confirmPassword', {
                secureTextEntry: !showConfirmPassword,
                autoCapitalize: 'none',
                toggleSecure: () => setShowConfirmPassword(v => !v),
              })}

              {/* Error */}
              {errorMsg !== '' && (
                <Text style={[styles.errorText, { color: colors.status.error }]}>{errorMsg}</Text>
              )}

              {/* Submit */}
              <Button variant="primary" onPress={handleRegister} style={styles.submitButton} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Create Account'}
              </Button>

              {/* Back to login */}
              <Button variant="text" onPress={onBack} style={styles.backButton}>
                Already have an account? Sign In
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  errorTitle: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },
  errorDesc: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandTitle: {
    ...typography.display,
    fontSize: 32,
  },
  brandTagline: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  formCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },
  roleChipRow: {
    marginBottom: spacing.md,
  },
  roleChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  roleChipText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nameField: {
    flex: 1,
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
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
