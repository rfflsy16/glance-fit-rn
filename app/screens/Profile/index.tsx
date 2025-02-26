import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Header from '@/components/Header';

export default function Profile() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [showBalance, setShowBalance] = useState(false);
    
    // Data dummy sementara
    const userStats = [
        { label: 'Target', value: '78%' },
        { label: 'Aktivitas', value: '36 Hari' },
        { label: 'Poin', value: '1.2K' }
    ];

    const MembershipBadge = ({ type }: { type: string }) => {
        const { theme } = useTheme();
        
        const getBadgeStyle = () => {
            switch(type.toLowerCase()) {
                case 'platinum':
                    return {
                        container: {
                            backgroundColor: '#E2E8F0',
                            borderColor: '#CBD5E1',
                        },
                        text: '#1E293B',
                        icon: 'diamond',
                        iconColor: '#64748B'
                    };
                case 'gold':
                    return {
                        container: {
                            backgroundColor: theme.secondaryLight,
                            borderColor: theme.secondary,
                        },
                        text: theme.secondaryDark,
                        icon: 'medal',
                        iconColor: theme.secondary
                    };
                default:
                    return {
                        container: {
                            backgroundColor: theme.cardBackground,
                            borderColor: theme.border,
                        },
                        text: theme.textSecondary,
                        icon: 'star',
                        iconColor: theme.textSecondary
                    };
            }
        };

        const badgeStyle = getBadgeStyle();

        return (
            <View style={[
                styles(theme).membershipBadge, 
                {
                    backgroundColor: badgeStyle.container.backgroundColor,
                    borderColor: badgeStyle.container.borderColor,
                }
            ]}>
                <Ionicons 
                    name={badgeStyle.icon as keyof typeof Ionicons.glyphMap} 
                    size={16} 
                    color={badgeStyle.iconColor}
                    style={styles(theme).membershipIcon}
                />
                <Text style={[
                    styles(theme).membershipText,
                    { color: badgeStyle.text }
                ]}>
                    Member {type}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={[1]}
                renderItem={() => (
                    <>
                        {/* Header baru */}
                        <Header
                            title="Profil Saya"
                            rightContent={
                                <Pressable
                                    onPress={() => navigation.navigate('Settings')}
                                    style={{ padding: 8 }}
                                >
                                    <Ionicons 
                                        name="settings-sharp" 
                                        size={24} 
                                        color={theme.iconPrimary} 
                                    />
                                </Pressable>
                            }
                        />
                        
                        {/* Profile Card */}
                        <View style={styles(theme).profileCard}>
                            <View style={styles(theme).avatarContainer}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150' }}
                                    style={styles(theme).avatar}
                                />
                            </View>
                            
                            <View style={styles(theme).profileInfo}>
                                <Text style={styles(theme).name}>John Fitness</Text>
                                <Text style={styles(theme).email}>john@glancefit.id</Text>
                                <MembershipBadge type="Platinum" />
                            </View>
                            
                            {/* Stats Grid */}
                            <View style={styles(theme).statsGrid}>
                                {userStats.map((stat, index) => (
                                    <View 
                                        key={index}
                                        style={[
                                            styles(theme).statItem,
                                            index !== 2 && styles(theme).statDivider
                                        ]}
                                    >
                                        <Text style={styles(theme).statValue}>{stat.value}</Text>
                                        <Text style={styles(theme).statLabel}>{stat.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        
                        {/* Section Dompet Digital */}
                        <View style={styles(theme).walletSection}>
                            <Text style={styles(theme).sectionTitle}>Dompet Digital</Text>
                            
                            {/* Balance Card */}
                            <Pressable 
                                style={styles(theme).balanceCard}
                                onPress={() => navigation.navigate('Wallet')}
                            >
                                <View style={styles(theme).balanceHeader}>
                                    <Text style={styles(theme).balanceTitle}>Dompet GlanceFit</Text>
                                    <Ionicons 
                                        name="wallet" 
                                        size={24} 
                                        color={theme.iconPrimary} 
                                    />
                                </View>
                                
                                <View style={styles(theme).balanceAmountContainer}>
                                    <Text style={styles(theme).balanceAmount}>
                                        {showBalance ? 'Rp 145.000' : '*******'}
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowBalance(!showBalance)}
                                        style={styles(theme).eyeIcon}
                                    >
                                        <Ionicons 
                                            name={showBalance ? 'eye' : 'eye-off'} 
                                            size={20} 
                                            color={theme.textSecondary} 
                                        />
                                    </Pressable>
                                </View>
                                
                                <View style={styles(theme).walletFooter}>
                                    <Text style={styles(theme).walletStatus}>
                                        {showBalance ? 'Aktif •••• 6789' : 'Klik untuk melihat detail'}
                                    </Text>
                                    <Ionicons 
                                        name="chevron-forward" 
                                        size={20} 
                                        color={theme.textSecondary} 
                                    />
                                </View>
                            </Pressable>
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
    profileCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: theme.primary
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 24
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 4
    },
    email: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 8
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.surfaceLight,
        borderRadius: 16,
        padding: 8
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12
    },
    statDivider: {
        borderRightWidth: 1,
        borderColor: theme.border
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.secondary,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    walletSection: {
        marginTop: 8,
        flex: 1,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
        marginLeft: 0,
    },
    balanceCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: theme.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 0 // Matiin elevation di Android
            }
        })
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    balanceTitle: {
        fontSize: 16,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    balanceAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 8
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.primary,
        letterSpacing: 0.5
    },
    eyeIcon: {
        padding: 4,
        marginTop: 4
    },
    walletFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: theme.border
    },
    walletStatus: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500'
    },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    membershipIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    membershipText: {
        fontSize: 14,
        fontWeight: '600',
    },
});