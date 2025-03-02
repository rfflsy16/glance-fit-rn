import { Theme } from '@/constants/Theme';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function FoodLog() {
    const { theme } = useTheme();
    
    return (
        <View style={styles(theme).container}>
            <Text>FoodLog</Text>
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