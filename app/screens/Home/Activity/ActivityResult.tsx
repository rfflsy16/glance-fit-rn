import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

// Add type for route params
type ActivityResultParams = {
  points?: number;
};

export default function ActivityResult() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route =
    useRoute<RouteProp<Record<string, ActivityResultParams>, string>>();
  
  // Reference for the Lottie animation
  const lottieRef = useRef<LottieView>(null);

  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Get points from route params
  const points = route.params?.points || 30;

  // Dummy data for the activity results
  const activityData = {
    title: 'Jalan kaki',
    date: '20 Agustus 2024, 06:32',
    distance: '2 Kilometer',
    duration: '6 menit 35 detik',
    speed: 'Rata-rata 4.5km/Jam',
    points: points,
  };

  const handleBackPress = () => {
    // Show modal instead of going back immediately
    setModalVisible(true);
  };

  // Effect to handle auto-closing modal and navigation
  useEffect(() => {
    if (modalVisible) {
      // Play the Lottie animation when modal opens
      if (lottieRef.current) {
        setTimeout(() => {
          if (lottieRef.current) {
            lottieRef.current.play();
          }
        }, 100); // Small delay to ensure the modal is fully rendered
      }
      
      const timer = setTimeout(() => {
        setModalVisible(false);
        // Navigate to home screen after modal closes
        navigation.goBack();
      }, 2000); // Increased time to allow animation to complete

      return () => clearTimeout(timer);
    }
  }, [modalVisible, navigation]);

  const handleSharePress = () => {
    // Share functionality would go here
    console.log('Share pressed');
  };

  return (
    <View style={styles(theme, isDark, insets).container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(theme, isDark, insets).modalOverlay}>
          <View style={styles(theme, isDark, insets).modalContent}>
            {/* Use Lottie animation with autoPlay set to true as a fallback */}
            <LottieView
              ref={lottieRef}
              source={require('@/assets/lotties/Success.json')}
              style={styles(theme, isDark, insets).successAnimation}
              autoPlay={true} // Set to true to ensure it plays
              loop={false}
              speed={1.0} // Normal speed
              resizeMode="cover"
              hardwareAccelerationAndroid={true} // Better performance on Android
              renderMode="HARDWARE" // Better performance option
              onAnimationFinish={() => console.log('Animation finished')}
            />
            <Text style={styles(theme, isDark, insets).pointsTitle}>
              {activityData.points} Poin berhasil
            </Text>
            <Text style={styles(theme, isDark, insets).pointsSubtitle}>
              didapatkan
            </Text>
          </View>
        </View>
      </Modal>

      {/* Top navigation bar with whitespace - fixed at the top */}
      <View style={styles(theme, isDark, insets).topBar}>
        <TouchableOpacity
          style={styles(theme, isDark, insets).backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(theme, isDark, insets).shareButton}
          onPress={handleSharePress}
        >
          <Ionicons name="share-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Main scrollable content */}
      <ScrollView
        style={styles(theme, isDark, insets).scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(theme, isDark, insets).scrollViewContent}
      >
        {/* Map container with consistent padding */}
        <View style={styles(theme, isDark, insets).mapOuterContainer}>
          <View style={styles(theme, isDark, insets).mapContainer}>
            <Image
              source={require('@/assets/images/maps-placeholder.png')}
              style={styles(theme, isDark, insets).mapImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Activity Stats */}
        <View style={styles(theme, isDark, insets).statsContainer}>
          {/* Activity Title and Date */}
          <Text style={styles(theme, isDark, insets).activityTitle}>
            {activityData.title}
          </Text>
          <Text style={styles(theme, isDark, insets).activityDate}>
            {activityData.date}
          </Text>

          <View style={styles(theme, isDark, insets).statRow}>
            <Text style={styles(theme, isDark, insets).statLabel}>
              Jarak tempuh
            </Text>
            <Text style={styles(theme, isDark, insets).statValue}>
              {activityData.distance}
            </Text>
          </View>

          <View style={styles(theme, isDark, insets).statRow}>
            <Text style={styles(theme, isDark, insets).statLabel}>Durasi</Text>
            <Text style={styles(theme, isDark, insets).statValue}>
              {activityData.duration}
            </Text>
          </View>

          <View style={styles(theme, isDark, insets).statRow}>
            <Text style={styles(theme, isDark, insets).statLabel}>
              Kecepatan
            </Text>
            <Text style={styles(theme, isDark, insets).statValue}>
              {activityData.speed}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (
  theme: Theme,
  isDark: boolean,
  insets = { top: 0, bottom: 0 }
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16 * SCALE,
      paddingBottom: 5 * SCALE,
      backgroundColor: theme.background,
      // height: insets.top + 30 * SCALE,
      zIndex: 10,
    },
    backButton: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20 * SCALE,
    },
    shareButton: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20 * SCALE,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.background,
      marginTop: -5 * SCALE,
    },
    scrollViewContent: {
      paddingTop: 5 * SCALE,
      paddingBottom: 20 * SCALE,
    },
    mapOuterContainer: {
      paddingHorizontal: 16 * SCALE,
      backgroundColor: theme.background,
      marginBottom: 20 * SCALE,
    },
    mapContainer: {
      width: '100%',
      height: SCREEN_HEIGHT * 0.5,
      backgroundColor: '#E5E7EB',
      borderRadius: 12 * SCALE,
      overflow: 'hidden',
    },
    mapImage: {
      width: '100%',
      height: '100%',
    },
    statsContainer: {
      padding: 20 * SCALE,
    },
    activityTitle: {
      fontSize: 18 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4 * SCALE,
    },
    activityDate: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginBottom: 15 * SCALE,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12 * SCALE,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceLight,
    },
    statLabel: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
    },
    statValue: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.background,
      borderRadius: 16 * SCALE,
      padding: 24 * SCALE,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    // Enhanced Lottie animation styles
    successAnimation: {
      width: 120 * SCALE, // Increased size for better visibility
      height: 120 * SCALE,
      marginBottom: 20 * SCALE,
    },
    pointsTitle: {
      fontSize: 20 * SCALE,
      // fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    pointsSubtitle: {
      fontSize: 18 * SCALE,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4 * SCALE,
    },
  });