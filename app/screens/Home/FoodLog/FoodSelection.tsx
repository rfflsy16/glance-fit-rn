import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Animated,
    ScrollView,
    Easing,
} from 'react-native';
import { FoodItem } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 430; // 430 adalah base width iPhone 14 Pro Max

// Data dummy makanan
const FOOD_DATA: FoodItem[] = [
    { id: 1, name: 'Nasi putih', portion: '1 Porsi', calories: 195, category: 'Nasi', carbs: 45, fat: 0.5, protein: 4.5, mealTime: 'breakfast' },
    { id: 2, name: 'Ayam Bakar', portion: '1 Potong', calories: 180, category: 'Daging', carbs: 0, fat: 10, protein: 20, mealTime: 'breakfast' },
    { id: 3, name: 'Ayam Geprek', portion: '1 Porsi 300 (g)', calories: 789, category: 'Daging', carbs: 100, fat: 40, protein: 50, mealTime: 'breakfast' },
    { id: 4, name: 'Ayam Goreng McD - Regular', portion: '100 (g)', calories: 223, category: 'Daging', carbs: 30, fat: 12, protein: 15, mealTime: 'breakfast' },
    { id: 5, name: 'Bakso Ayam', portion: '1 Kemasan', calories: 342, category: 'Daging', carbs: 40, fat: 15, protein: 20, mealTime: 'breakfast' },
    { id: 6, name: 'Telur Dadar', portion: '1 Besar', calories: 130, category: 'Lainnya', carbs: 1, fat: 9, protein: 12, mealTime: 'breakfast' },
    { id: 7, name: 'Sate Ayam', portion: '10 Tusuk', calories: 1000, category: 'Daging', carbs: 100, fat: 50, protein: 70, mealTime: 'breakfast' },
    { id: 8, name: 'Steak Sapi', portion: '1 Porsi (300g)', calories: 344, category: 'Daging', carbs: 0, fat: 20, protein: 30, mealTime: 'breakfast' },
];

// Filter kategori
const CATEGORIES = ['Semua', 'Nasi', 'Ikan', 'Sayur', 'Daging', 'Lainnya'];

interface FoodSelectionProps {
    onComplete: (foods: FoodItem[], totalNutrition: {
        calories: number;
        carbs: number;
        fat: number;
        protein: number;
    }) => void;
    onSearchFocus: (focused: boolean) => void;
}

export default function FoodSelection({ onComplete, onSearchFocus }: FoodSelectionProps) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedFoods, setSelectedFoods] = useState<number[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(FOOD_DATA);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    
    const buttonAnim = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    const searchAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(1)).current;
    const listAnim = useRef(new Animated.Value(0)).current;
    
    // Filter makanan berdasarkan kategori dan search
    useEffect(() => {
        let filtered = FOOD_DATA;
        
        // Filter by category
        if (selectedCategory !== 'Semua') {
            filtered = filtered.filter(food => food.category === selectedCategory);
        }
        
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(food => 
                food.name.toLowerCase().includes(query)
            );
        }
        
        setFilteredFoods(filtered);
    }, [selectedCategory, searchQuery]);
    
    // Update animation logic
    useEffect(() => {
        if (selectedFoods.length > 0) {
            // Animate in
            Animated.parallel([
                Animated.spring(buttonAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.spring(buttonAnim, {
                    toValue: 100,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [selectedFoods]);

    const toggleFoodSelection = (id: number) => {
        setSelectedFoods(prev => {
            if (prev.includes(id)) {
                return prev.filter(foodId => foodId !== id);
            } else {
                return [...prev, id];
            }
        });
    };
    
    const handleAddFoods = () => {
        const selectedFoodItems = selectedFoods.map(id => ({
            ...FOOD_DATA.find(food => food.id === id)!,
            mealTime: 'breakfast' as const
        }));

        const totalNutrition = selectedFoodItems.reduce((acc, food) => ({
            calories: acc.calories + food.calories,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
            protein: acc.protein + food.protein
        }), {
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0
        });

        onComplete(selectedFoodItems, totalNutrition);
    };

    const animateSearch = (focused: boolean) => {
        Animated.parallel([
            // Update animasi search bar
            Animated.spring(searchAnim, {
                toValue: focused ? 1 : 0,
                friction: 12,
                tension: 30,
                useNativeDriver: true
            }),
            // Animasi header & kategori
            Animated.timing(headerAnim, {
                toValue: focused ? 0 : 1,
                duration: 300,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true
            }),
            // Animasi list
            Animated.timing(listAnim, {
                toValue: focused ? 1 : 0,
                duration: 300,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true
            })
        ]).start();
    };

    const handleSearchFocus = (focused: boolean) => {
        if (focused !== isSearchFocused) {
            setIsSearchFocused(focused);
            onSearchFocus(focused);
            animateSearch(focused);
        }
    };

    const handleFoodItemPress = (id: number) => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
        toggleFoodSelection(id);
    };

    const handleCloseSearch = () => {
        handleSearchFocus(false);
        setSearchQuery('');
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const inputRef = useRef<TextInput>(null);

    return (
        <View style={[styles(theme).container]}>
            <Animated.View style={[
                styles(theme).searchContainer,
                {
                    transform: [{
                        translateY: searchAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -(16 * SCALE)]
                        })
                    }]
                }
            ]}>
                <TextInput 
                    ref={inputRef}
                    style={styles(theme).searchInput}
                    placeholder="Cari makanan / minuman"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize='none'
                    onFocus={() => handleSearchFocus(true)}
                    onBlur={() => handleSearchFocus(false)}
                />
                <TouchableOpacity onPress={handleCloseSearch}>
                    {isSearchFocused ? (
                        <Ionicons name="close" size={20} color="#999" />
                    ) : (
                        <Ionicons name="search" size={20} color="#999" />
                    )}
                </TouchableOpacity>
            </Animated.View>
            
            {/* Header & Category dengan animasi */}
            <Animated.View style={{
                opacity: headerAnim,
                transform: [{
                    translateY: headerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * SCALE, 0]
                    })
                }]
            }}>
                {!isSearchFocused && (
                    <View>
                        <View style={styles(theme).categoryOuterContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles(theme).categoryScrollContainer}
                            >
                                {CATEGORIES.map((category, index) => (
                                    <TouchableOpacity 
                                        key={category}
                                        style={[
                                            styles(theme).categoryButton,
                                            selectedCategory === category && styles(theme).categoryButtonActive,
                                            index === CATEGORIES.length - 1 && { marginRight: 0 }
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <Text 
                                            style={[
                                                styles(theme).categoryText,
                                                selectedCategory === category && styles(theme).categoryTextActive
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <Text style={styles(theme).listTitle}>
                            Daftar makanan dan minuman
                        </Text>
                    </View>
                )}
            </Animated.View>

            {/* List dengan animasi */}
            <Animated.View style={{
                flex: 1,
                transform: [{
                    translateY: listAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -40 * SCALE]
                    })
                }]
            }}>
                <View style={styles(theme).listSection}>
                    <FlatList
                        data={filteredFoods}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={[
                            styles(theme).listContent,
                            isSearchFocused && { paddingTop: 60 * SCALE }
                        ]}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles(theme).foodItem}
                                onPress={() => handleFoodItemPress(item.id)}
                            >
                                <View style={styles(theme).foodInfo}>
                                    <Text style={styles(theme).foodName}>{item.name}</Text>
                                    <Text style={styles(theme).foodPortion}>
                                        {item.portion} • {item.calories} kcal
                                    </Text>
                                </View>
                                <TouchableOpacity 
                                    style={[
                                        styles(theme).checkbox,
                                        selectedFoods.includes(item.id) && styles(theme).checkboxChecked
                                    ]}
                                    onPress={() => handleFoodItemPress(item.id)}
                                >
                                    {selectedFoods.includes(item.id) && (
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Animated.View>
            
            {/* Updated Button & Counter with opacity animation */}
            <Animated.View
                style={[
                    styles(theme).bottomContainer,
                    { 
                        transform: [{ translateY: buttonAnim }],
                        opacity: opacityAnim 
                    }
                ]}
            >
                <Text style={styles(theme).itemCountText}>
                    {selectedFoods.length} item
                </Text>
                
                <TouchableOpacity
                    style={styles(theme).addButton}
                    onPress={handleAddFoods}
                    activeOpacity={0.8}
                >
                    <Text style={styles(theme).addButtonText}>Tambahkan</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = (theme: Theme) => {
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const SCALE = SCREEN_WIDTH / 430;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background,
            borderRadius: 12 * SCALE,
            paddingHorizontal: 12 * SCALE,
            marginVertical: 16 * SCALE,
            marginHorizontal: 16 * SCALE,
            height: 48 * SCALE,
            zIndex: 1000,
            elevation: 3,
        },
        searchInput: {
            flex: 1,
            fontSize: 16 * SCALE,
            color: theme.textPrimary,
            height: '100%',
            marginRight: 8 * SCALE,
        },
        categoryOuterContainer: {
            height: 44 * SCALE,
            marginBottom: 16 * SCALE,
        },
        categoryScrollContainer: {
            paddingLeft: 16 * SCALE,
        },
        categoryButton: {
            paddingHorizontal: 16 * SCALE,
            paddingVertical: 8 * SCALE,
            borderRadius: 50 * SCALE,
            borderWidth: 1 * SCALE,
            borderColor: '#2B6872',
            marginRight: 8 * SCALE,
            backgroundColor: '#FFF',
            height: 36 * SCALE,
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryButtonActive: {
            backgroundColor: '#2B6872',
            borderColor: '#2B6872',
        },
        categoryText: {
            color: '#2B6872',
            fontSize: 14 * SCALE,
        },
        categoryTextActive: {
            color: '#FFFFFF',
        },
        listSection: {
            flex: 1,
            paddingHorizontal: 16 * SCALE,
        },
        listTitle: {
            fontSize: 18 * SCALE,
            fontWeight: '500',
            color: theme.textPrimary,
            marginBottom: 16 * SCALE,
            marginHorizontal: 16 * SCALE,
        },
        listContent: {
            paddingBottom: 120 * SCALE,
            paddingTop: 16 * SCALE,
        },
        foodItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16 * SCALE,
            borderBottomWidth: 1 * SCALE,
            borderBottomColor: '#EEEEEE',
        },
        foodInfo: {
            flex: 1,
        },
        foodName: {
            fontSize: 16 * SCALE,
            color: theme.textPrimary,
            marginBottom: 4 * SCALE,
            fontWeight: '500',
        },
        foodPortion: {
            fontSize: 14 * SCALE,
            color: '#9E9E9E',
        },
        checkbox: {
            width: 24 * SCALE,
            height: 24 * SCALE,
            borderRadius: 2 * SCALE,
            borderWidth: 1 * SCALE,
            borderColor: '#BDBDBD',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
        },
        checkboxChecked: {
            backgroundColor: '#2B6872',
            borderColor: '#2B6872',
        },
        bottomContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.background,
            paddingHorizontal: 16 * SCALE,
            paddingTop: 8 * SCALE,
            paddingBottom: 24 * SCALE,
            borderTopWidth: 1 * SCALE,
            borderTopColor: '#EEEEEE',
        },
        itemCountText: {
            fontSize: 14 * SCALE,
            color: theme.textPrimary,
            textAlign: 'left',
            marginLeft: 16 * SCALE,
            marginBottom: 12 * SCALE,
        },
        addButton: {
            backgroundColor: '#2B6872',
            borderRadius: 8 * SCALE,
            paddingVertical: 16 * SCALE,
            alignItems: 'center',
            marginHorizontal: 16 * SCALE,
            marginBottom: 16 * SCALE,
        },
        addButtonText: {
            color: '#FFFFFF',
            fontSize: 16 * SCALE,
            fontWeight: '600',
        },
    });
};