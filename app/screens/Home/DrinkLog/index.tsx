import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SuccessModal from './SuccessModal';

interface DrinkItem {
    id: 'glass' | 'bottle' | 'large-bottle';
    name: string;
    amount: number;
    size: string;
    icon: number; // utk require('@/assets/...')
}

const DRINK_ITEMS: DrinkItem[] = [
    {
        id: 'glass',
        name: 'Gelas',
        amount: 8,
        size: '(8 ons)',
        icon: require('@/assets/icons/glass.png')
    },
    {
        id: 'bottle',
        name: 'Botol',
        amount: 168,
        size: '(168 ons)',
        icon: require('@/assets/icons/bottle.png')
    },
    {
        id: 'large-bottle',
        name: 'Botol besar',
        amount: 24,
        size: '(24 ons)',
        icon: require('@/assets/icons/bottle.png')
    }
];

const SCALE = Dimensions.get('window').width / 375; // Base width 375 utk scaling

export default function DrinkLog() {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    const [selectedDate, setSelectedDate] = useState('Hari ini');
    const [drinkAmounts, setDrinkAmounts] = useState({
        glass: 0,
        bottle: 0,
        'large-bottle': 0
    });
    const [showModal, setShowModal] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const totalAmount = Object.entries(drinkAmounts).reduce((total, [id, count]) => {
        const drink = DRINK_ITEMS.find(item => item.id === id);
        return total + (drink?.amount || 0) * count;
    }, 0);

    const TARGET_AMOUNT = 64;

    const hasInput = Object.values(drinkAmounts).some(amount => amount > 0);

    const getIconForDrinkType = (id: string) => {
        switch (id) {
            case 'glass':
                return require('@/assets/icons/glass.png');
            case 'bottle':
            case 'large-bottle':
                return require('@/assets/icons/bottle.png');
            default:
                return require('@/assets/icons/water.png');
        }
    };

    const handleSubmit = () => {
        if (!hasInput) return;
        
        setShowModal(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto hide after 2 seconds
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowModal(false);
                // Reset form
                setDrinkAmounts({
                    glass: 0,
                    bottle: 0,
                    'large-bottle': 0
                });
                // Navigate back
                navigation.goBack();
            });
        }, 2000);
    };

    return (
        <View style={styles(theme, insets).container}>
            <View style={styles(theme).header}>
                <TouchableOpacity 
                    style={styles(theme).backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles(theme).headerTitle}>Konsumsi air</Text>
                <View style={styles(theme).headerRight} />
            </View>

            <View style={styles(theme).card}>
                <View style={styles(theme).dateSelector}>
                    <TouchableOpacity hitSlop={8}>
                        <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles(theme).dateText}>Hari ini</Text>
                    <TouchableOpacity hitSlop={8}>
                        <Ionicons name="chevron-forward" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles(theme).divider} />

                <View style={styles(theme).summary}>
                    <View style={styles(theme).waterInfo}>
                        <View style={styles(theme).waterIconContainer}>
                            <Image 
                                source={require('@/assets/icons/water.png')}
                                style={styles(theme).waterIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles(theme).waterText}>Air</Text>
                    </View>
                    <View style={styles(theme).statsContainer}>
                        <View style={styles(theme).stat}>
                            <Text style={styles(theme).statLabel}>Total</Text>
                            <Text style={styles(theme).statValue}>{totalAmount} ons</Text>
                        </View>
                        <View style={styles(theme).stat}>
                            <Text style={styles(theme).statLabel}>Target</Text>
                            <Text style={styles(theme).statValue}>{TARGET_AMOUNT} ons</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles(theme).questionText}>
                Berapa banyak Anda minum?
            </Text>

            <View style={styles(theme).drinkList}>
                {DRINK_ITEMS.map((item) => (
                    <View key={item.id} style={styles(theme).drinkItem}>
                        <View style={styles(theme).drinkInfo}>
                            <View style={[
                                styles(theme).drinkIconContainer,
                                item.id !== 'glass' && styles(theme).bottleIconContainer
                            ]}>
                                <Image 
                                    source={item.icon}
                                    style={styles(theme).icon}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles(theme).drinkTexts}>
                                <Text style={styles(theme).drinkName}>{item.name}</Text>
                                <Text style={styles(theme).drinkSize}>{item.size}</Text>
                            </View>
                        </View>
                        <View style={styles(theme).counter}>
                            <Text style={styles(theme).unit}>ons</Text>
                            <View style={styles(theme).controls}>
                                <TouchableOpacity 
                                    style={[
                                        styles(theme).controlButton,
                                        drinkAmounts[item.id] === 0 && styles(theme).amountButtonDisabled
                                    ]}
                                    onPress={() => {
                                        const newAmount = Math.max(0, (drinkAmounts[item.id] || 0) - 1);
                                        setDrinkAmounts({...drinkAmounts, [item.id]: newAmount});
                                    }}
                                >
                                    <Text style={styles(theme).controlText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles(theme).amount}>{drinkAmounts[item.id] || 0}</Text>
                                <TouchableOpacity 
                                    style={styles(theme).controlButton}
                                    onPress={() => {
                                        const newAmount = (drinkAmounts[item.id] || 0) + 1;
                                        setDrinkAmounts({...drinkAmounts, [item.id]: newAmount});
                                    }}
                                >
                                    <Text style={styles(theme).controlText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles(theme).counterDivider} />
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                style={[
                    styles(theme).submitButton,
                    hasInput && { backgroundColor: theme.primary }
                ]}
                onPress={handleSubmit}
            >
                <Text style={[
                    styles(theme).submitButtonText,
                    hasInput && { color: 'white' }
                ]}>
                    Catat ini
                </Text>
            </TouchableOpacity>

            <SuccessModal 
                visible={showModal}
                fadeAnim={fadeAnim}
                onAnimationFinish={() => {
                    // Optional: bisa tambah logic disini klo mau
                }}
            />
        </View>
    );
}

const styles = (theme: Theme, insets?: { top: number; bottom: number }) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: insets?.top,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: theme.background,
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24 * SCALE,
        height: 24 * SCALE,
        tintColor: '#1F2937', // Utk glass icon
    },
    headerTitle: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    headerRight: {
        width: 24,
    },
    card: {
        width: 343 * SCALE,
        alignSelf: 'center',
        marginVertical: 16 * SCALE,
        backgroundColor: theme.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 24,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 0,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    waterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    waterIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    waterText: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        alignItems: 'flex-end',
    },
    statLabel: {
        fontSize: 14,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textPrimary,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    drinkList: {
        paddingHorizontal: 16 * SCALE,
        gap: 12 * SCALE,
    },
    drinkItem: {
        width: 343 * SCALE,
        height: 104 * SCALE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: theme.background,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: theme.border,
    },
    drinkInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    drinkIconContainer: {
        width: 40 * SCALE,
        height: 40 * SCALE,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottleIconContainer: {
        backgroundColor: '#E6F7F8',
    },
    drinkTexts: {
        gap: 4,
    },
    drinkName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary,
    },
    drinkSize: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    counter: {
        alignItems: 'flex-end',
    },
    unit: {
        fontSize: 12,
        color: theme.textSecondary,
        marginBottom: 4,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlButton: {
        width: 24 * SCALE,
        height: 24 * SCALE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlText: {
        fontSize: 20,
        color: theme.textPrimary,
    },
    amount: {
        fontSize: 16,
        color: theme.textPrimary,
        minWidth: 24 * SCALE,
        textAlign: 'center',
    },
    counterDivider: {
        width: '100%',
        height: 1,
        backgroundColor: theme.border,
        marginTop: 4,
    },
    amountButtonDisabled: {
        opacity: 0.3,
    },
    amountButtonTextDisabled: {
        color: theme.textSecondary,
    },
    submitButton: {
        margin: 16,
        padding: 16,
        backgroundColor: theme.border,
        borderRadius: 12,
        alignItems: 'center',
        position: 'absolute',
        bottom: insets?.bottom || 16,
        left: 0,
        right: 0,
    },
    submitButtonText: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    waterIcon: {
        width: 24 * SCALE,
        height: 24 * SCALE,
        tintColor: '#1F2937',
    },
});