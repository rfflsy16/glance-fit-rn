import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';

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

// Data dummy makanan
const FOOD_DATA: FoodItem[] = [
    { id: 1, name: 'Nasi putih', portion: '1 Porsi', calories: 195, category: 'Nasi' },
    { id: 2, name: 'Ayam Bakar', portion: '1 Potong', calories: 180, category: 'Daging' },
    { id: 3, name: 'Ayam Geprek', portion: '1 Porsi 300 (g)', calories: 789, category: 'Daging' },
    { id: 4, name: 'Ayam Goreng McD - Regular', portion: '100 (g)', calories: 223, category: 'Daging' },
    { id: 5, name: 'Bakso Ayam', portion: '1 Kemasan', calories: 342, category: 'Daging' },
    { id: 6, name: 'Telur Dadar', portion: '1 Besar', calories: 130, category: 'Lainnya' },
    { id: 7, name: 'Sate Ayam', portion: '10 Tusuk', calories: 1000, category: 'Daging' },
    { id: 8, name: 'Steak Sapi', portion: '1 Porsi (300g)', calories: 344, category: 'Daging' },
];

// Filter kategori
const CATEGORIES = ['Semua', 'Nasi', 'Ikan', 'Sayur', 'Daging', 'Lainnya'];

interface FoodSelectionProps {
    onComplete: (foods: FoodItem[], calories: number) => void;
}

export default function FoodSelection({ onComplete }: FoodSelectionProps) {
    const { theme, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedFoods, setSelectedFoods] = useState<number[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(FOOD_DATA);
    
    // Tambah opacity animation
    const buttonAnim = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
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
        const foods = FOOD_DATA.filter(food => selectedFoods.includes(food.id));
        const totalCalories = foods.reduce((total, food) => total + food.calories, 0);
        onComplete(foods, totalCalories);
    };

    return (
        <View style={styles(theme).container}>
            {/* Search Bar */}
            <View style={styles(theme).searchContainer}>
                <TextInput 
                    style={styles(theme).searchInput}
                    placeholder="Cari makanan / minuman"
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Ionicons name="search" size={20} color="#999" />
            </View>
            
            {/* Category Filter - Full width */}
            <View style={styles(theme).categoryOuterContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).categoryInnerContainer}
                    style={styles(theme).categoryScrollView}
                >
                    {CATEGORIES.map(category => (
                        <TouchableOpacity 
                            key={category}
                            style={[
                                styles(theme).categoryButton,
                                selectedCategory === category && styles(theme).categoryButtonActive
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
            
            {/* Food List Section */}
            <View style={styles(theme).listSection}>
                <Text style={styles(theme).listTitle}>Daftar makanan dan minuman</Text>
                
                <FlatList
                    data={filteredFoods}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles(theme).listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles(theme).foodItem}
                            onPress={() => toggleFoodSelection(item.id)}
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
                                onPress={() => toggleFoodSelection(item.id)}
                            >
                                {selectedFoods.includes(item.id) && (
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            </View>
            
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

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginVertical: 16,
        marginHorizontal: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
        marginRight: 8,
    },
    categoryOuterContainer: {
        height: 44,
        marginBottom: 16,
        width: '100%',
    },
    categoryScrollView: {
        paddingLeft: 16, // Padding kiri sejajar dengan container
    },
    categoryInnerContainer: {
        height: 36,
        paddingRight: 16, // Padding kanan untuk item terakhir
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#2B6872',
        marginRight: 8,
        backgroundColor: theme.background,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#2B6872',
        borderColor: '#2B6872',
    },
    categoryText: {
        color: '#2B6872',
        fontSize: 14,
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    listSection: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 120, // Tambah padding biar konten terakhir tidak tertutupi
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        fontWeight: '500',
    },
    foodPortion: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 2,
        borderWidth: 1,
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
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    itemCountText: {
        fontSize: 14,
        color: theme.textPrimary,
        textAlign: 'left',
        marginLeft: 16,
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#2B6872',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});