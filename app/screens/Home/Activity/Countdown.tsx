import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface CountdownProps {
  onComplete: () => void;
  activityTitle?: string;
}

export default function Countdown({
  onComplete,
  activityTitle,
}: CountdownProps) {
  const { theme, isDark } = useTheme();
  const [count, setCount] = useState(5);

  // Constants for the circle
  const size = 200 * SCALE;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  useEffect(() => {
    // Start countdown
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          // Trigger onComplete immediately when count reaches 1
          onComplete();
          return 1; // Keep showing 1 until navigation happens
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  // When count is 5, we want a full circle with no gray portion
  const isFullCircle = count === 5;

  // Calculate the angle for the arc based on the current count
  // When count is 5, we want a full circle (360 degrees)
  // When count is 1, we want 1/5 of the circle (72 degrees)
  const filledAngle = (count / 5) * 360;

  // Create the arc path for the filled portion
  const createArc = (startAngle: number, endAngle: number) => {
    // Convert angles to radians
    const startRad = ((startAngle - 90) * Math.PI) / 180; // Start from the top (12 o'clock)
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    // Calculate start and end points
    const startX = center + radius * Math.cos(startRad);
    const startY = center + radius * Math.sin(startRad);
    const endX = center + radius * Math.cos(endRad);
    const endY = center + radius * Math.sin(endRad);

    // Determine if the arc should be drawn the long way around
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    // Create the arc path
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Create the paths for the filled and unfilled portions
  const filledPath = createArc(0, filledAngle);
  const unfilledPath = createArc(filledAngle, 360);

  return (
    <View style={styles(theme, isDark).container}>
      <View style={styles(theme, isDark).content}>
        {/* Activity title just above the circle */}
        {activityTitle && (
          <Text style={styles(theme, isDark).activityTitle}>
            {activityTitle}
          </Text>
        )}

        {/* Circle */}
        <View style={styles(theme, isDark).circleWrapper}>
          <Svg width={size} height={size}>
            {/* Background Circle (transparent) */}
            <Circle cx={center} cy={center} r={radius} fill="transparent" />

            {/* When count is 5, show only the filled circle with no gray portion */}
            {isFullCircle ? (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={theme.primary}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
            ) : (
              <>
                {/* Unfilled portion (gray) */}
                <Path
                  d={unfilledPath}
                  stroke="#F3F4F6"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeLinecap="round"
                />

                {/* Filled portion (primary color) */}
                <Path
                  d={filledPath}
                  stroke={theme.primary}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </>
            )}
          </Svg>

          {/* Count Text */}
          <View style={styles(theme, isDark).countTextContainer}>
            <Text style={styles(theme, isDark).countText}>{count}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 24 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
    },
    activityTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 24 * SCALE,
    },
    circleWrapper: {
      width: 200 * SCALE,
      height: 200 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    countTextContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    countText: {
      fontSize: 72 * SCALE,
      fontWeight: '400',
      color: theme.textPrimary,
    },
  });
