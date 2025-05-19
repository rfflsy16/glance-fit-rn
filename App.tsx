import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './app/contexts/AuthContext';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext';
import StackNavigator from './app/navigators';

LogBox.ignoreAllLogs();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
