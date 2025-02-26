import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Card from './common/Card';

interface Program {
    id: number;
    title: string;
    duration: string;
    image: string;
    category: string;
}

// Data kategori
const categories = [
    { id: 1, name: 'Semua' },
    { id: 2, name: 'Fokus' },
    { id: 3, name: 'Kebugaran' }, 
    { id: 4, name: 'Diet' },
    { id: 5, name: 'Kekuatan' }
];

// Data rekomendasi program
const recommendations = [
    {
        id: 1,
        title: 'Gain weight in 21 days',
        duration: '3 Minggu',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        category: 'Kebugaran'
    },
    {
        id: 2,
        title: 'Jaga pola makan sehat',
        duration: '4 Minggu',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        category: 'Diet'
    },
    {
        id: 3, 
        title: 'Olahraga rutin tiap hari',
        duration: '1 Minggu',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
        category: 'Kebugaran'
    }
];

// Data program eksklusif
const exclusivePrograms = [
    {
        id: 1,
        title: 'Kendalikan Stress',
        duration: '3 Minggu',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        category: 'Fokus'
    },
    {
        id: 2,
        title: 'Jaga pola makan sehat',
        duration: '4 Minggu', 
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
        category: 'Diet'
    },
    {
        id: 3,
        title: 'Olahraga rutin tiap hari',
        duration: '1 Minggu',
        image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800',
        category: 'Kebugaran'
    }
];

export default function Explore() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    // Filter programs berdasarkan kategori
    const filteredRecommendations = selectedCategory === 'Semua' 
        ? recommendations
        : recommendations.filter(item => item.category === selectedCategory);

    const filteredExclusives = selectedCategory === 'Semua'
        ? exclusivePrograms
        : exclusivePrograms.filter(item => item.category === selectedCategory);

    const renderProgramCard = ({ item, exclusive = false }: { item: Program, exclusive?: boolean }) => (
        <Card 
            item={item}
            exclusive={exclusive}
            onPress={() => {
                // Handle press
            }}
        />
    );

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
                {categories.map(category => (
                    <TouchableOpacity 
                        key={category.id}
                        style={[
                            styles(theme).categoryButton,
                            selectedCategory === category.name && styles(theme).categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory(category.name)}
                    >
                        <Text style={[
                            styles(theme).categoryText,
                            selectedCategory === category.name && styles(theme).categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Rekomendasi */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Rekomendasi untukmu</Text>
                <Text style={styles(theme).sectionSubtitle}>
                    Temukan yang sesuai dengan kebutuhanmu
                </Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).programsContainer}
                >
                    {filteredRecommendations.map(item => (
                        <View key={item.id}>
                            {renderProgramCard({ item })}
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Program Eksklusif */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Program eksklusif dari Glance Fit</Text>
                <Text style={styles(theme).sectionSubtitle}>
                    Temukan yang sesuai dengan kebutuhanmu
                </Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).programsContainer}
                >
                    {filteredExclusives.map(item => (
                        <View key={item.id}>
                            {renderProgramCard({ item, exclusive: true })}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.textPrimary,
        marginHorizontal: 16,
        marginVertical: 16,
        textAlign: 'center'
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 8
    },
    categoryButtonActive: {
        backgroundColor: theme.primary,
        borderColor: theme.primary
    },
    categoryText: {
        fontSize: 14,
        color: theme.textPrimary
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '500'
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 24
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4
    },
    sectionSubtitle: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 16
    },
    programsContainer: {
        paddingBottom: 16,
        gap: 12
    },
    programCard: {
        width: 280,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        overflow: 'hidden',
        marginRight: 12,
        elevation: 2,
        shadowColor: theme.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    programImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover'
    },
    programInfo: {
        padding: 12
    },
    programTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    durationText: {
        fontSize: 14,
        color: theme.textSecondary
    }
});