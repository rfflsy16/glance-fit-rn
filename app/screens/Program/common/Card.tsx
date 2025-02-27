import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { Program } from '..';


interface CardProps {
    item: Program;
    exclusive?: boolean;
    onPress?: () => void;
}

export default function Card({ item, exclusive = false, onPress }: CardProps) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    
    const handlePress = () => {
        navigation.navigate('ProgramStack', {
            screen: 'Detail',
            params: { id: item.id }
        });
    };
    
    return (
        <TouchableOpacity style={styles(theme).card} onPress={handlePress}>
            <Image 
                source={{ uri: item.image }}
                style={styles(theme).image}
            />
            <View style={styles(theme).info}>
                <Text style={styles(theme).title} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles(theme).durationContainer}>
                    <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                    <Text style={styles(theme).durationText}>
                        {item.duration}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    card: {
        width: 280,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        overflow: 'hidden',
        // marginRight: 12,
        elevation: 2,
        shadowColor: theme.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover'
    },
    info: {
        padding: 12
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    durationText: {
        fontSize: 14,
        color: theme.textSecondary
    }
});