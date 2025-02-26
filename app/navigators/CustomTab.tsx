import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';

// Definisi tipe untuk konfigurasi tab
export type TabConfig = {
  name: string;
  label: string;
  icon: string;
}

// Konfigurasi tab yang digunakan di CustomTabBar
const TAB_CONFIG: TabConfig[] = [
  { name: 'HariIni', label: 'Hari ini', icon: 'sunny-outline' },
  { name: 'Program', label: 'Program', icon: 'grid-outline' },
  { name: 'Profile', label: 'Profil', icon: 'person-outline' },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const tabBarStyle = {
    height: Platform.OS === 'ios' ? 50 + insets.bottom : 70,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
    backgroundColor: theme.background,
    borderTopWidth: Platform.OS === 'ios' ? 0.2 : 0,
    borderColor: theme.border,
  };
  
  return (
    <View style={[styles.tabBarContainer, tabBarStyle]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG.find(tab => tab.name === route.name);
        
        if (!config) return null;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        const color = isFocused ? theme.primary : theme.textSecondary;
        
        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            android_ripple={{ color: 'transparent', borderless: true }}
          >
            <Ionicons name={config.icon as any} size={24} color={color} />
            
            <View style={styles.labelContainer}>
              <Text style={[styles.labelText, { color }]}>
                {config.label}
              </Text>
              
              {isFocused && (
                <View style={[styles.indicator, { backgroundColor: theme.primary }]} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  indicator: {
    width: 100,
    height: 4,
    borderRadius: 1.5,
    marginTop: 4,
  },
});