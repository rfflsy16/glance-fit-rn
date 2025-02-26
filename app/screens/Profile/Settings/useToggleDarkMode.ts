import { useTheme } from '@/contexts/ThemeContext';

export const useToggleDarkMode = () => {
    const { toggleDarkMode, isDark } = useTheme();
    return { toggleDarkMode, isDark };
};