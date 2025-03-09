import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Navigators
import AuthStack from './Auth';
import MyTabs from './BottomTab';
import ProgramStack from './Program';
import PaymentStack, { PaymentStackParamList } from './Payment';

// Auth Screens
import NameInput from '@/screens/Auth/NameInput';
import ReferralInput from '@/screens/Auth/ReferralInput';

// Community Screens
import Chat from '@/screens/Community/Chat';

// Home Screens
import Activity from '@/screens/Home/Activity';
import CaloriesIn from '@/screens/Home/CaloriesIn';
import CaloriesOut from '@/screens/Home/CaloriesOut';
import ChallengeDetail from '@/screens/Home/Challenge';
import Distance from '@/screens/Home/Distance';
import Steps from '@/screens/Home/Steps';
import FoodLog from '@/screens/Home/FoodLog';
import DrinkLog from '@/screens/Home/DrinkLog';
import Notification from '@/screens/Home/Notification';

// Profile Screens
import Settings from '@/screens/Profile/Settings';

// Food Screens
import Meal from '@/screens/Home/FoodLog/Nutrition/Meal';
import { FoodItem } from '@/screens/Home/FoodLog/types';

// Wallet Screens
import Wallet from '@/screens/Profile/Wallet';
import TopUp from '@/screens/Profile/Wallet/TopUp';
import TransactionList from '@/screens/Profile/Wallet/TransactionList';

export type RootStackParamList = {
  BottomTab: undefined;
  Settings: undefined;
  Wallet: undefined;
  TopUp: undefined;
  TransactionList: undefined;
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
  DrinkLog: undefined;
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
  ProgramStack:
    | {
        screen: string;
        params: {
          id: number;
        };
      }
    | undefined;
  Meal: {
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    foods: FoodItem[];
  };
  Notification: undefined;
  PaymentStack: {
    screen: keyof PaymentStackParamList;
    params?: PaymentStackParamList[keyof PaymentStackParamList];
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
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="BottomTab" component={MyTabs} />

      {/* Profile */}
      <Stack.Screen name="Settings" component={Settings} options={{ animation: 'slide_from_right' }} />
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
      <Stack.Screen
        name="ProgramStack"
        component={ProgramStack}
        options={{ animation: 'slide_from_right', headerShown: false }}
      />

      {/* Food */}
      <Stack.Screen
        name="FoodLog"
        component={FoodLog}
        options={{ animation: 'slide_from_right', headerShown: false }}
      />

      {/* Meal */}
      <Stack.Screen
        name="Meal"
        component={Meal}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Drink */}
      <Stack.Screen name="DrinkLog" component={DrinkLog} options={{ animation: 'slide_from_right', headerShown: false }} />

      {/* Notification */}
      <Stack.Screen name="Notification" component={Notification} options={{ animation: 'slide_from_right', headerShown: false }} />

      {/* Payment Stack */}
      <Stack.Screen
        name="PaymentStack"
        component={PaymentStack}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Wallet */}
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="TopUp" component={TopUp} />
      <Stack.Screen name="TransactionList" component={TransactionList} />
    </Stack.Navigator>
  );
}
