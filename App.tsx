import { NavigationContainer } from '@react-navigation/native';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './app/contexts/AuthContext';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext';
import StackNavigator from './app/navigators';

LogBox.ignoreAllLogs();

function CustomStatusBar() {
  const { theme, isDark } = useTheme();

  return (
    <StatusBar
      backgroundColor={theme.background}
      barStyle={isDark ? 'light-content' : 'dark-content'}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <CustomStatusBar />
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
