import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

// Definisikan tipe data makanan
interface FoodItem {
    id: number;
    name: string;
    portion: string;
    calories: number;
    category: string;
}

interface FoodResultProps {
    selectedFoods: FoodItem[];
    totalCalories: number;
    points: number;
}

export default function FoodResult({ selectedFoods, totalCalories, points }: FoodResultProps) {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const lottieRef = useRef<LottieView>(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    useEffect(() => {
        // Tunjukkan modal rewards setelah delay
        const timer = setTimeout(() => {
            setModalVisible(true);
            if (lottieRef.current) {
                lottieRef.current.play();
            }
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);
    
    const handleDone = () => {
        setModalVisible(false);
        setTimeout(() => {
            navigation.goBack();
        }, 300);
    };
    
    return (
        <View style={styles(theme, isDark).container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles(theme, isDark).resultCard}>
                    <View style={styles(theme, isDark).resultHeader}>
                        <Text style={styles(theme, isDark).resultTitle}>Makanan Ditambahkan!</Text>
                        <Text style={styles(theme, isDark).resultDate}>
                            {new Date().toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>
                    
                    <View style={styles(theme, isDark).caloriesContainer}>
                        <Text style={styles(theme, isDark).caloriesTitle}>Total Kalori:</Text>
                        <Text style={styles(theme, isDark).caloriesValue}>{totalCalories} kcal</Text>
                    </View>
                    
                    <View style={styles(theme, isDark).foodsList}>
                        <Text style={styles(theme, isDark).foodsTitle}>Detail Makanan:</Text>
                        {selectedFoods.map((food) => (
                            <View key={food.id} style={styles(theme, isDark).foodItem}>
                                <Text style={styles(theme, isDark).foodName}>{food.name}</Text>
                                <Text style={styles(theme, isDark).foodCalories}>{food.calories} kcal</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                <TouchableOpacity
                    style={styles(theme, isDark).doneButton}
                    onPress={handleDone}
                >
                    <Text style={styles(theme, isDark).doneButtonText}>Selesai</Text>
                </TouchableOpacity>
            </ScrollView>
            
            {/* Modal Rewards */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
            >
                <View style={styles(theme, isDark).modalOverlay}>
                    <View style={styles(theme, isDark).modalContent}>
                        <LottieView
                            ref={lottieRef}
                            source={require('@/assets/lotties/Success.json')}
                            style={styles(theme, isDark).successAnimation}
                            loop={false}
                        />
                        <Text style={styles(theme, isDark).pointsTitle}>+{points} Points!</Text>
                        <Text style={styles(theme, isDark).pointsSubtitle}>
                            Kamu telah mencatat makanan hari ini
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = (theme: Theme, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 16 * SCALE,
        paddingBottom: 16 * SCALE,
    },
    resultCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16 * SCALE,
        padding: 16 * SCALE,
        marginVertical: 16 * SCALE,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.1 : 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    resultHeader: {
        marginBottom: 16 * SCALE,
    },
    resultTitle: {
        fontSize: 18 * SCALE,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4 * SCALE,
    },
    resultDate: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
    },
    caloriesContainer: {
        backgroundColor: theme.surfaceLight,
        borderRadius: 8 * SCALE,
        padding: 16 * SCALE,
        marginBottom: 16 * SCALE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    caloriesTitle: {
        fontSize: 16 * SCALE,
        fontWeight: '500',
        color: theme.textPrimary,
    },
    caloriesValue: {
        fontSize: 18 * SCALE,
        fontWeight: '700',
        color: theme.primary,
    },
    foodsList: {
        marginBottom: 16 * SCALE,
    },
    foodsTitle: {
        fontSize: 16 * SCALE,
        fontWeight: '500',
        color: theme.textPrimary,
        marginBottom: 8 * SCALE,
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12 * SCALE,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    foodName: {
        fontSize: 14 * SCALE,
        color: theme.textPrimary,
    },
    foodCalories: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
    },
    doneButton: {
        backgroundColor: theme.primary,
        borderRadius: 8 * SCALE,
        padding: 16 * SCALE,
        alignItems: 'center',
        marginTop: 16 * SCALE,
        marginBottom: 24 * SCALE,
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 16 * SCALE,
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: theme.background,
        borderRadius: 16 * SCALE,
        padding: 24 * SCALE,
        alignItems: 'center',
    },
    successAnimation: {
        width: 120 * SCALE,
        height: 120 * SCALE,
        marginBottom: 20 * SCALE,
    },
    pointsTitle: {
        fontSize: 20 * SCALE,
        color: theme.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    pointsSubtitle: {
        fontSize: 16 * SCALE,
        color: theme.textSecondary,
        textAlign: 'center',
        marginTop: 8 * SCALE,
    },
});