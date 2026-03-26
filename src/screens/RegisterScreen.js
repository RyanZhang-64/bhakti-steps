/**
 * screens/RegisterScreen.js
 * ──────────────────────────────────────────────────────────────
 * Registration screen with role selection (mentee / mentor).
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

export const RegisterScreen = ({ onRegister, onBack }) => {
  const { isDark, colors } = useTheme();
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
  const [selectedRole, setSelectedRole] = useState('mentee');
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const clearError = () => { if (errorMsg) setErrorMsg(''); };

  const handleRegister = () => {
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
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const account = {
      id: 'new-' + Date.now(),
      email: email.trim().toLowerCase(),
      password,
      firstName: spiritualName.trim() || firstName.trim(),
      roles: [selectedRole],
      defaultRole: selectedRole,
      status: selectedRole === 'mentor' ? 'pending' : 'active',
    };
    onRegister(account);
  };

  const renderField = (label, value, onChangeText, placeholder, fieldKey, options = {}) => (
    <>
      <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        { borderColor: focusedField === fieldKey ? colors.primary : colors.border, backgroundColor: colors.background },
        options.multiline && { height: 64 },
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

              {renderField('Password', password, setPassword, 'Min. 6 characters', 'password', {
                secureTextEntry: !showPassword,
                autoCapitalize: 'none',
                toggleSecure: () => setShowPassword(v => !v),
              })}

              {renderField('Confirm Password', confirmPassword, setConfirmPassword, 'Re-enter password', 'confirmPassword', {
                secureTextEntry: !showConfirmPassword,
                autoCapitalize: 'none',
                toggleSecure: () => setShowConfirmPassword(v => !v),
              })}

              {/* Role Selection */}
              <Text style={[styles.fieldLabel, { color: colors.text.secondary, marginTop: spacing.sm }]}>Account Type</Text>
              <View style={styles.roleOptions}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    { borderColor: selectedRole === 'mentee' ? colors.primary : colors.border, backgroundColor: colors.background },
                    selectedRole === 'mentee' && { borderLeftWidth: 3, borderLeftColor: colors.primary },
                  ]}
                  onPress={() => setSelectedRole('mentee')}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioRow}>
                    <View style={[styles.radio, { borderColor: selectedRole === 'mentee' ? colors.primary : colors.border }]}>
                      {selectedRole === 'mentee' && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.roleLabel, { color: colors.text.primary }]}>Mentee</Text>
                  </View>
                  <Text style={[styles.roleDesc, { color: colors.text.secondary }]}>Start tracking your sadhana</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    { borderColor: selectedRole === 'mentor' ? colors.primary : colors.border, backgroundColor: colors.background },
                    selectedRole === 'mentor' && { borderLeftWidth: 3, borderLeftColor: colors.primary },
                  ]}
                  onPress={() => setSelectedRole('mentor')}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioRow}>
                    <View style={[styles.radio, { borderColor: selectedRole === 'mentor' ? colors.primary : colors.border }]}>
                      {selectedRole === 'mentor' && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.roleLabel, { color: colors.text.primary }]}>Apply as Mentor</Text>
                  </View>
                  <Text style={[styles.roleDesc, { color: colors.status.warning }]}>Requires admin approval</Text>
                </TouchableOpacity>
              </View>

              {/* Error */}
              {errorMsg !== '' && (
                <Text style={[styles.errorText, { color: colors.status.error }]}>{errorMsg}</Text>
              )}

              {/* Submit */}
              <Button variant="primary" onPress={handleRegister} style={styles.submitButton}>
                Create Account
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
  roleOptions: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roleOption: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roleLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  roleDesc: {
    ...typography.caption,
    marginLeft: 28,
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
