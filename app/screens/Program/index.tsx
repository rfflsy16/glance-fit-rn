import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useState } from 'react';
import Card from './common/Card';

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

// Data kategori
const categories = [
    { id: 1, name: 'Semua' },
    { id: 2, name: 'Fokus' },
    { id: 3, name: 'Kebugaran' }, 
    { id: 4, name: 'Diet' },
    { id: 5, name: 'Kekuatan' }
];

// Data rekomendasi program
export const recommendations: Program[] = [
    {
        id: 1,
        title: "Gain Weight in 21 Days",
        duration: "3 Minggu",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        category: "Kebugaran",
        about: "Tentang Program Ini",
        description: "Sulit utk menaikan berat badan, padahal sudah mencoba berbagai cara? tenang, Program Gain Weight in 21 Days dari Glance Fit dirancang khusus utk membantumu mencapai berat badan ideal dgn metode yg sehat dan terbukti efektif.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1",
                subtitle: "Menetapkan strategi yg tepat"
            },
            {
                id: 2,
                title: "Minggu ke 2", 
                subtitle: "Mengoptimalkan pola makan"
            },
            {
                id: 3,
                title: "Minggu ke 3",
                subtitle: "Mempertahankan dan meningkatkan hasil"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Timbang badan",
                icon: "scale-outline"
            },
            {
                id: 2,
                name: "Matras olahraga",
                icon: "fitness-outline"
            },
            {
                id: 3,
                name: "Pakaian olahraga",
                icon: "shirt-outline"
            },
            {
                id: 4,
                name: "Sepatu olahraga",
                icon: "footsteps-outline"
            }
        ]
    },
    {
        id: 2,
        title: "Diet Sehat 30 Hari",
        duration: "4 Minggu",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        category: "Diet",
        about: "Tentang Program Ini",
        description: "Program diet sehat yg dirancang khusus utk membantumu mencapai berat badan ideal tanpa merusak metabolisme tubuh. Dgn panduan lengkap dan metode yg terbukti efektif.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1",
                subtitle: "Mengenal pola makan sehat"
            },
            {
                id: 2,
                title: "Minggu ke 2",
                subtitle: "Mengatur porsi makanan"
            },
            {
                id: 3,
                title: "Minggu ke 3",
                subtitle: "Kombinasi makanan tepat"
            },
            {
                id: 4,
                title: "Minggu ke 4",
                subtitle: "Mempertahankan pola makan"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Timbang badan",
                icon: "scale-outline"
            },
            {
                id: 2,
                name: "Food container",
                icon: "restaurant-outline"
            },
            {
                id: 3,
                name: "Food scale",
                icon: "calculator-outline"
            }
        ]
    },
    {
        id: 3,
        title: "Cardio untuk Pemula",
        duration: "4 Minggu",
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800",
        category: "Kebugaran",
        about: "Tentang Program Ini",
        description: "Program cardio yg dirancang khusus utk pemula. Tingkatkan stamina dan kesehatan jantung dgn latihan yg menyenangkan.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1",
                subtitle: "Pengenalan cardio dasar"
            },
            {
                id: 2,
                title: "Minggu ke 2",
                subtitle: "Peningkatan intensitas"
            },
            {
                id: 3,
                title: "Minggu ke 3",
                subtitle: "Variasi latihan"
            },
            {
                id: 4,
                title: "Minggu ke 4",
                subtitle: "High intensity cardio"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Sepatu olahraga",
                icon: "footsteps-outline"
            },
            {
                id: 2,
                name: "Pakaian olahraga",
                icon: "shirt-outline"
            },
            {
                id: 3,
                name: "Matras",
                icon: "fitness-outline"
            }
        ]
    }
];

// Data program eksklusif
export const exclusivePrograms: Program[] = [
    {
        id: 4,
        title: "Meditasi untuk Fokus",
        duration: "2 Minggu",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
        category: "Fokus",
        about: "Tentang Program Ini",
        description: "Program meditasi yg cocok utk pemula. Tingkatkan fokus dan produktivitas dgn teknik meditasi yg mudah dipraktekkan sehari-hari.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1",
                subtitle: "Dasar-dasar meditasi"
            },
            {
                id: 2,
                title: "Minggu ke 2",
                subtitle: "Teknik meditasi lanjutan"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Matras yoga",
                icon: "fitness-outline"
            },
            {
                id: 2,
                name: "Bantal meditasi",
                icon: "bed-outline"
            }
        ]
    },
    {
        id: 5,
        title: "Kekuatan Otot Dasar",
        duration: "6 Minggu",
        image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800",
        category: "Kekuatan",
        about: "Tentang Program Ini",
        description: "Program latihan kekuatan dasar utk membentuk otot dan meningkatkan stamina. Cocok utk pemula yg ingin memulai journey fitness.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1-2",
                subtitle: "Dasar-dasar gerakan"
            },
            {
                id: 2,
                title: "Minggu ke 3-4",
                subtitle: "Peningkatan beban"
            },
            {
                id: 3,
                title: "Minggu ke 5-6",
                subtitle: "Variasi gerakan"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Matras olahraga",
                icon: "fitness-outline"
            },
            {
                id: 2,
                name: "Dumbbell ringan",
                icon: "barbell-outline"
            },
            {
                id: 3,
                name: "Resistance band",
                icon: "infinite-outline"
            }
        ]
    },
    {
        id: 6,
        title: "Yoga untuk Pemula",
        duration: "3 Minggu",
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
        category: "Fokus",
        about: "Tentang Program Ini",
        description: "Program yoga dasar utk pemula. Tingkatkan fleksibilitas dan ketenangan pikiran dgn gerakan yoga yg aman dan mudah diikuti.",
        weeks: [
            {
                id: 1,
                title: "Minggu ke 1",
                subtitle: "Pengenalan yoga dasar"
            },
            {
                id: 2,
                title: "Minggu ke 2",
                subtitle: "Asana untuk pemula"
            },
            {
                id: 3,
                title: "Minggu ke 3",
                subtitle: "Flow yoga sederhana"
            }
        ],
        equipment: [
            {
                id: 1,
                name: "Matras yoga",
                icon: "fitness-outline"
            },
            {
                id: 2,
                name: "Yoga block",
                icon: "cube-outline"
            },
            {
                id: 3,
                name: "Yoga strap",
                icon: "infinite-outline"
            }
        ]
    }
];

export default function ProgramScreen() {
    const { width, height } = useWindowDimensions();
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
            style={[styles(theme, width, height).container, { paddingTop: insets.top }]}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles(theme, width, height).pageTitle}>Program</Text>
            
            {/* Categories */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles(theme, width, height).categoriesContainer}
            >
                {categories.map(category => (
                    <TouchableOpacity 
                        key={category.id}
                        style={[
                            styles(theme, width, height).categoryButton,
                            selectedCategory === category.name && styles(theme, width, height).categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory(category.name)}
                    >
                        <Text style={[
                            styles(theme, width, height).categoryText,
                            selectedCategory === category.name && styles(theme, width, height).categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Rekomendasi */}
            <View style={styles(theme, width, height).section}>
                <Text style={styles(theme, width, height).sectionTitle}>Rekomendasi untukmu</Text>
                <Text style={styles(theme, width, height).sectionSubtitle}>
                    Temukan yang sesuai dengan kebutuhanmu
                </Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme, width, height).programsContainer}
                >
                    {filteredRecommendations.map((item, index) => (
                        <View 
                            key={item.id} 
                            style={[
                                styles(theme, width, height).cardWrapper,
                                index === 0 && { marginLeft: 16 },
                                index === filteredRecommendations.length - 1 && { marginRight: 16 }
                            ]}
                        >
                            {renderProgramCard({ item })}
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Program Eksklusif */}
            <View style={styles(theme, width, height).section}>
                <Text style={styles(theme, width, height).sectionTitle}>Program eksklusif dari Glance Fit</Text>
                <Text style={styles(theme, width, height).sectionSubtitle}>
                    Temukan yang sesuai dengan kebutuhanmu
                </Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme, width, height).programsContainer}
                >
                    {filteredExclusives.map((item, index) => (
                        <View 
                            key={item.id}
                            style={[
                                styles(theme, width, height).cardWrapper,
                                index === 0 && { marginLeft: 16 },
                                index === filteredExclusives.length - 1 && { marginRight: 16 }
                            ]}
                        >
                            {renderProgramCard({ item, exclusive: true })}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = (theme: Theme, width: number, height: number) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    pageTitle: {
        fontSize: width * 0.06,
        fontWeight: '600',
        color: theme.textPrimary,
        marginHorizontal: width * 0.04,
        marginVertical: height * 0.02,
        textAlign: 'center'
    },
    categoriesContainer: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        gap: width * 0.02
    },
    categoryButton: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        borderRadius: width * 0.05,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: width * 0.02
    },
    categoryButtonActive: {
        backgroundColor: theme.primary,
        borderColor: theme.primary
    },
    categoryText: {
        fontSize: width * 0.035,
        color: theme.textPrimary
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontWeight: '500'
    },
    section: {
        paddingTop: height * 0.03
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: height * 0.005,
        marginHorizontal: width * 0.04
    },
    sectionSubtitle: {
        fontSize: width * 0.035,
        color: theme.textSecondary,
        marginBottom: height * 0.02,
        marginHorizontal: width * 0.04
    },
    programsContainer: {
        paddingBottom: height * 0.02,
    },
    cardWrapper: {
        marginRight: width * 0.03
    },
    programCard: {
        width: width * 0.7,
        borderRadius: width * 0.03,
        backgroundColor: theme.cardBackground,
        overflow: 'hidden',
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
        height: height * 0.2,
        resizeMode: 'cover'
    },
    programInfo: {
        padding: width * 0.03
    },
    programTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: height * 0.01
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.01
    },
    durationText: {
        fontSize: width * 0.035,
        color: theme.textSecondary
    }
});