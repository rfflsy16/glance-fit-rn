
import HomeScreen from '@/screens/Home';
import ProfileScreen from '@/screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { CustomTabBar } from './CustomTab';
import ProgramScreen from '@/screens/Program';

type IconName = keyof typeof Ionicons.glyphMap;

// Definisi tipe untuk konfigurasi tab dengan komponen
type TabConfigWithComponent = {
  name: string;
  component: React.ComponentType<object>;
  label: string;
  icon: IconName;
};

// Konfigurasi tab
const TAB_CONFIG: TabConfigWithComponent[] = [
  {
    name: 'HariIni',
    component: HomeScreen,
    label: 'Hari ini',
    icon: 'sunny-outline',
  },
  {
    name: 'Program',
    component: ProgramScreen,
    label: 'Program',
    icon: 'grid-outline',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    label: 'Profil',
    icon: 'person-outline',
  },
];

const Tab = createBottomTabNavigator();

export default function BottomTab(): React.ReactElement {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="HariIni"
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
