import { Theme } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { completePhoneProfile, handleGoogleSignIn } from '@/services/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import RefferalModal from './RefferalModal';

interface RouteParams {
  authType: 'GOOGLE' | 'PHONE';
  email?: string;
  phoneNumber?: string;
  fullName: string;
}

export default function ReferralInput() {
  const [referralCode, setReferralCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { refreshUserData } = useAuth();

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

  const { authType, email, phoneNumber, fullName } =
    (route.params as RouteParams) || {};

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

  // Handle referral code input
  const handleReferralChange = (text: string) => {
    // Convert to uppercase and remove spaces
    const formattedText = text.toUpperCase().replace(/\s/g, '');
    setReferralCode(formattedText);
    // Clear any previous errors when user types
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  // Complete profile with API
  const completeProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Starting profile completion...');
      console.log('Auth type:', authType);
      console.log('Email:', email);
      console.log('Phone number:', phoneNumber);
      console.log('Full name:', fullName);
      console.log('Referral code:', referralCode || 'None provided');

      let userData;

      if (authType === 'GOOGLE' && email) {
        console.log('Completing Google profile...');
        userData = await handleGoogleSignIn(email, fullName, referralCode);
      } else if (authType === 'PHONE' && phoneNumber) {
        console.log('Completing Phone profile...');
        userData = await completePhoneProfile(
          phoneNumber,
          fullName,
          referralCode
        );
      } else {
        throw new Error('Invalid authentication type or missing required data');
      }

      if (userData) {
        console.log(
          'User data received from API:',
          JSON.stringify(userData, null, 2)
        );

        // Verify that profileId exists in the response
        if (!userData.profileId) {
          console.warn('Warning: No profileId in API response');
        }

        // Refresh auth context with the latest user data
        console.log('Refreshing user data in auth context...');
        await refreshUserData();
        console.log('User data refreshed successfully');

        setShowSuccessModal(true);
      } else {
        throw new Error('No user data returned from API');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(message);
      setIsError(true);

      // Show alert with detailed error
      Alert.alert(
        'Profile Completion Failed',
        `There was an error completing your profile: ${message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continue button press
  const handleSubmit = () => {
    dismissKeyboard();
    completeProfile();
  };

  // Handle skip button press
  const handleSkip = async () => {
    try {
      setIsLoading(true);
      console.log('Skipping referral code...');
      console.log('Auth type:', authType);
      console.log('Email:', email);
      console.log('Phone number:', phoneNumber);
      console.log('Full name:', fullName);

      let userData;

      if (authType === 'GOOGLE' && email) {
        console.log('Completing Google profile without referral...');
        userData = await handleGoogleSignIn(email, fullName);
      } else if (authType === 'PHONE' && phoneNumber) {
        console.log('Completing Phone profile without referral...');
        userData = await completePhoneProfile(phoneNumber, fullName);
      } else {
        throw new Error('Invalid authentication type or missing required data');
      }

      if (userData) {
        console.log(
          'User data received from API:',
          JSON.stringify(userData, null, 2)
        );

        // Verify that profileId exists in the response
        if (!userData.profileId) {
          console.warn('Warning: No profileId in API response');
        }

        // Refresh auth context with the latest user data
        console.log('Refreshing user data in auth context...');
        await refreshUserData();
        console.log('User data refreshed successfully');

        navigation.navigate('BottomTab');
      } else {
        throw new Error('No user data returned from API');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';

      // Show alert with detailed error
      Alert.alert(
        'Profile Completion Failed',
        `There was an error completing your profile: ${message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close modal and navigate if valid
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Wait a bit before navigating for better UX
    setTimeout(() => {
      navigation.navigate('BottomTab');
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles(theme).keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles(theme).dismissArea}
        onPress={dismissKeyboard}
      >
        <View
          style={[styles(theme).container, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles(theme).headerContainer}>
            <Text style={styles(theme).title}>Punya kode referral?</Text>
            <Text style={styles(theme).subtitle}>
              Tambahkan kode referral anda pada form berikut
            </Text>
          </View>

          <View style={styles(theme).inputContainer}>
            <TextInput
              style={[
                styles(theme).input,
                isFocused && styles(theme).inputFocused,
                referralCode && !isError && styles(theme).inputFilled,
                isError && styles(theme).inputError,
              ]}
              placeholder="Contoh: AGD45"
              placeholderTextColor={theme.textTertiary}
              value={referralCode}
              onChangeText={handleReferralChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="characters"
              maxLength={10}
              autoFocus
            />
            {isError && (
              <Text style={styles(theme).errorText}>
                {errorMessage || 'Kode referral anda tidak valid'}
              </Text>
            )}
          </View>

          <View
            style={[
              styles(theme).footer,
              { paddingBottom: insets.bottom || 16 },
            ]}
          >
            <View style={styles(theme).buttonContainer}>
              <TouchableOpacity
                style={styles(theme).skipButton}
                onPress={handleSkip}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.primary} size="small" />
                ) : (
                  <Text style={styles(theme).skipButtonText}>Lewati</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles(theme).submitButton,
                  !referralCode && styles(theme).submitButtonDisabled,
                ]}
                disabled={!referralCode || isLoading}
                onPress={handleSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text
                    style={[
                      styles(theme).submitButtonText,
                      !referralCode && styles(theme).submitButtonTextDisabled,
                    ]}
                  >
                    Kirim
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Success Modal */}
          {showSuccessModal && (
            <RefferalModal
              visible={showSuccessModal}
              onClose={handleCloseModal}
            />
          )}
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },
    dismissArea: {
      flex: 1,
    },
    headerContainer: {
      marginBottom: 24,
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
      marginBottom: 24,
    },
    input: {
      height: 56,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.textPrimary,
      backgroundColor: theme.background,
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    inputFilled: {
      borderColor: theme.primary,
      color: theme.primary,
      fontWeight: '500',
    },
    inputError: {
      borderColor: '#EC221F',
      color: '#C00F0C',
    },
    errorText: {
      color: theme.textTertiary,
      fontSize: 14,
      marginTop: 8,
      marginLeft: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    skipButton: {
      paddingVertical: 16,
      width: '50%',
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
    },
    submitButton: {
      backgroundColor: '#2B6872',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      width: '50%',
    },
    submitButtonDisabled: {
      backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    submitButtonTextDisabled: {
      color: theme.textTertiary,
    },
  });
