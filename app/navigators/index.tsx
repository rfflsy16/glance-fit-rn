import NameInput from '@/screens/Auth/NameInput';
import ReferralInput from '@/screens/Auth/ReferralInput';
import Chat from '@/screens/Community/Chat';
import Activity from '@/screens/Home/Activity';
import CaloriesIn from '@/screens/Home/CaloriesIn';
import CaloriesOut from '@/screens/Home/CaloriesOut';
import ChallengeDetail from '@/screens/Home/Challenge';
import Distance from '@/screens/Home/Distance';
import Steps from '@/screens/Home/Steps';
import Settings from '@/screens/Profile/Settings';
import Wallet from '@/screens/Profile/Wallet';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AuthStack from './Auth';
import MyTabs from './BottomTab';
import ProgramStack from './Program';
import FoodLog from '@/screens/Home/FoodLog';
import Meal from '@/screens/Home/FoodLog/Nutrition/Meal';
import { FoodItem } from '@/screens/Home/FoodLog/types';
export type RootStackParamList = {
  BottomTab: undefined;
  Settings: undefined;
  Wallet: undefined;
  Chat: undefined;
  Auth: undefined;
  NameInput: undefined;
  ReferralInput: undefined;
  Calendar: undefined;
  Steps: undefined;
  Distance: undefined;
  CaloriesIn: undefined;
  CaloriesOut: undefined;
  FoodLog: undefined;
  Activity: {
    id: number;
    title: string;
    icon: string;
    points: number;
    status: string;
  };
  ChallengeDetail: {
    id: number;
    title: string;
    date: string;
  };
  ProgramStack: {
    screen: string;
    params: {
      id: number;
    };
  } | undefined;
  Meal: {
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    foods: FoodItem[];
  };
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        headerShown: false,
        animation: 'scale_from_center',
      }}
    >
      <Stack.Screen name="BottomTab" component={MyTabs} />

      {/* Profile */}
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Chat" component={Chat} />

      {/* Auth */}
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ animation: 'scale_from_center' }}
      />
      <Stack.Screen
        name="NameInput"
        component={NameInput}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ReferralInput"
        component={ReferralInput}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Home */}
      <Stack.Screen
        name="Steps"
        component={Steps}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Distance"
        component={Distance}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CaloriesIn"
        component={CaloriesIn}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CaloriesOut"
        component={CaloriesOut}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ChallengeDetail"
        component={ChallengeDetail}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Program */}
      <Stack.Screen name="ProgramStack" component={ProgramStack} options={{ animation: 'slide_from_right', headerShown: false }} />

      {/* Food */}
      <Stack.Screen name="FoodLog" component={FoodLog} options={{ animation: 'slide_from_right', headerShown: false }} />

      {/* Meal */}
      <Stack.Screen 
        name="Meal" 
        component={Meal} 
        options={{ animation: 'slide_from_right' }} 
      />
    </Stack.Navigator>
  );
}
