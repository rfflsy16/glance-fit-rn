import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTab';
import React from 'react';

import HomeScreen from '@/screens/Home';
import ProgramScreen from '@/screens/Program';
import ProfileScreen from '@/screens/Profile';

// Definisi tipe untuk konfigurasi tab dengan komponen
type TabConfigWithComponent = {
  name: string;
  component: React.ComponentType<object>;
  label: string;
  icon: string;
}

// Konfigurasi tab
const TAB_CONFIG: TabConfigWithComponent[] = [
  { name: 'HariIni', component: HomeScreen, label: 'Hari ini', icon: 'sunny-outline' },
  { name: 'Program', component: ProgramScreen, label: 'Program', icon: 'grid-outline' },
  { name: 'Profile', component: ProfileScreen, label: 'Profil', icon: 'person-outline' },
];

const Tab = createBottomTabNavigator();

export default function BottomTab(): React.ReactElement {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TAB_CONFIG.map(tab => (
        <Tab.Screen 
          key={tab.name}
          name={tab.name} 
          component={tab.component} 
        />
      ))}
    </Tab.Navigator>
  );
}