import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityMap from './ActivityMap';
import ActivityResult from './ActivityResult';
import Countdown from './Countdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

// Tambahkan type untuk icon
type IconName = 'walk' | 'restaurant' | 'flame' | 'water'; 

export default function Activity() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Update params dengan type yang tepat
  const { id, title, icon, points, status } = route.params as {
    id: number;
    title: string;
    icon: IconName;
    points: number;
    status: string;
  };

  // Screen states
  const [screenState, setScreenState] = useState<
    'info' | 'countdown' | 'map' | 'result'
  >('info');

  const handleBack = () => {
    if (screenState === 'info') {
      navigation.goBack();
    } else if (screenState === 'result') {
      navigation.goBack();
    } else {
      // Show confirmation dialog before going back during activity
      navigation.goBack();
    }
  };

  const handleStartActivity = () => {
    setScreenState('countdown');
  };

  const handleCountdownComplete = () => {
    setScreenState('map');
  };

  const handleStopActivity = () => {
    setScreenState('result');
  };

  // Render different screens based on state
  const renderContent = () => {
    switch (screenState) {
      case 'info':
        return (
          <View style={styles(theme, isDark).infoContainer}>
            {/* Icon centered in the upper portion */}
            <View style={styles(theme, isDark).iconWrapper}>
              <View style={styles(theme, isDark).iconContainer}>
                <Ionicons 
                  name={icon} 
                  size={72} // Ukuran ditambah dari 48 jadi 72
                  color="#D4A456" 
                />
              </View>
            </View>

            {/* Title and description in the middle */}
            <View style={styles(theme, isDark).textContent}>
              <Text style={styles(theme, isDark).activityTitle}>{title}</Text>

              <Text style={styles(theme, isDark).activityDescription}>
                Lakukan tantangan harian dan dapatkan{' '}
                <Text style={styles(theme, isDark).pointsText}>
                  {points} poin
                </Text>{' '}
                tambahan untuk berbagai reward menarik.
              </Text>
            </View>

            {/* Button at the bottom */}
            <View style={styles(theme, isDark).buttonContainer}>
              <TouchableOpacity
                style={styles(theme, isDark).startButton}
                onPress={handleStartActivity}
              >
                <Text style={styles(theme, isDark).startButtonText}>Mulai</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'countdown':
        return (
          <Countdown
            onComplete={handleCountdownComplete}
            activityTitle={title}
          />
        );

      case 'map':
        return <ActivityMap onStop={handleStopActivity} />;

      case 'result':
        return <ActivityResult />;

      default:
        return null;
    }
  };

  return (
    <View style={[styles(theme, isDark).container, { paddingTop: insets.top }]}>
      {/* Header - Hide in countdown and result screens */}
      {screenState !== 'countdown' && screenState !== 'result' && (
        <View style={styles(theme, isDark).header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles(theme, isDark).backButton}
          >
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <Text style={styles(theme, isDark).headerTitle}>
            {screenState === 'info' ? 'Aktivitas' : title}
          </Text>

          {screenState === 'map' && (
            <TouchableOpacity style={styles(theme, isDark).shareButton}>
              <Ionicons
                name="share-outline"
                size={24}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Main Content */}
      {renderContent()}
    </View>
  );
}

const styles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10 * SCALE,
      backgroundColor: theme.background,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 28,
      color: theme.textPrimary,
    },
    shareButton: {
      padding: 4,
    },
    infoContainer: {
      flex: 1,
      padding: 24 * SCALE,
      justifyContent: 'space-between',
    },
    iconWrapper: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 40 * SCALE,
    },
    iconContainer: {
      width: 160 * SCALE,
      height: 160 * SCALE,
      borderRadius: 80 * SCALE,
      backgroundColor: '#FDF7E6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContent: {
      flex: 0.2,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20 * SCALE,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 16 * SCALE,
      flex: 0.3,
      justifyContent: 'flex-end',
    },
    activityTitle: {
      fontSize: 24 * SCALE,
      fontWeight: '500',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 20 * SCALE,
    },
    activityDescription: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24 * SCALE,
    },
    pointsText: {
      color: '#32BDC7',
      // fontWeight: '600',
    },
    startButton: {
      backgroundColor: '#2B6872',
      paddingVertical: 16 * SCALE,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: 16 * SCALE,
      fontWeight: '600',
    },
  });
