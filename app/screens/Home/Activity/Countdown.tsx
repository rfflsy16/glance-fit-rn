import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useState, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
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
  const [filledAngle, setFilledAngle] = useState(360); // Mulai dengan lingkaran penuh (360 derajat)
  
  // Ukuran lingkaran
  const size = 200 * SCALE;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Setup animasi untuk progress lingkaran
  const animatedProgress = useRef(new Animated.Value(1)).current; // Mulai dari 1 (penuh)
  
  // Effect untuk animasi lingkaran
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: 0, // Menuju 0 (kosong)
      duration: 5000, // 5 detik
      easing: Easing.linear, // Kecepatan tetap
      useNativeDriver: true,
    }).start();
    
    // Dengarkan perubahan nilai animasi
    const listener = animatedProgress.addListener(({ value }) => {
      // Konversi nilai animasi (1-0) menjadi sudut (360-0)
      setFilledAngle(value * 360);
    });
    
    return () => {
      // Cleanup
      animatedProgress.removeListener(listener);
    };
  }, []);
  
  // Effect terpisah untuk hitungan mundur
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000); // Update angka tiap 1 detik
    
    return () => {
      // Cleanup
      clearInterval(interval);
    };
  }, []);
  
  // Effect terpisah untuk menangani penyelesaian countdown
  useEffect(() => {
    if (count === 0) {
      // Delay sedikit agar user bisa melihat angka 0 sebelum pindah ke screen berikutnya
      const timeout = setTimeout(() => {
        onComplete();
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [count, onComplete]);
  
  // Buat path untuk bagian terisi dan tidak terisi
  const createArc = (startAngle: number, endAngle: number) => {
    // Hitung dalam radian (mulai dari atas/jam 12)
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    
    // Hitung titik awal dan akhir
    const startX = center + radius * Math.cos(startRad);
    const startY = center + radius * Math.sin(startRad);
    const endX = center + radius * Math.cos(endRad);
    const endY = center + radius * Math.sin(endRad);
    
    // Tentukan arah path
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    // Buat path SVG
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };
  
  // Hitung path untuk lingkaran
  const filledPath = createArc(0, filledAngle);
  const unfilledPath = createArc(filledAngle, 360);
  
  return (
    <View style={styles(theme, isDark).container}>
      <View style={styles(theme, isDark).content}>
        {/* Judul aktivitas */}
        {activityTitle && (
          <Text style={styles(theme, isDark).activityTitle}>
            {activityTitle}
          </Text>
        )}
        
        {/* Lingkaran countdown */}
        <View style={styles(theme, isDark).circleWrapper}>
          <Svg width={size} height={size}>
            {/* Lingkaran background */}
            <Circle cx={center} cy={center} r={radius} fill="transparent" />
            
            {/* Bagian yang belum terisi (abu-abu) */}
            <Path
              d={unfilledPath}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
            />
            
            {/* Bagian yang terisi (warna primary) */}
            <Path
              d={filledPath}
              stroke={theme.primary}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
            />
          </Svg>
          
          {/* Angka countdown di tengah lingkaran */}
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