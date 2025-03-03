import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tipe data utk drink item
interface DrinkItem {
    id: 'glass' | 'bottle' | 'large-bottle';
    name: string;
    amount: number;
    size: string;
    color?: string;
}

// Data minuman yg tersedia
const DRINK_ITEMS: DrinkItem[] = [
    {
        id: 'glass',
        name: 'Gelas',
        amount: 8,
        size: '(8 ons)',
        color: '#2B6872'
    },
    {
        id: 'bottle',
        name: 'Botol',
        amount: 168,
        size: '(168 ons)',
        color: '#2B6872'
    },
    {
        id: 'large-bottle', 
        name: 'Botol besar',
        amount: 24,
        size: '(24 ons)',
        color: '#2B6872'
    }
];

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

    // Hitung total minuman
    const totalAmount = Object.entries(drinkAmounts).reduce((total, [id, count]) => {
        const drink = DRINK_ITEMS.find(item => item.id === id);
        return total + (drink?.amount || 0) * count;
    }, 0);

    // Target minuman harian (64 ons)
    const TARGET_AMOUNT = 64;

    // Cek apakah ada input
    const hasInput = Object.values(drinkAmounts).some(amount => amount > 0);

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
                    <TouchableOpacity style={styles(theme).dateArrow}>
                        <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles(theme).dateText}>{selectedDate}</Text>
                    <TouchableOpacity style={styles(theme).dateArrow}>
                        <Ionicons name="chevron-forward" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={styles(theme).divider} />

                <View style={styles(theme).summaryContainer}>
                    <View style={styles(theme).summaryLeft}>
                        <View style={styles(theme).waterIconContainer}>
                            <Ionicons name="water" size={24} color={theme.textPrimary} />
                        </View>
                        <Text style={styles(theme).summaryTitle}>Air</Text>
                    </View>
                    <View style={styles(theme).summaryRight}>
                        <View style={styles(theme).summaryItem}>
                            <Text style={styles(theme).summaryLabel}>Total</Text>
                            <Text style={styles(theme).summaryValue}>{totalAmount} ons</Text>
                        </View>
                        <View style={styles(theme).summaryItem}>
                            <Text style={styles(theme).summaryLabel}>Target</Text>
                            <Text style={styles(theme).summaryValue}>{TARGET_AMOUNT} ons</Text>
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
                                item.id !== 'glass' && { backgroundColor: '#E6F7F8' }
                            ]}>
                                <Ionicons 
                                    name={item.id === 'glass' ? 'water' : 'beer'} 
                                    size={24} 
                                    color={item.color} 
                                />
                            </View>
                            <View style={styles(theme).drinkTexts}>
                                <Text style={styles(theme).drinkName}>{item.name}</Text>
                                <Text style={styles(theme).drinkSize}>{item.size}</Text>
                            </View>
                        </View>
                        <View style={styles(theme).amountControl}>
                            <Text style={styles(theme).amountUnit}>ons</Text>
                            <View style={styles(theme).amountActions}>
                                <TouchableOpacity 
                                    style={[
                                        styles(theme).amountButton,
                                        drinkAmounts[item.id] === 0 && styles(theme).amountButtonDisabled
                                    ]}
                                    onPress={() => {
                                        const newAmount = Math.max(0, (drinkAmounts[item.id] || 0) - 1);
                                        setDrinkAmounts({...drinkAmounts, [item.id]: newAmount});
                                    }}
                                >
                                    <Text style={[
                                        styles(theme).amountButtonText,
                                        drinkAmounts[item.id] === 0 && styles(theme).amountButtonTextDisabled
                                    ]}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles(theme).amountValue}>
                                    {drinkAmounts[item.id] || 0}
                                </Text>
                                <TouchableOpacity 
                                    style={styles(theme).amountButton}
                                    onPress={() => {
                                        const newAmount = (drinkAmounts[item.id] || 0) + 1;
                                        setDrinkAmounts({...drinkAmounts, [item.id]: newAmount});
                                    }}
                                >
                                    <Text style={styles(theme).amountButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles(theme).amountDivider} />
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                style={[
                    styles(theme).submitButton,
                    hasInput && { backgroundColor: theme.primary }
                ]}
            >
                <Text style={[
                    styles(theme).submitButtonText,
                    hasInput && { color: 'white' }
                ]}>
                    Catat ini
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = (theme: Theme, insets?: { top: number; bottom: number }) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
        margin: 16,
        backgroundColor: theme.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dateArrow: {
        padding: 4,
    },
    dateText: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    summaryLeft: {
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
    summaryTitle: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    summaryRight: {
        flexDirection: 'row',
        gap: 24,
    },
    summaryItem: {
        alignItems: 'flex-end',
    },
    summaryLabel: {
        fontSize: 14,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    summaryValue: {
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
        paddingHorizontal: 16,
        gap: 12,
    },
    drinkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    drinkInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    drinkIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    drinkTexts: {
        gap: 4,
    },
    drinkName: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    drinkSize: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    amountControl: {
        alignItems: 'flex-end',
    },
    amountUnit: {
        fontSize: 12,
        color: theme.textSecondary,
        marginBottom: 4,
    },
    amountActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amountButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountButtonText: {
        fontSize: 20,
        color: theme.textPrimary,
    },
    amountValue: {
        fontSize: 16,
        color: theme.textPrimary,
        minWidth: 24,
        textAlign: 'center',
    },
    amountDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E7EB',
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
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        alignItems: 'center',
        position: 'absolute',
        bottom: insets?.bottom || 16,
        left: 0,
        right: 0,
    },
    submitButtonText: {
        fontSize: 16,
        color: theme.textSecondary,
        fontWeight: '500',
    },
});