import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useState } from 'react';
import Card from './common/Card';
import { CategoryData, getProgramsByCategory } from './constans';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width dari design

export interface Program {
    // Properties yg dipake di semua halaman
    id: number;
    title: string;
    duration: string;
    image: string;
    category: string;

    // Properties khusus halaman detail (optional)
    about?: string;
    description?: string;
    weeks?: {
        id: number;
        title: string;
        subtitle: string;
    }[];
    equipment?: {
        id: number;
        name: string;
        icon: string;
    }[];
}

export default function ProgramScreen() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default: Semua

    // Get filtered programs
    const filteredPrograms = getProgramsByCategory(selectedCategoryId);
    
    // Split programs into regular and exclusive
    const regularPrograms = filteredPrograms.filter(p => !p.isExclusive);
    const exclusivePrograms = filteredPrograms.filter(p => p.isExclusive);

    return (
        <ScrollView 
            style={[styles(theme).container, { paddingTop: insets.top }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles(theme).pageTitle}>Program</Text>
            
            {/* Categories */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles(theme).categoriesContainer}
            >
                {CategoryData.map(category => (
                    <TouchableOpacity 
                        key={category.id}
                        style={[
                            styles(theme).categoryButton,
                            selectedCategoryId === category.id && styles(theme).categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategoryId(category.id)}
                    >
                        <Text style={[
                            styles(theme).categoryText,
                            selectedCategoryId === category.id && styles(theme).categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Regular Programs */}
            {regularPrograms.length > 0 && (
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Rekomendasi untukmu</Text>
                    <Text style={styles(theme).sectionSubtitle}>
                        Temukan yg sesuai dgn kebutuhanmu
                    </Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles(theme).programsContainer}
                    >
                        {regularPrograms.map((item, index) => (
                            <View 
                                key={item.id} 
                                style={[
                                    styles(theme).cardWrapper,
                                    index === 0 && { marginLeft: 16 * SCALE },
                                    index === regularPrograms.length - 1 && { marginRight: 16 * SCALE }
                                ]}
                            >
                                <Card item={item} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Exclusive Programs */}
            {exclusivePrograms.length > 0 && (
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Program eksklusif dari Glance Fit</Text>
                    <Text style={styles(theme).sectionSubtitle}>
                        Program spesial dgn hasil maksimal
                    </Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles(theme).programsContainer}
                    >
                        {exclusivePrograms.map((item, index) => (
                            <View 
                                key={item.id}
                                style={[
                                    styles(theme).cardWrapper,
                                    index === 0 && { marginLeft: 16 * SCALE },
                                    index === exclusivePrograms.length - 1 && { marginRight: 16 * SCALE }
                                ]}
                            >
                                <Card item={item} exclusive={true} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </ScrollView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    pageTitle: {
        fontSize: 24 * SCALE,
        fontWeight: '600',
        color: theme.textPrimary,
        marginHorizontal: 16 * SCALE,
        marginVertical: 16 * SCALE,
        textAlign: 'center'
    },
    categoriesContainer: {
        paddingHorizontal: 16 * SCALE,
        paddingVertical: 8 * SCALE,
        gap: 8 * SCALE
    },
    categoryButton: {
        paddingHorizontal: 16 * SCALE,
        paddingVertical: 8 * SCALE,
        borderRadius: 20 * SCALE,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 8 * SCALE
    },
    categoryButtonActive: {
        backgroundColor: theme.primary,
        borderColor: theme.primary
    },
    categoryText: {
        fontSize: 14 * SCALE,
        color: theme.textPrimary
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '500'
    },
    section: {
        paddingTop: 24 * SCALE
    },
    sectionTitle: {
        fontSize: 20 * SCALE,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4 * SCALE,
        marginHorizontal: 16 * SCALE
    },
    sectionSubtitle: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
        marginBottom: 16 * SCALE,
        marginHorizontal: 16 * SCALE
    },
    programsContainer: {
        paddingBottom: 16 * SCALE,
    },
    cardWrapper: {
        marginRight: 12 * SCALE
    }
});