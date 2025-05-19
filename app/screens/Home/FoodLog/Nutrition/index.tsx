import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { FoodItem,NutritionProps } from '../types';
import { Theme } from '@/constants/Theme';

export default function Nutrition({ selectedFoods, totalNutrition }: NutritionProps) {
    const { theme } = useTheme();
    const navigation = useNavigation();

    // Target nutrisi harian (dalam gram)
    const DAILY_TARGETS = {
        carbs: 250, // gram
        fat: 77,   // gram
        protein: 158 // gram
    };

    // Hitung persentase dari nutrisi yg dipilih
    const calculatePercentage = (value: number, target: number) => {
        return Math.round((value / target) * 100);
    };

    // Data nutrisi berdasarkan makanan yg dipilih
    const nutritionData = [
        {
            icon: <View style={[styles(theme).nutrientIcon, { backgroundColor: '#0EA5E9' }]} />,
            label: `Karbohidrat (${totalNutrition.carbs}g)`,
            total: `${calculatePercentage(totalNutrition.carbs, DAILY_TARGETS.carbs)}%`,
            target: '100%'
        },
        {
            icon: <View style={[styles(theme).nutrientIcon, { backgroundColor: '#C2410C' }]} />,
            label: `Lemak (${totalNutrition.fat}g)`,
            total: `${calculatePercentage(totalNutrition.fat, DAILY_TARGETS.fat)}%`,
            target: '100%'
        },
        {
            icon: <View style={[styles(theme).nutrientIcon, { backgroundColor: '#15803D' }]} />,
            label: `Protein (${totalNutrition.protein}g)`,
            total: `${calculatePercentage(totalNutrition.protein, DAILY_TARGETS.protein)}%`,
            target: '100%'
        }
    ];

    // Kelompokkan makanan berdasarkan waktu makan
    const groupedFoods = selectedFoods.reduce((acc, food) => {
        const mealTime = food.mealTime || 'snacks';
        if (!acc[mealTime]) {
            acc[mealTime] = {
                items: [],
                totalCalories: 0
            };
        }
        acc[mealTime].items.push(food);
        acc[mealTime].totalCalories += food.calories;
        return acc;
    }, {} as Record<string, { items: FoodItem[], totalCalories: number }>);

    // Data waktu makan yg diupdate dari selectedFoods
    const mealData = [
        { 
            icon: require('@/assets/icons/morning.png'), 
            title: 'Makan Pagi', 
            items: groupedFoods.breakfast?.items.length || 0, 
            calories: groupedFoods.breakfast?.totalCalories || 0 
        },
        { 
            icon: require('@/assets/icons/afternoon.png'), 
            title: 'Makan Siang', 
            items: groupedFoods.lunch?.items.length || 0, 
            calories: groupedFoods.lunch?.totalCalories || 0 
        },
        { 
            icon: require('@/assets/icons/night.png'), 
            title: 'Makan Malam', 
            items: groupedFoods.dinner?.items.length || 0, 
            calories: groupedFoods.dinner?.totalCalories || 0 
        },
        { 
            icon: require('@/assets/icons/snacks.png'), 
            title: 'Cemilan', 
            items: groupedFoods.snacks?.items.length || 0, 
            calories: groupedFoods.snacks?.totalCalories || 0 
        }
    ];

    // Total kalori harian & sisa kalori
    const DAILY_CALORIE_TARGET = 2450;
    const totalCalories = totalNutrition.calories;
    const remainingCalories = DAILY_CALORIE_TARGET - totalCalories;

    return (
        <View style={styles(theme).container}>
            <ScrollView style={styles(theme).content}>
                <View style={styles(theme).mainCard}>
                    <View style={styles(theme).dateHeader}>
                        <View style={styles(theme).dateButton}>
                            <TouchableOpacity>
                                <Ionicons name="chevron-back" size={24} color="#374151" />
                            </TouchableOpacity>
                            <Text style={styles(theme).dateText}>Hari ini</Text>
                            <TouchableOpacity>
                                <Ionicons name="chevron-forward" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles(theme).nutritionTable}>
                        <View style={styles(theme).tableHeader}>
                            <Text style={styles(theme).tableHeaderText}>Total</Text>
                            <Text style={styles(theme).tableHeaderText}>Target</Text>
                        </View>

                        {nutritionData.map((item, index) => (
                            <View key={index} style={styles(theme).nutrientRow}>
                                <View style={styles(theme).nutrientLeft}>
                                    {item.icon}
                                    <Text style={styles(theme).nutrientLabel}>{item.label}</Text>
                                </View>
                                <Text style={styles(theme).totalPercent}>{item.total}</Text>
                                <Text style={styles(theme).targetText}>{item.target}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles(theme).calorieBox}>
                        <View style={styles(theme).calorieRow}>
                            <Text style={styles(theme).calorieLabel}>Total Kalori</Text>
                            <Text style={styles(theme).calorieValue}>{totalCalories}</Text>
                        </View>
                        <View style={styles(theme).calorieRow}>
                            <Text style={styles(theme).calorieLabel}>Sisa Kalori</Text>
                            <Text style={styles(theme).calorieValue}>{remainingCalories}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles(theme).mealList}>
                    {mealData.map((meal, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles(theme).mealCard}
                            onPress={() => {
                                const mealTime = ['breakfast', 'lunch', 'dinner', 'snacks'][index] as 'breakfast' | 'lunch' | 'dinner' | 'snacks';
                                const mealFoods = groupedFoods[mealTime]?.items || [];
                                navigation.navigate('Meal', {
                                    mealTime,
                                    foods: mealFoods
                                });
                            }}
                        >
                            <View style={styles(theme).mealLeft}>
                                <Image 
                                    source={meal.icon}
                                    style={styles(theme).mealIcon} 
                                />
                                <View style={styles(theme).mealInfo}>
                                    <Text style={styles(theme).mealTitle}>{meal.title}</Text>
                                    <Text style={styles(theme).mealItems}>{meal.items} item</Text>
                                </View>
                            </View>
                            <View style={styles(theme).mealRight}>
                                <Text style={styles(theme).mealCalories}>{meal.calories}</Text>
                                <Text style={styles(theme).calorieText}>Kalori</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        marginTop: 16,
    },
    mainCard: {
        backgroundColor: "FFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    dateHeader: {
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary
    },
    nutritionTable: {
        paddingVertical: 16,
        gap: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 32,
        marginBottom: 8,
    },
    tableHeaderText: {
        width: 60,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'left'
    },
    nutrientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    nutrientLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8
    },
    nutrientIcon: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 8
    },
    nutrientLabel: {
        fontSize: 16,
        color: theme.textPrimary,
        flex: 1
    },
    totalPercent: {
        width: 60,
        fontSize: 16,
        color: theme.textPrimary,
        textAlign: 'left'
    },
    targetText: {
        width: 60,
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: 'left'
    },
    calorieBox: {
        backgroundColor: theme.background,
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 16
    },
    calorieRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    calorieLabel: {
        fontSize: 16,
        color: theme.textSecondary
    },
    calorieValue: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary
    },
    mealList: {
        paddingBottom: 24,
        gap: 12,
    },
    mealCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EBF8F9',
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#94D1DB',
        height: 90,
    },
    mealLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    mealInfo: {
        gap: 2
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937'
    },
    mealItems: {
        fontSize: 14,
        color: '#6B7280'
    },
    mealRight: {
        alignItems: 'flex-end'
    },
    mealCalories: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        alignSelf: 'flex-start'
    },
    calorieText: {
        fontSize: 14,
        color: theme.textSecondary
    },
    mealIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    }
});