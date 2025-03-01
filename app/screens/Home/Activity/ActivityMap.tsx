import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

// Remove the remote URL and use local image instead
// const MAPS_IMAGE_URL =
//   'https://raw.githubusercontent.com/mapbox/mapbox-gl-js/master/test/integration/render-tests/raster-loading/basic/expected.png';

interface ActivityMapProps {
  onStop: () => void;
}

export default function ActivityMap({ onStop }: ActivityMapProps) {
  const { theme, isDark } = useTheme();
  const [isStarted, setIsStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dummy data for the activity stats
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [speed, setSpeed] = useState(6);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isStarted) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          setDuration(formatTime(newSeconds));
          return newSeconds;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handlePause = () => {
    // Reset to initial state
    setIsStarted(false);
  };

  const handleStop = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset to initial state
    setIsStarted(false);

    // Call the onStop callback
    onStop();
  };

  return (
    <View style={styles(theme, isDark).container}>
      {/* Map View - smaller height */}
      <View style={styles(theme, isDark).mapContainer}>
        <Image
          source={require('@/assets/images/maps-placeholder.png')}
          style={styles(theme, isDark).mapImage}
          resizeMode="cover"
          // Fallback to a solid color if the image fails to load
          onError={() => {}}
        />
      </View>

      {/* Main Content - Centered Distance */}
      <View style={styles(theme, isDark).mainContent}>
        {/* Distance - Larger and centered */}
        <View style={styles(theme, isDark).distanceContainer}>
          <Text style={styles(theme, isDark).distanceLabel}>Jarak</Text>
          <Text style={styles(theme, isDark).distanceValue}>{distance}</Text>
          <Text style={styles(theme, isDark).distanceUnit}>KM</Text>
        </View>

        {/* Duration and Speed in a row */}
        <View style={styles(theme, isDark).statsRow}>
          {/* Duration */}
          <View style={styles(theme, isDark).statItem}>
            <Text style={styles(theme, isDark).statLabel}>Durasi</Text>
            <Text style={styles(theme, isDark).statValue}>{duration}</Text>
            <Text style={styles(theme, isDark).statUnit}>Menit</Text>
          </View>

          {/* Speed */}
          <View style={styles(theme, isDark).statItem}>
            <Text style={styles(theme, isDark).statLabel}>Kecepatan</Text>
            <Text style={styles(theme, isDark).statValue}>{speed}</Text>
            <Text style={styles(theme, isDark).statUnit}>Km/Jam</Text>
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles(theme, isDark).controlsContainer}>
        {!isStarted ? (
          // Initial state - single start button (teal background with play icon)
          <TouchableOpacity
            style={styles(theme, isDark).playButton}
            onPress={handleStart}
          >
            <Ionicons name="pause" size={32} color="#2B6872" />
          </TouchableOpacity>
        ) : (
          // Active state - stop and pause buttons
          <View style={styles(theme, isDark).buttonGroup}>
            <TouchableOpacity
              style={styles(theme, isDark).stopButton}
              onPress={handleStop}
            >
              <View style={styles(theme, isDark).stopIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(theme, isDark).pauseButton}
              onPress={handlePause}
            >
              <Ionicons name="play" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mapContainer: {
      height: 250 * SCALE, // Smaller height
      backgroundColor: '#E5E7EB',
    },
    mapImage: {
      width: '100%',
      height: '100%',
    },
    mainContent: {
      flex: 1,
      padding: 16 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    distanceContainer: {
      alignItems: 'center',
      marginBottom: 32 * SCALE,
    },
    distanceLabel: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
      marginBottom: 8 * SCALE,
    },
    distanceValue: {
      fontSize: 64 * SCALE,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    distanceUnit: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
      marginTop: 8 * SCALE,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    statItem: {
      alignItems: 'center',
      paddingHorizontal: 16 * SCALE,
    },
    statLabel: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginBottom: 4 * SCALE,
    },
    statValue: {
      fontSize: 24 * SCALE,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    statUnit: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginTop: 4 * SCALE,
    },
    controlsContainer: {
      padding: 16 * SCALE,
      paddingBottom: 32 * SCALE,
      backgroundColor: theme.background,
    },
    playButton: {
      width: '100%',
      height: 64 * SCALE,
      borderRadius: 32 * SCALE,
      backgroundColor: '#F0FEFF',
      borderWidth: 1,
      borderColor: '#88D9DF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    initialStartButton: {
      width: '100%',
      height: 64 * SCALE,
      borderRadius: 32 * SCALE,
      backgroundColor: '#F0FEFF',
      borderWidth: 1,
      borderColor: '#88D9DF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pauseButton: {
      width: '48%',
      height: 64 * SCALE,
      borderRadius: 32 * SCALE,
      backgroundColor: '#2B6872',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stopButton: {
      width: '48%',
      height: 64 * SCALE,
      borderRadius: 32 * SCALE,
      backgroundColor: '#FEE9E7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stopIcon: {
      width: 16 * SCALE,
      height: 16 * SCALE,
      backgroundColor: '#EC221F',
    },
  });
