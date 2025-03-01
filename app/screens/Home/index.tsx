import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width dari design

// Data untuk aktivitas harian
const dailyActivities = [
    { 
        id: 1, 
        icon: 'walk', 
        title: 'Jalan kaki minimal 4000 langkah',
        points: 30,
        status: 'active'
    },
    { 
        id: 2, 
        icon: 'restaurant', 
        title: 'Catat konsumsi makanan',
        points: 20,
        status: 'active'
    },
    { 
        id: 3, 
        icon: 'flame', 
        title: 'Bakar kalori min. 300 kalori',
        points: 25,
        status: 'active'
    },
    { 
        id: 4, 
        icon: 'walk', 
        title: 'Lari minimal 10 menit',
        points: 0,
        status: 'completed'
    }
];

// Data untuk tantangan
const challenges = [
    {
        id: 1,
        title: 'Jalan kaki pagi hari 30 menit',
        date: '13 - 17 Agustus',
    },
    {
        id: 2,
        title: 'Jalan kaki 10.000 langkah',
        date: '28 - 30 Agustus',
    }
];

// Data untuk artikel
const articles = [
    {
        id: 1,
        title: 'Tingkatkan Stamina dengan Latihan Ka...',
        image: 'https://picsum.photos/seed/fitness1/400/300'
    },
    {
        id: 2,
        title: 'Panduan Lengkap Latihan Beban un...',
        image: 'https://picsum.photos/seed/gym1/400/300'
    },
    {
        id: 3,
        title: 'Basic Movement yang Perlu Kamu...',
        image: 'https://picsum.photos/seed/workout1/400/300'
    }
];

export default function Home() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={[styles(theme).container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles(theme).header}>
                    <View style={styles(theme).headerLeft}>
                        <View style={styles(theme).pointBadge}>
                            <Text style={styles(theme).pointIcon}>P</Text>
                            <Text style={styles(theme).pointText}>100 Poin</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles(theme).headerCenter}>
                        <TouchableOpacity style={styles(theme).backButton}>
                            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles(theme).headerTitle}>Hari Ini</Text>
                        <TouchableOpacity>
                            <Ionicons name="calendar-outline" size={24} color={theme.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Circle */}
                <View style={styles(theme).statsContainer}>
                    <View style={styles(theme).circleContainer}>
                        <View style={styles(theme).circle}>
                            <Text style={styles(theme).circleNumber}>0</Text>
                            <Text style={styles(theme).circleLabel}>Langkah</Text>
                        </View>
                    </View>
                    
                    {/* Stats Icons */}
                    <View style={styles(theme).statsIconsContainer}>
                        <View style={styles(theme).statItem}>
                            <View style={[styles(theme).statIcon, { backgroundColor: '#E6F4EA' }]}>
                                <Ionicons name="flag-outline" size={20} color="#34A853" />
                            </View>
                            <Text style={styles(theme).statValue}>0</Text>
                            <Text style={styles(theme).statLabel}>-</Text>
                        </View>
                        <View style={styles(theme).statItem}>
                            <View style={[styles(theme).statIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="gift-outline" size={20} color="#F59E0B" />
                            </View>
                            <Text style={styles(theme).statValue}>0</Text>
                            <Text style={styles(theme).statLabel}>K.Cal</Text>
                        </View>
                        <View style={styles(theme).statItem}>
                            <View style={[styles(theme).statIcon, { backgroundColor: '#E0F2F1' }]}>
                                <Ionicons name="flame-outline" size={20} color="#2B6872" />
                            </View>
                            <Text style={styles(theme).statValue}>0</Text>
                            <Text style={styles(theme).statLabel}>Kal</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Progress Card */}
                <View style={styles(theme).profileCard}>
                    <Text style={styles(theme).profileCardTitle}>
                        Profile anda baru saja dimulai!
                    </Text>
                    <Text style={styles(theme).profileCardSubtitle}>
                        Jawab beberapa pertanyaan untuk lengkapi informasi profil
                    </Text>
                    <View style={styles(theme).progressBarContainer}>
                        <View style={styles(theme).progressContainer}>
                            <View style={styles(theme).progressFill}>
                                <View style={styles(theme).progressDot} />
                            </View>
                        </View>
                        <Text style={styles(theme).percentageText}>30%</Text>
                    </View>
                </View>

                {/* Daily Activities */}
                <View style={styles(theme).activitiesSection}>
                    <Text style={styles(theme).sectionTitle}>Aktivitas harian</Text>
                    <View style={styles(theme).activitiesContainer}>
                        {dailyActivities.map((activity) => (
                            <View key={activity.id} style={styles(theme).activityCard}>
                                <View style={[
                                    styles(theme).activityIconContainer,
                                    activity.status === 'completed' && styles(theme).activityIconCompleted
                                ]}>
                                    <Ionicons 
                                        name={activity.icon as any} 
                                        size={20} 
                                        color={activity.status === 'completed' ? theme.textSecondary : theme.primary} 
                                    />
                                </View>
                                <View style={styles(theme).activityContent}>
                                    <Text style={[
                                        styles(theme).activityTitle,
                                        activity.status === 'completed' && styles(theme).activityTitleCompleted
                                    ]}>
                                        {activity.title}
                                    </Text>
                                    {activity.status === 'completed' ? (
                                        <Text style={styles(theme).activityStatus}>Selesai</Text>
                                    ) : (
                                        <Text style={styles(theme).activityPoints}>+{activity.points} Poin</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Challenges */}
                <Text style={styles(theme).sectionTitle}>Tantangan</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).challengesContainer}
                >
                    {challenges.map((challenge) => (
                        <View key={challenge.id} style={styles(theme).challengeCard}>
                            <Image source={require('@/assets/images/challenge.png')} style={styles(theme).challengeImage} />
                            <Text style={styles(theme).challengeTitle}>{challenge.title}</Text>
                            <Text style={styles(theme).challengeDate}>{challenge.date}</Text>
                            <TouchableOpacity style={styles(theme).joinButton}>
                                <Text style={styles(theme).joinButtonText}>Gabung</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {/* Articles */}
                <Text style={styles(theme).sectionTitle}>Artikel</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).articlesContainer}
                >
                    {articles.map((article) => (
                        <TouchableOpacity key={article.id} style={styles(theme).articleCard}>
                            <Image 
                                source={{ uri: article.image }} 
                                style={styles(theme).articleImage} 
                            />
                            <Text style={styles(theme).articleTitle} numberOfLines={2}>
                                {article.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles(theme).addButton}>
                <Ionicons name="add" size={24} color={theme.background} />
            </TouchableOpacity>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        paddingHorizontal: 16 * SCALE,
        gap: 16,
        marginBottom: 32 * SCALE,
    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pointBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    pointIcon: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    pointText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    statsContainer: {
        alignItems: 'center',
        marginBottom: 24 * SCALE,
    },
    circleContainer: {
        marginBottom: 24 * SCALE,
    },
    circle: {
        width: 200 * SCALE,
        height: 200 * SCALE,
        borderRadius: (200 * SCALE) / 2,
        borderWidth: 16,
        borderColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: theme.textPrimary,
    },
    circleLabel: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    statsIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.textSecondary,
    },
    
    profileCard: {
        marginHorizontal: 16 * SCALE,
        padding: 20,
        paddingRight: 72,
        backgroundColor: '#F0FDFA',
        borderRadius: 24,
        marginBottom: 28 * SCALE,
        position: 'relative',
    },
    profileCardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2B6872',
        marginBottom: 8,
    },
    profileCardSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
        lineHeight: 20,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: -56,
    },
    progressContainer: {
        flex: 1,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        marginRight: 8,
    },
    progressFill: {
        width: '30%',
        height: '100%',
        backgroundColor: '#2B6872',
    },
    progressDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#2B6872',
        position: 'absolute',
        right: -3,
        top: -1,
    },
    percentageText: {
        fontSize: 14,
        color: '#2B6872',
        fontWeight: '500',
        marginRight: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 20,
        marginHorizontal: 16,
        position: 'relative',
        zIndex: 0,
    },
    activitiesContainer: {
        marginHorizontal: 16 * SCALE,
        gap: 16,
        marginBottom: 32 * SCALE,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(12, 12, 13, 0.10)',
        shadowColor: 'rgba(12, 12, 13, 0.10)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    activityIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityTitle: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    activitySubtitle: {
        fontSize: 16,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    activityTitleCompleted: {
        color: theme.textSecondary,
    },
    pointContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pointBadgeSmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointBadgeText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    activityPoints: {
        fontSize: 14,
        color: theme.textPrimary,
    },
    activityStatus: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    challengesContainer: {
        paddingLeft: 16,
        paddingRight: 0,
        marginBottom: 32,
    },
    challengeCard: {
        width: 150 * SCALE,
        marginRight: 16,
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    challengeImage: {
        // alignSelf: 'center',
        width: 64,
        height: 64,
        marginBottom: 12,
    },
    challengeTitle: {
        fontSize: 16,
        width: '100%',
        fontWeight: '600',
        color: '#1F2937',
        // textAlign: 'left',
        marginVertical: 4,
        lineHeight: 24
        // paddingHorizontal: 8,
    },
    challengeDate: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
        fontStyle: 'normal',
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
    joinButton: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#0F766E',
    },
    joinButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F766E',
        textAlign: 'center',
    },
    articlesContainer: {
        paddingLeft: 16,
        paddingRight: 0,
        marginBottom: 32,
    },
    articleCard: {
        width: 152 * SCALE,
        marginRight: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        flexShrink: 0,
    },
    articleImage: {
        width: '100%',
        height: 120 * SCALE,
        borderRadius: 12,
        marginBottom: 8,
    },
    articleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    activitiesSection: {
        marginBottom: 24,
    },
    activityIconCompleted: {
        backgroundColor: '#F3F4F6',  
    },
    backButton: {
        padding: 4, 
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 32,
        width: 66,
        height: 66,
        borderRadius: 16,
        backgroundColor: '#2B6872',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});