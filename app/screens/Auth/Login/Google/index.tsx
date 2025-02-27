import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

// Get Google OAuth credentials from environment variables
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

// Validate credentials
if (
  !GOOGLE_WEB_CLIENT_ID ||
  !GOOGLE_IOS_CLIENT_ID ||
  !GOOGLE_ANDROID_CLIENT_ID
) {
  console.error('Missing Google OAuth credentials in environment variables');
}

export default function GoogleSignIn() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    redirectUri: Platform.select({
      native: 'com.glancefit.app:/oauth2redirect/google',
      default: 'https://auth.expo.io/@benzeta/glance-fit',
    }),
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleResponse(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleResponse = async (accessToken: string | undefined) => {
    if (!accessToken) {
      Alert.alert('Error', 'Failed to get access token from Google');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const userInfo = await response.json();
      console.log('Google user info:', userInfo);

      // Navigate to name input screen with Google account info
      // @ts-ignore - Navigation typing issue
      navigation.navigate('NameInput', {
        authType: 'GOOGLE',
        email: userInfo.email,
        name: userInfo.name, // Pass the name from Google
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Error',
        'Failed to get user info from Google. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to start Google sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      <Pressable
        style={styles(theme).backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color={theme.textSecondary} />
      </Pressable>

      <View style={styles(theme).headerContainer}>
        <Image
          source={require('@/assets/glance-fit/icon.png')}
          style={styles(theme).logo}
        />
        <Text style={styles(theme).title}>Masuk dengan Google</Text>
        <Text style={styles(theme).subtitle}>
          untuk melanjutkan masuk ke Glance Fit
        </Text>
      </View>

      <View
        style={[styles(theme).footer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Text style={styles(theme).footerText}>
          Dengan melanjutkan, Anda menyetujui{' '}
          <Text style={styles(theme).linkText}>Kebijakan Privasi</Text> dan{' '}
          <Text style={styles(theme).linkText}>Ketentuan Layanan</Text>
        </Text>
        <Pressable
          style={styles(theme).continueButton}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.textPrimary} />
          ) : (
            <View style={styles(theme).buttonContent}>
              <AntDesign
                name="google"
                size={24}
                color={theme.textPrimary}
                style={styles(theme).googleIcon}
              />
              <Text style={styles(theme).continueButtonText}>
                Lanjutkan dengan Google
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButton: {
      padding: 16,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 60,
      height: 60,
      marginBottom: 16,
      backgroundColor: '#2B6872',
      borderRadius: 30, // Mengubah menjadi setengah dari width/height untuk membuat lingkaran sempurna
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
      textAlign: 'center',
    },
    accountsContainer: {
      backgroundColor: theme.cardBackground,
      margin: 16,
      borderRadius: 16,
      padding: 8,
    },
    accountItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    addAccountIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    accountInfo: {
      marginLeft: 12,
      flex: 1,
    },
    accountName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    accountEmail: {
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
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    linkText: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
    continueButton: {
      backgroundColor: theme.cardBackground,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginLeft: 12,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleIcon: {
      width: 24,
      height: 24,
    },
  });
