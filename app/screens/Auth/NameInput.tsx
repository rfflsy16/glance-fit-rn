import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RouteParams {
  authType: 'GOOGLE' | 'PHONE';
  email?: string;
  phoneNumber?: string;
}

export default function NameInput() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Get auth data from route params
  const { authType, email, phoneNumber } = (route.params as RouteParams) || {};

  const handleContinue = () => {
    // @ts-ignore - Navigation typing issue
    navigation.navigate('ReferralInput', {
      authType,
      email,
      phoneNumber,
      fullName: name,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles(theme).container, { paddingTop: insets.top }]}>
        <View style={styles(theme).headerContainer}>
          <Text style={styles(theme).title}>Beritahu kami siapa anda</Text>
          <Text style={styles(theme).subtitle}>
            Nama akan terlihat di halaman Profil anda
          </Text>
        </View>

        <View style={styles(theme).inputContainer}>
          <Text style={styles(theme).label}>Nama lengkap</Text>
          <TextInput
            style={[
              styles(theme).input,
              isFocused && styles(theme).inputFocused,
              name && styles(theme).inputFilled,
            ]}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles(theme).helperText}>
            Hanya gunakan alfabet, 5-24 karakter
          </Text>
        </View>

        <View
          style={[styles(theme).footer, { paddingBottom: insets.bottom + 16 }]}
        >
          <Pressable
            style={[
              styles(theme).continueButton,
              !name && styles(theme).continueButtonDisabled,
            ]}
            disabled={!name}
            onPress={handleContinue}
          >
            <Text
              style={[
                styles(theme).continueButtonText,
                !name && styles(theme).continueButtonTextDisabled,
              ]}
            >
              Lanjut
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerContainer: {
      paddingHorizontal: 16,
      marginTop: 16,
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
      lineHeight: 24,
    },
    inputContainer: {
      marginTop: 32,
      paddingHorizontal: 16,
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      backgroundColor: theme.surfaceLight,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: '#2B6872',
      borderWidth: 1.5,
      borderColor: '#B2B2B2',
    },
    inputFocused: {
      borderColor: '#2B6872',
      backgroundColor: theme.background,
      borderWidth: 2,
    },
    inputFilled: {
      borderColor: '#2B6872',
      backgroundColor: theme.background,
    },
    helperText: {
      marginTop: 8,
      fontSize: 14,
      color: theme.textSecondary,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
    },
    continueButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
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
  });
