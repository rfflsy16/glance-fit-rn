import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function DrinkLog() {
    const { theme } = useTheme();

    return (
        <View style={styles(theme).container}>
            <Text>DrinkLog</Text>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        // paddingTop: insets.top,
    },
});