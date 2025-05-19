import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    title: string;
    rightContent?: React.ReactNode;
    showBackButton?: boolean;
    onPressBack?: () => void;
};

export default function Header({ title, rightContent, showBackButton = false, onPressBack }: Props) {
    const { theme } = useTheme();
    
    return (
        <View style={styles(theme).container}>
            {showBackButton && (
                <Pressable onPress={onPressBack}>
                    <Ionicons name="chevron-back" size={24} color={theme.iconPrimary} />
                </Pressable>
            )}
            
            <Text style={styles(theme).title}>{title}</Text>
            
            {rightContent && (
                <View style={styles(theme).rightContainer}>
                    {rightContent}
                </View>
            )}
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        // gap: 16,
        backgroundColor: theme.background
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: theme.textPrimary,
        flex: 1,
        textAlign: 'center'
    },
    rightContainer: {
        marginLeft: 'auto'
    }
});