import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FoodSelection from './FoodSelection';
import FoodResult from './FoodResult';
import Header from '@/components/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface FoodLogParams {
    id?: number;
    title?: string;
    icon?: string;
    points?: number;
    status?: string;
}

export default function FoodLog() {
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();

    // Tambahkan default values atau buat optional dgn ?
    const { 
        id = 1, 
        title = "Catat konsumsi makanan", 
        icon = "restaurant", 
        points = 20, 
        status = "active" 
    } = (route.params ?? {}) as FoodLogParams;

    // Screen states, mirip dgn Activity
    const [screenState, setScreenState] = useState<
        'info' | 'selection' | 'result'
    >('selection');
    
    // State utk simpan makanan yg dipilih
    const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
    const [totalCalories, setTotalCalories] = useState(0);

    const handleBack = () => {
        if (screenState === 'result') {
            navigation.goBack();
        } else {
            navigation.goBack();
        }
    };

    const handleFoodComplete = (foods: any[], calories: number) => {
        setSelectedFoods(foods);
        setTotalCalories(calories);
        setScreenState('result');
    };

    return (
        <View style={[styles(theme, isDark).container, { paddingTop: insets.top }]}>
            <Header
                title={screenState === 'selection' ? "Pilih asupan" : "Hasil"}
                showBackButton={true}
                onPressBack={handleBack}
                rightContent={
                    screenState === 'selection' ? (
                        <TouchableOpacity>
                            <Ionicons name="bar-chart" size={24} color={theme.iconPrimary} />
                        </TouchableOpacity>
                    ) : undefined
                }
            />

            {screenState === 'selection' && (
                <FoodSelection onComplete={handleFoodComplete} />
            )}

            {screenState === 'result' && (
                <FoodResult 
                    selectedFoods={selectedFoods}
                    totalCalories={totalCalories}
                    points={points}
                />
            )}
        </View>
    );
}

const styles = (theme: Theme, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
    }); 