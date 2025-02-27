import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { initiatePhoneLogin } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';

export default function Phone() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setup keyboard dismiss when tapping outside
  useEffect(() => {
    const keyboardDismissListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsFocused(false);
      }
    );

    return () => {
      keyboardDismissListener.remove();
    };
  }, []);

  // Handle screen tap to dismiss keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle phone number input
  function handlePhoneChange(text: string) {
    // Hanya terima angka
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
  }

  // Handle continue button press
  async function handleContinue() {
    if (phoneNumber.length > 0) {
      try {
        setIsLoading(true);
        const formattedNumber = `+62${phoneNumber}`;
        await initiatePhoneLogin(formattedNumber);
        navigation.navigate('Verification', { phoneNumber: formattedNumber });
      } catch (error) {
        console.error('Failed to send OTP:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles(theme).container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles(theme).dismissArea}
        onPress={dismissKeyboard}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }}>
          <TouchableOpacity
            style={styles(theme).backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles(theme).headerContainer}>
            <Text style={styles(theme).title}>Masukkan nomor telepon anda</Text>
            <Text style={styles(theme).subtitle}>
              untuk melanjutkan masuk ke Glance Fit
            </Text>
          </View>

          {/* Phone Input - Dipindahkan ke dalam header section */}
          <View style={styles(theme).inputContainer}>
            <View style={styles(theme).countryCode}>
              <Text style={styles(theme).countryFlag}>🇮🇩</Text>
              <Text style={styles(theme).countryText}>+62</Text>
            </View>

            <TextInput
              style={[
                styles(theme).input,
                isFocused && styles(theme).inputFocused,
              ]}
              placeholder="8123456789"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={12}
              autoFocus
            />
          </View>

          {/* Privacy Text - Dipindahkan ke bawah input */}
          <Text style={styles(theme).privacyText}>
            Dengan melanjutkan, Anda menyetujui{' '}
            <Text style={styles(theme).linkText}>Kebijakan Privasi</Text> dan{' '}
            <Text style={styles(theme).linkText}>Ketentuan Layanan</Text>
          </Text>
        </View>

        {/* Footer */}
        <View
          style={[styles(theme).footer, { paddingBottom: insets.bottom || 16 }]}
        >
          <TouchableOpacity
            style={[
              styles(theme).continueButton,
              !phoneNumber && styles(theme).continueButtonDisabled,
            ]}
            disabled={!phoneNumber}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles(theme).continueButtonText,
                !phoneNumber && styles(theme).continueButtonTextDisabled,
              ]}
            >
              Lanjut
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'space-between',
    },
    backButton: {
      padding: 16,
    },
    headerContainer: {
      paddingHorizontal: 16,
      marginTop: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      gap: 8,
    },
    countryCode: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceLight,
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 4,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    countryFlag: {
      fontSize: 16,
    },
    countryText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    input: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      height: 52,
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    privacyText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginHorizontal: 16,
      marginTop: 16,
    },
    footer: {
      padding: 16,
    },
    linkText: {
      color: theme.primary,
      fontWeight: '600',
    },
    continueButton: {
      backgroundColor: '#2B6872',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      height: 52,
      justifyContent: 'center',
    },
    continueButtonDisabled: {
      backgroundColor: theme.surfaceLight,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    continueButtonTextDisabled: {
      color: theme.textSecondary,
    },
    dismissArea: {
      flex: 1,
      justifyContent: 'space-between',
    },
  });
