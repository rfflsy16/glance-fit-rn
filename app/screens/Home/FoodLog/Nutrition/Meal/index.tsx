import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FoodItem } from '../../types';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

interface MealRouteParams {
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    foods: FoodItem[];
}

const MEAL_TITLES = {
    breakfast: 'Makan Pagi',
    lunch: 'Makan Siang',
    dinner: 'Makan Malam',
    snacks: 'Cemilan'
};

export default function Meal() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    
    const { mealTime = 'breakfast', foods = [] } = (route.params as MealRouteParams) ?? {};
    
    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Header
                title={MEAL_TITLES[mealTime]}
                showBackButton={true}
                onPressBack={() => navigation.goBack()}
            />

            {foods.length > 0 ? (
                <ScrollView style={styles(theme).content}>
                    {foods.map((food, index) => (
                        <View key={index} style={styles(theme).foodItem}>
                            <View style={styles(theme).foodInfo}>
                                <Text style={styles(theme).foodName}>{food.name}</Text>
                                <Text style={styles(theme).foodPortion}>
                                    {food.portion} • {food.calories} kcal
                                </Text>
                            </View>
                            <TouchableOpacity style={styles(theme).deleteButton}>
                                <Ionicons name="trash-outline" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity 
                        style={styles(theme).addButton}
                        onPress={() => navigation.navigate('FoodLog')}
                    >
                        <Ionicons name="add" size={24} color="#2B6872" />
                        <Text style={styles(theme).addButtonText}>Tambah makanan</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View style={styles(theme).emptyContainer}>
                    <Text style={styles(theme).emptyTitle}>
                        Belum ada catatan {MEAL_TITLES[mealTime].toLowerCase()}
                    </Text>
                    <Text style={styles(theme).emptySubtitle}>
                        Yuk, tambah makanan yang sudah kamu komsumsi!
                    </Text>
                    <TouchableOpacity 
                        style={styles(theme).primaryButton}
                        onPress={() => navigation.navigate('FoodLog')}
                    >
                        <Text style={styles(theme).primaryButtonText}>
                            Catat {MEAL_TITLES[mealTime].toLowerCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 20
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 16,
        color: '#111827',
        marginBottom: 4,
    },
    foodPortion: {
        fontSize: 14,
        color: '#6B7280',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 150,
        width: 375,
        alignSelf: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        marginHorizontal: 16,
        gap: 8,
    },
    addButtonText: {
        fontSize: 16,
        color: '#2B6872',
        fontWeight: '500',
    },
    primaryButton: {
        backgroundColor: '#2B6872',
        width: '60%',
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        padding: 12,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});