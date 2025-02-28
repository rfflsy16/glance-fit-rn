import Home from '@/screens/Home';
import Calendar from '@/screens/Home/Calendar';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          presentation: 'card',
          cardStyle: { backgroundColor: 'white' },
        }}
      />
    </Stack.Navigator>
  );
}
