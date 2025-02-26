import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme, Theme } from '@/constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            setIsDark(savedTheme === 'dark');
        };
        loadTheme();
    }, []);

    const toggleDarkMode = async () => {
        const newMode = !isDark;
        setIsDark(newMode);
        await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const theme = isDark ? { ...darkTheme, isDark } : { ...lightTheme, isDark };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 