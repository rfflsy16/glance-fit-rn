import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';

export default function Wallet() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Text style={styles(theme).textStyle}>
                Wallet
            </Text>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.primary,
        textAlign: 'center'
    }
});