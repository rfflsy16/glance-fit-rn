import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Header from '@/components/Header';
import { VideoView, useVideoPlayer } from 'expo-video';

// Tambahin type definitions
interface Target {
    id: number;
    title: string;
    current: number;
    target: number;
    unit: string;
    color: keyof Theme; // Fix type error theme[color]
    icon: string;
}

interface Mission {
    id: number;
    icon: string;
    title: string;
    points: number;
    progress: number;
}

interface RedeemItem {
    id: number;
    name: string;
    points: number;
    image: string;
}

// Update data dgn type annotation
const targets: Target[] = [
    { id: 1, title: 'Kalori Terbakar', current: 1200, target: 2000, unit: 'kal', color: 'primary', icon: 'flame' },
    { id: 2, title: 'Langkah Harian', current: 8500, target: 10000, unit: 'langkah', color: 'secondary', icon: 'walk' },
    { id: 3, title: 'Durasi Olahraga', current: 45, target: 60, unit: 'menit', color: 'info', icon: 'stopwatch-outline' }
];

const missions: Mission[] = [
    { id: 1, icon: 'barbell', title: 'Lari 5km', points: 150, progress: 0.6 },
    { id: 2, icon: 'water-outline', title: 'Minum 2L', points: 80, progress: 0.9 },
    { id: 3, icon: 'restaurant-outline', title: 'Makan Sehat', points: 200, progress: 0.4 }
];

const redeemItems: RedeemItem[] = [
    { 
        id: 1, 
        name: 'Voucher Grab', 
        points: 500, 
        image: 'https://picsum.photos/160/120?random=1&grayscale' 
    },
    { 
        id: 2, 
        name: 'Protein Shake', 
        points: 300, 
        image: 'https://picsum.photos/160/120?random=2' 
    },
    { 
        id: 3, 
        name: 'Gym Membership', 
        points: 1000, 
        image: 'https://picsum.photos/160/120?random=3' 
    }
];

export default function Goals() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [points, setPoints] = useState(1200);
    
    // Tambahin video player
    const player = useVideoPlayer(require('@/assets/videos/Goals2.mp4'), (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    // Fix type parameter
    const handleRedeem = (item: RedeemItem) => {
        if(points >= item.points) {
            alert(`Tukar ${item.name}?`);
        } else {
            alert('Poin kurang 😢');
        }
    };

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Header 
                title="Target & Reward"
                rightContent={
                    <View style={styles(theme).pointsContainer}>
                        <Ionicons name="diamond" size={18} color={theme.secondary} />
                        <Text style={styles(theme).pointsText}>{points}</Text>
                    </View>
                }
            />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={[1]}
                renderItem={() => (
                    <>
                        {/* Ganti jadi VideoView */}
                        <View style={{ 
                            marginHorizontal: 16,
                            borderRadius: 16,
                            overflow: 'hidden'
                        }}>
                            <VideoView
                                player={player}
                                style={[
                                    styles(theme).videoPlayer,
                                    {
                                        borderRadius: 16,
                                    }
                                ]}
                                contentFit="cover"
                                nativeControls={false}
                            />
                        </View>

                        {/* Progress Target - fix key extractor */}
                        <View>
                            <Text style={styles(theme).sectionTitle}>Progress Harian</Text>
                            <View style={styles(theme).progressContainer}>
                                {targets.map((target) => (
                                    <View key={`target-${target.id}`} style={styles(theme).progressCard}>
                                        <View style={styles(theme).progressHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Ionicons name={target.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.textPrimary} />
                                                <Text style={styles(theme).progressTitle}>{target.title}</Text>
                                            </View>
                                            <Text style={[styles(theme).progressPercent, { color: theme[target.color] }]}>
                                                {Math.round((target.current/target.target)*100)}%
                                            </Text>
                                        </View>
                                        <View style={styles(theme).progressBar}>
                                            <View style={[
                                                styles(theme).progressFill, 
                                                { 
                                                    width: `${(target.current/target.target)*100}%`,
                                                    backgroundColor: theme[target.color]
                                                }
                                            ]}/>
                                        </View>
                                        <Text style={styles(theme).progressText}>
                                            {target.current}/{target.target} {target.unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Misi Harian - adjust padding */}
                        <View>
                            <Text style={styles(theme).sectionTitle}>Misi Harian</Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={missions}
                                keyExtractor={(item) => `mission-${item.id}`}
                                renderItem={({ item }) => (
                                    <View style={[styles(theme).missionCard, { marginRight: 12 }]}>
                                        <Ionicons 
                                            name={item.icon as keyof typeof Ionicons.glyphMap} 
                                            size={24} 
                                            color={theme.textPrimary} 
                                            style={styles(theme).missionIcon} 
                                        />
                                        <Text style={styles(theme).missionTitle}>{item.title}</Text>
                                        <View style={styles(theme).missionProgress}>
                                            <View style={[
                                                styles(theme).missionProgressBar,
                                                { width: `${item.progress*100}%` }
                                            ]}/>
                                        </View>
                                        <Text style={styles(theme).missionPoints}>
                                            🎯 {item.points} Poin
                                        </Text>
                                    </View>
                                )}
                                contentContainerStyle={{
                                    paddingLeft: 16,
                                    paddingRight: 16,
                                    paddingBottom: 24
                                }}
                            />
                        </View>

                        {/* Penukaran Poin - fix grid styling */}
                        <View>
                            <Text style={styles(theme).sectionTitle}>Tukar Poin</Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={redeemItems}
                                keyExtractor={(item) => `redeem-${item.id}`}
                                renderItem={({ item }) => (
                                    <Pressable 
                                        style={[styles(theme).redeemCard, { marginRight: 12 }]}
                                        onPress={() => handleRedeem(item)}
                                    >
                                        <Image
                                            source={{ uri: item.image }}
                                            style={[styles(theme).redeemImage, { height: 120 }]}
                                        />
                                        <View style={styles(theme).redeemInfo}>
                                            <Text style={styles(theme).redeemName}>{item.name}</Text>
                                            <Text style={styles(theme).redeemPoints}>
                                                <Ionicons name="diamond" size={14} color={theme.secondary} /> 
                                                {item.points}
                                            </Text>
                                        </View>
                                    </Pressable>
                                )}
                                contentContainerStyle={{
                                    paddingLeft: 16,
                                    paddingRight: 16,
                                    paddingBottom: 24
                                }}
                            />
                        </View>
                    </>
                )}
                keyExtractor={(item) => item.toString()}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.textPrimary
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
        marginLeft: 16
    },
    progressContainer: {
        gap: 12,
        marginBottom: 24,
        marginHorizontal: 16
    },
    progressCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary
    },
    progressPercent: {
        fontSize: 16,
        fontWeight: '800'
    },
    progressBar: {
        height: 8,
        backgroundColor: theme.surfaceLight,
        borderRadius: 4,
        marginBottom: 8
    },
    progressFill: {
        height: '100%',
        borderRadius: 4
    },
    progressText: {
        fontSize: 12,
        color: theme.textSecondary
    },
    missionCard: {
        width: 140,
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
    },
    missionIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    missionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 12
    },
    missionProgress: {
        height: 4,
        backgroundColor: theme.surfaceLight,
        borderRadius: 2,
        marginBottom: 8
    },
    missionProgressBar: {
        height: '100%',
        backgroundColor: theme.primary,
        borderRadius: 2
    },
    missionPoints: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    redeemCard: {
        width: 160,
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 0,
        overflow: 'hidden'
    },
    redeemImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover'
    },
    redeemInfo: {
        padding: 12
    },
    redeemName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8
    },
    redeemPoints: {
        fontSize: 12,
        color: theme.textSecondary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    videoPlayer: {
        width: '100%',
        height: 200,
        marginBottom: 24,
    }
});