import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            {/* Points and Notification at the very top */}
            <View style={styles(theme).topContainer}>
                <View style={styles(theme).pointsBadge}>
                    <View style={styles(theme).pointsIconContainer}>
                        <Text style={styles(theme).pointsIcon}>P</Text>
                    </View>
                    <Text style={styles(theme).pointsText}>100 Poin</Text>
                </View>
                
                <TouchableOpacity style={styles(theme).notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            
            {/* Custom Header exactly like in the image */}
            <View style={styles(theme).headerContainer}>
                <TouchableOpacity style={styles(theme).backButton}>
                    <Ionicons name="chevron-back" size={28} color="#9CA3AF" />
                </TouchableOpacity>
                
                <Text style={styles(theme).headerTitle}>Hari Ini</Text>
                
                <TouchableOpacity style={styles(theme).calendarButton}>
                    <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Steps Circle */}
                <View style={styles(theme).stepsCircleContainer}>
                    <View style={styles(theme).stepsCircleOuter}>
                        <View style={styles(theme).stepsCircleInner}>
                            <Text style={styles(theme).stepsCount}>0</Text>
                            <Text style={styles(theme).stepsLabel}>Langkah</Text>
                        </View>
                    </View>
                </View>
                
                {/* Activity Stats */}
                <View style={styles(theme).activityStatsContainer}>
                    {/* Steps */}
                    <View style={styles(theme).activityStat}>
                        <View style={styles(theme).activityIconContainer}>
                            <View style={[styles(theme).iconCircle, { backgroundColor: '#E6F7EC' }]}>
                                <Ionicons name="flag" size={20} color="#22C55E" />
                            </View>
                        </View>
                        <Text style={styles(theme).activityValue}>0</Text>
                        <Text style={styles(theme).activityLabel}>-</Text>
                    </View>
                    
                    {/* Calories */}
                    <View style={styles(theme).activityStat}>
                        <View style={styles(theme).activityIconContainer}>
                            <View style={[styles(theme).iconCircle, { backgroundColor: '#FFF8E6' }]}>
                                <Ionicons name="restaurant-outline" size={20} color="#F59E0B" />
                            </View>
                        </View>
                        <Text style={styles(theme).activityValue}>0</Text>
                        <Text style={styles(theme).activityLabel}>K.Cal</Text>
                    </View>
                    
                    {/* Burned */}
                    <View style={styles(theme).activityStat}>
                        <View style={styles(theme).activityIconContainer}>
                            <View style={[styles(theme).iconCircle, { backgroundColor: '#E6F0F7' }]}>
                                <Ionicons name="water" size={20} color="#2B6872" />
                            </View>
                        </View>
                        <Text style={styles(theme).activityValue}>0</Text>
                        <Text style={styles(theme).activityLabel}>Kal</Text>
                    </View>
                </View>
                
                {/* Profile Completion Card - Updated to match image exactly */}
                <View style={styles(theme).profileCompletionCard}>
                    <View style={styles(theme).profileCompletionContent}>
                        <Text style={styles(theme).profileCompletionTitle}>
                            Profile anda baru saja dimulai!
                        </Text>
                        <Text style={styles(theme).profileCompletionSubtitle}>
                            Jawab beberapa pertanyaan untuk lengkapi informasi profil
                        </Text>
                    </View>
                    <View style={styles(theme).progressContainer}>
                        <View style={styles(theme).progressBar}>
                            <View style={[styles(theme).progressFill, { width: '30%' }]} />
                        </View>
                        <Text style={styles(theme).progressText}>30%</Text>
                    </View>
                </View>
                
                {/* Daily Activities Section - Updated to match image exactly */}
                <View style={styles(theme).sectionContainer}>
                    <Text style={styles(theme).sectionTitle}>Aktivitas harian</Text>
                </View>
                
                {/* Activity Cards - Updated to match image exactly */}
                <View style={styles(theme).activityCardsContainer}>
                    {/* Walking Card */}
                    <TouchableOpacity style={styles(theme).activityCard}>
                        <View style={styles(theme).activityCardIconContainer}>
                            <Ionicons name="walk" size={24} color="#F59E0B" />
                        </View>
                        <View style={styles(theme).activityCardTextContainer}>
                            <Text style={styles(theme).activityCardTitle}>
                                Jalan kaki minimal 4000 langkah
                            </Text>
                        </View>
                        <View style={styles(theme).activityCardPoints}>
                            <View style={styles(theme).pointCircle}>
                                <Text style={styles(theme).pointCircleText}>P</Text>
                            </View>
                            <Text style={styles(theme).activityCardPointsText}>+30 Poin</Text>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Food Tracking Card */}
                    <TouchableOpacity style={styles(theme).activityCard}>
                        <View style={[styles(theme).activityCardIconContainer, { backgroundColor: '#FFEBEB' }]}>
                            <Ionicons name="pencil" size={24} color="#EF4444" />
                        </View>
                        <View style={styles(theme).activityCardTextContainer}>
                            <Text style={styles(theme).activityCardTitle}>
                                Catat konsumsi makanan
                            </Text>
                        </View>
                        <View style={styles(theme).activityCardPoints}>
                            <View style={styles(theme).pointCircle}>
                                <Text style={styles(theme).pointCircleText}>P</Text>
                            </View>
                            <Text style={styles(theme).activityCardPointsText}>+20 Poin</Text>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Calorie Burn Card */}
                    <TouchableOpacity style={styles(theme).activityCard}>
                        <View style={[styles(theme).activityCardIconContainer, { backgroundColor: '#E6F0F7' }]}>
                            <Ionicons name="flame" size={24} color="#2B6872" />
                        </View>
                        <View style={styles(theme).activityCardTextContainer}>
                            <Text style={styles(theme).activityCardTitle}>
                                Bakar kalori min. 300 kalori
                            </Text>
                        </View>
                        <View style={styles(theme).activityCardPoints}>
                            <View style={styles(theme).pointCircle}>
                                <Text style={styles(theme).pointCircleText}>P</Text>
                            </View>
                            <Text style={styles(theme).activityCardPointsText}>+25 Poin</Text>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Running Card */}
                    <TouchableOpacity style={[styles(theme).activityCard, styles(theme).completedActivityCard]}>
                        <View style={[styles(theme).activityCardIconContainer, { backgroundColor: '#F3F4F6' }]}>
                            <Ionicons name="walk" size={24} color="#9CA3AF" />
                        </View>
                        <View style={styles(theme).activityCardTextContainer}>
                            <Text style={[styles(theme).activityCardTitle, styles(theme).completedActivityText]}>
                                Lari minimal 10 menit
                            </Text>
                        </View>
                        <View style={styles(theme).activityCardStatus}>
                            <Text style={styles(theme).completedText}>Selesai</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                {/* Challenges Section */}
                <View style={styles(theme).sectionContainer}>
                    <Text style={styles(theme).sectionTitle}>Tantangan</Text>
                </View>
                
                {/* Challenge Cards */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).challengeCardsContainer}
                >
                    {/* Morning Walk Challenge */}
                    <TouchableOpacity style={styles(theme).challengeCard}>
                        <Image 
                            source={{ uri: 'https://via.placeholder.com/100' }} 
                            style={styles(theme).challengeImage} 
                        />
                        <Text style={styles(theme).challengeTitle}>Jalan kaki pagi hari 30 menit</Text>
                        <Text style={styles(theme).challengeDate}>16 - 17 Agustus</Text>
                        <TouchableOpacity style={styles(theme).joinButton}>
                            <Text style={styles(theme).joinButtonText}>Gabung</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    
                    {/* 10k Steps Challenge */}
                    <TouchableOpacity style={styles(theme).challengeCard}>
                        <Image 
                            source={{ uri: 'https://via.placeholder.com/100' }} 
                            style={styles(theme).challengeImage} 
                        />
                        <Text style={styles(theme).challengeTitle}>Jalan kaki 10.000 langkah</Text>
                        <Text style={styles(theme).challengeDate}>28 - 30 Agustus</Text>
                        <TouchableOpacity style={styles(theme).joinButton}>
                            <Text style={styles(theme).joinButtonText}>Gabung</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </ScrollView>
                
                {/* Articles Section */}
                <View style={styles(theme).sectionContainer}>
                    <Text style={styles(theme).sectionTitle}>Artikel</Text>
                </View>
                
                {/* Article Cards */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles(theme).articleCardsContainer}
                >
                    {/* Stamina Article */}
                    <TouchableOpacity style={styles(theme).articleCard}>
                        <Image 
                            source={{ uri: 'https://via.placeholder.com/150' }} 
                            style={styles(theme).articleImage} 
                        />
                        <Text style={styles(theme).articleTitle}>Tingkatkan Stamina dengan Latihan Kardio</Text>
                    </TouchableOpacity>
                    
                    {/* Weight Training Article */}
                    <TouchableOpacity style={styles(theme).articleCard}>
                        <Image 
                            source={{ uri: 'https://via.placeholder.com/150' }} 
                            style={styles(theme).articleImage} 
                        />
                        <Text style={styles(theme).articleTitle}>Panduan Lengkap Latihan Beban untuk Pemula</Text>
                    </TouchableOpacity>
                </ScrollView>
                
                {/* Bottom padding */}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    calendarButton: {
        padding: 4,
    },
    notificationButton: {
        padding: 4,
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.secondary,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 8,
        paddingRight: 16,
    },
    pointsIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    pointsIcon: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    pointsText: {
        color: theme.secondary,
        fontWeight: '600',
        fontSize: 14,
    },
    stepsCircleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    stepsCircleOuter: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 12,
        borderColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepsCircleInner: {
        alignItems: 'center',
    },
    stepsCount: {
        fontSize: 48,
        fontWeight: '700',
        color: theme.primary,
    },
    stepsLabel: {
        fontSize: 16,
        color: theme.textSecondary,
    },
    activityStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 24,
        paddingHorizontal: 16,
    },
    activityStat: {
        alignItems: 'center',
    },
    activityIconContainer: {
        marginBottom: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityValue: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    activityLabel: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    profileCompletionCard: {
        backgroundColor: '#E6F7EC',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 24,
    },
    profileCompletionContent: {
        marginBottom: 12,
    },
    profileCompletionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    profileCompletionSubtitle: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        marginRight: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.primary,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.primary,
    },
    sectionContainer: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.textPrimary,
    },
    activityCardsContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activityCardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF8E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityCardTextContainer: {
        flex: 1,
    },
    activityCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    completedActivityCard: {
        backgroundColor: theme.background,
    },
    completedActivityText: {
        color: theme.textSecondary,
    },
    activityCardPoints: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    pointCircleText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    activityCardPointsText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.textSecondary,
    },
    activityCardStatus: {
        paddingHorizontal: 12,
    },
    completedText: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    challengeCardsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    challengeCard: {
        width: 160,
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
    },
    challengeImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    challengeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    challengeDate: {
        fontSize: 12,
        color: theme.textSecondary,
        marginBottom: 12,
    },
    joinButton: {
        backgroundColor: theme.cardBackground,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 20,
        paddingVertical: 6,
        alignItems: 'center',
    },
    joinButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
    },
    articleCardsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    articleCard: {
        width: 200,
        marginRight: 12,
    },
    articleImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    articleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
    },
});