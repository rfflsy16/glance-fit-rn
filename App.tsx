import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext';
import StackNavigator from './app/navigators';
import { StatusBar } from 'react-native';

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
                <NavigationContainer>
                    <CustomStatusBar />
                    <StackNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
