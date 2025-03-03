import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { NutritionProps } from '../types';


type IconName = keyof typeof Ionicons.glyphMap;

export default function Nutrition({ selectedFoods, totalNutrition }: NutritionProps) {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Update data nutrisi sesuai gambar
    const nutritionData = [
        {
            icon: <View style={[styles.nutrientIcon, { backgroundColor: '#0EA5E9' }]} />,
            label: `Karbohidrat (42g)`,
            total: '31%',
            target: '60%'
        },
        {
            icon: <View style={[styles.nutrientIcon, { backgroundColor: '#C2410C' }]} />,
            label: `Lemak (18,4g)`,
            total: '16%',
            target: '25%'
        },
        {
            icon: <View style={[styles.nutrientIcon, { backgroundColor: '#15803D' }]} />,
            label: `Protein (33g)`,
            total: '7%',
            target: '15%'
        }
    ];

    // Group makanan berdasarkan waktu makan
    const mealGroups = {
        breakfast: selectedFoods.filter(f => f.mealTime === 'breakfast'),
        lunch: selectedFoods.filter(f => f.mealTime === 'lunch'),
        dinner: selectedFoods.filter(f => f.mealTime === 'dinner'),
        snacks: selectedFoods.filter(f => f.mealTime === 'snacks')
    };

    const getMealIcon = (time: string): IconName => {
        switch (time) {
            case 'breakfast': return 'sunny-outline';
            case 'lunch': return 'sunny';
            case 'dinner': return 'moon-outline';
            case 'snacks': return 'cafe-outline';
            default: return 'sunny-outline';
        }
    };

    const getMealTitle = (time: string): string => {
        switch (time) {
            case 'breakfast': return 'Makan Pagi';
            case 'lunch': return 'Makan Siang';
            case 'dinner': return 'Makan Malam';
            case 'snacks': return 'Cemilan';
            default: return 'Makan';
        }
    };

    return (
        <View style={styles.container}>
            
            <ScrollView style={styles.content}>
                <View style={styles.mainCard}>
                    <View style={styles.dateHeader}>
                        <TouchableOpacity style={styles.dateButton}>
                            <Ionicons name="chevron-back" size={24} color="#374151" />
                            <Text style={styles.dateText}>Hari ini</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.nutritionTable}>
                        <View style={styles.tableHeader}>
                            <View style={{ flex: 1 }} />
                            <Text style={styles.tableHeaderText}>Total</Text>
                            <Text style={styles.tableHeaderText}>Target</Text>
                        </View>

                        {nutritionData.map((item, index) => (
                            <View key={index} style={styles.nutrientRow}>
                                <View style={styles.nutrientLeft}>
                                    {item.icon}
                                    <Text style={styles.nutrientLabel}>{item.label}</Text>
                                </View>
                                <Text style={styles.totalPercent}>{item.total}</Text>
                                <Text style={styles.targetText}>{item.target}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calorieBox}>
                        <View style={styles.calorieRow}>
                            <Text style={styles.calorieLabel}>Total Kalori</Text>
                            <Text style={styles.calorieValue}>375</Text>
                        </View>
                        <View style={styles.calorieRow}>
                            <Text style={styles.calorieLabel}>Sisa Kalori</Text>
                            <Text style={styles.calorieValue}>2075</Text>
                        </View>
                    </View>
                </View>

                {/* Update meal cards dgn style baru */}
                <View style={styles.mealList}>
                    {[
                        { icon: 'sunny-outline', title: 'Makan Pagi', items: 2, calories: 375 },
                        { icon: 'sunny', title: 'Makan Siang', items: 0, calories: 0 },
                        { icon: 'moon-outline', title: 'Makan Malam', items: 0, calories: 0 },
                        { icon: 'cafe-outline', title: 'Cemilan', items: 0, calories: 0 }
                    ].map((meal, index) => (
                        <TouchableOpacity key={index} style={styles.mealCard}>
                            <View style={styles.mealLeft}>
                                <Ionicons name={meal.icon as IconName} size={24} color="#0EA5E9" />
                                <View style={styles.mealInfo}>
                                    <Text style={styles.mealTitle}>{meal.title}</Text>
                                    <Text style={styles.mealItems}>{meal.items} item</Text>
                                </View>
                            </View>
                            <View style={styles.mealRight}>
                                <Text style={styles.mealCalories}>{meal.calories}</Text>
                                <Text style={styles.calorieText}>Kalori</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1
    },
    mainCard: {
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    dateHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        padding: 16
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827'
    },
    nutritionTable: {
        padding: 16
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    nutrientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    nutrientLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    nutrientIcon: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 8
    },
    nutrientLabel: {
        fontSize: 16,
        color: '#1F2937'
    },
    totalPercent: {
        width: 80,
        textAlign: 'center',
        fontSize: 16,
        color: '#1F2937'
    },
    targetText: {
        width: 80,
        textAlign: 'center',
        fontSize: 16,
        color: '#9CA3AF'
    },
    calorieBox: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        gap: 8
    },
    calorieRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    calorieLabel: {
        fontSize: 16,
        color: '#6B7280'
    },
    calorieValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937'
    },
    mealList: {
        paddingHorizontal: 16,
        gap: 12
    },
    mealCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0FEFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E6F7F8'
    },
    mealLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    mealInfo: {
        gap: 4
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827'
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
        color: '#111827'
    },
    calorieText: {
        fontSize: 14,
        color: '#6B7280'
    },
    tableHeaderText: {
        width: 80,
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280'
    }
});
