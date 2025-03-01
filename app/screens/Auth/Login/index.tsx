import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';

import { slideItems } from './slideData';
import useSlide from './useSlide';

// Ambil ukuran layar
const { width } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

// Get Google OAuth credentials from environment variables
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export default function Login() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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

  useEffect(() => {
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
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gunakan custom hook
  const {
    currentIndex,
    scrollViewRef,
    handleScroll,
    handleScrollEnd,
    getRealIndex,
    realSlideCount,
    extendedSlides,
  } = useSlide({
    slides: slideItems,
    autoSlideInterval: 3000,
  });

  return (
    <View style={styles(theme).container}>
      {/* Image carousel */}
      <View style={styles(theme).imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          contentOffset={{ x: width, y: 0 }} // Start at first real slide
        >
          {extendedSlides.map((item) => (
            <Image
              key={item.id}
              source={item.image}
              style={{ width, height: '100%' }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      {/* Content container */}
      <View style={styles(theme).contentContainer}>
        {/* Pagination */}
        <View style={styles(theme).paginationContainer}>
          {Array(realSlideCount)
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles(theme).paginationDot,
                  getRealIndex(currentIndex) === index &&
                    styles(theme).activeDot,
                ]}
              />
            ))}
        </View>

        {/* Title */}
        <Text style={styles(theme).title}>Track Your Activity</Text>

        {/* Description */}
        <Text style={styles(theme).description}>
          Ikuti program kesehatan yg disesuaikan dgn kebutuhan kmu utk mencapai
          tujuan kebugaran dgn lebih efektif.
        </Text>
      </View>

      {/* Login Buttons */}
      <View
        style={[
          styles(theme).buttonsContainer,
          { paddingBottom: insets.bottom || 24 },
        ]}
      >
        {/* Google Sign In */}
        <TouchableOpacity
          style={styles(theme).googleButton}
          onPress={() => promptAsync()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles(theme).googleButton}>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles(theme).googleButtonText}>
                Login dengan Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Phone Sign In */}
        <TouchableOpacity
          style={styles(theme).phoneButton}
          onPress={() => navigation.navigate('PhoneStack')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={20}
            color={theme.primary}
          />
          <Text style={styles(theme).phoneButtonText}>Login dengan No. HP</Text>
        </TouchableOpacity>
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
    imageContainer: {
      height: '50%',
      width: '100%',
      backgroundColor: theme.primary,
    },
    image: {
      width,
      height: '100%',
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      justifyContent: 'flex-start',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E0E0E0',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: theme.primary,
      width: 8,
      height: 8,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 34,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      color: '#757575',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.25,
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    buttonsContainer: {
      paddingHorizontal: 24,
      gap: 16,
      width: '100%',
      marginTop: 'auto',
    },
    googleButton: {
      flexDirection: 'row',
      height: 56,
      borderRadius: 8,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    googleButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    phoneButton: {
      flexDirection: 'row',
      height: 56,
      borderRadius: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    phoneButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '500',
    },
  });
