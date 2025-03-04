import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FoodSelection from './FoodSelection';
import Header from '@/components/Header';
import Nutrition from './Nutrition';
import { FoodItem } from './types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

export default function FoodLog() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();   
    const navigation = useNavigation();
    const route = useRoute();

    const [screenState, setScreenState] = useState<'selection' | 'nutrition'| 'meal'>('selection');
    const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
    const [totalNutrition, setTotalNutrition] = useState({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    });
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const slideAnim = useState(new Animated.Value(0))[0];
    
    const animateScreen = (forward: boolean) => {
        Animated.timing(slideAnim, {
            toValue: forward ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleFoodComplete = (foods: FoodItem[], nutrition: typeof totalNutrition) => {
        setSelectedFoods(foods);
        setTotalNutrition(nutrition);
        animateScreen(true);
        setScreenState('nutrition');
    };

    const handleBack = () => {
        if (screenState === 'nutrition') {
            animateScreen(false);
            setScreenState('selection');
        } else {
            navigation.goBack();
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[styles(theme).container, { paddingTop: insets.top }]}>
                {!isSearchFocused && (
                    <Header
                        title={screenState === 'selection' ? "Pilih asupan" : "Catat Asupan"}
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
                )}
                
                <Animated.View style={{
                    flex: 1,
                    flexDirection: 'row',
                    transform: [{
                        translateX: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -SCREEN_WIDTH]
                        })
                    }]
                }}>
                    <View style={{ width: SCREEN_WIDTH }}>
                        <FoodSelection 
                            onComplete={handleFoodComplete} 
                            onSearchFocus={(focused) => setIsSearchFocused(focused)}
                        />
                    </View>
                    
                    <View style={{ width: SCREEN_WIDTH }}>
                        <Nutrition 
                            selectedFoods={selectedFoods}
                            totalNutrition={totalNutrition}
                        />
                    </View>
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
    }); 