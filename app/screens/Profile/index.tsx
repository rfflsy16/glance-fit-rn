import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const navigation = useNavigation();

    // Data profil pengguna (nanti bisa diambil dari API/state)
    const userData = {
        name: 'Alex Prieto',
        gender: 'Laki-Laki',
        age: 22,
        height: 165,
        weight: 55,
        memberSince: 'April 2024',
        points: 160,
    };

    const navigateToSettings = () => {
        navigation.navigate('Settings');
    };

    const navigateToWallet = () => {
        navigation.navigate('Wallet');
    };

    return (
        <ScrollView 
            style={[styles(theme).container, { paddingTop: insets.top }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header dengan background dan foto profil */}
            <View style={styles(theme).header}>
                <Image 
                    source={require('@/assets/images/banner.png')} 
                    style={styles(theme).headerBackground}
                />
                <Text style={styles(theme).headerTitle}>Profil</Text>
                <View style={styles(theme).profileImageContainer}>
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' }}
                        style={styles(theme).profileImage}
                    />
                    <View style={styles(theme).editIconContainer}>
                        <Ionicons name="pencil" size={16} color="#2D6E70" />
                    </View>
                </View>
            </View>
            
            {/* Informasi profil */}
            <View style={styles(theme).userInfoContainer}>
                <Text style={styles(theme).userName}>Alex Prieto</Text>
                
                <View style={styles(theme).userStatsContainer}>
                    <View style={styles(theme).statItem}>
                        <Ionicons name="person-outline" size={20} color="#888888" />
                        <Text style={styles(theme).statText}>Laki-Laki</Text>
                    </View>
                    
                    <View style={styles(theme).statItem}>
                        <Text style={styles(theme).statIcon}>#</Text>
                        <Text style={styles(theme).statText}>22</Text>
                    </View>
                    
                    <View style={styles(theme).statItem}>
                        <Ionicons name="resize-outline" size={20} color="#888888" />
                        <Text style={styles(theme).statText}>165 cm</Text>
                    </View>
                    
                    <View style={styles(theme).statItem}>
                        <Ionicons name="scale-outline" size={20} color="#888888" />
                        <Text style={styles(theme).statText}>55 kg</Text>
                    </View>
                </View>
                
                <Text style={styles(theme).memberSince}>Bergabung April 2024</Text>
            </View>

            {/* Separator */}
            <View style={styles(theme).separator} />

            {/* Akun saya section */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Akun saya</Text>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="person-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Aktivitas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles(theme).menuItem}
                    onPress={navigateToWallet}
                >
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="wallet-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Balance</Text>
                    <View style={styles(theme).spacer} />
                    <Text style={styles(theme).balanceText}>72 Balance tersisa</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="document-text-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Data personal</Text>
                </TouchableOpacity>
            </View>

            {/* Section spacer */}
            <View style={styles(theme).sectionSpacer} />

            {/* Reward saya section */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Reward saya</Text>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="star-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Points</Text>
                    <View style={styles(theme).spacer} />
                    <Text style={styles(theme).pointsText}>{userData.points} Poin</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="gift-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Glance Fit affiliate</Text>
                </TouchableOpacity>
            </View>

            {/* Section spacer */}
            <View style={styles(theme).sectionSpacer} />

            {/* Settings section */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Settings</Text>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="notifications-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Notifikasi</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles(theme).menuItem}
                    onPress={navigateToSettings}
                >
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="shield-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Kelola data & Privasi</Text>
                </TouchableOpacity>
            </View>

            {/* Section spacer */}
            <View style={styles(theme).sectionSpacer} />

            {/* Bantuan section */}
            <View style={styles(theme).section}>
                <Text style={styles(theme).sectionTitle}>Bantuan</Text>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="help-circle-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Pusat bantuan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="chatbubble-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Hubungi customer service</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="cash-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Klaim masukan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="document-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Syarat & ketentuan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles(theme).menuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#333333" />
                    </View>
                    <Text style={styles(theme).menuText}>Kebijakan privasi</Text>
                </TouchableOpacity>
            </View>

            {/* Section spacer */}
            <View style={styles(theme).sectionSpacer} />

            {/* Logout button - updated to match design */}
            <View style={styles(theme).logoutSection}>
                <TouchableOpacity style={styles(theme).logoutMenuItem}>
                    <View style={styles(theme).menuIconContainer}>
                        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    </View>
                    <Text style={styles(theme).logoutMenuText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Section spacer */}
            <View style={styles(theme).sectionSpacer} />

            {/* Version info */}
            <View style={styles(theme).versionSection}>
                <Text style={styles(theme).versionText}>Versi 1.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 200,
        position: 'relative',
        width: '100%',
    },
    headerBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginTop: 16,
        alignSelf: 'center',
    },
    profileImageContainer: {
        position: 'absolute',
        bottom: -45,
        alignSelf: 'center',
        width: 89,
        height: 89,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        overflow: 'visible',
        zIndex: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
        overflow: 'hidden',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: -5,
        backgroundColor: '#E0F7F8',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userInfoContainer: {
        marginTop: 60,
        paddingHorizontal: 24,
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
    },
    userName: {
        fontSize: 32,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    userStatsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statIcon: {
        fontSize: 20,
        color: '#888888',
    },
    statText: {
        fontSize: 16,
        fontWeight: 500,
        color: '#888888',
        marginLeft: 4,
    },
    memberSince: {
        fontSize: 16,
        fontWeight: '500',
        color: '#9E9E9E',
        marginTop: 4,
    },
    separator: {
        height: 8,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 0,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    sectionSpacer: {
        height: 8,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    menuIconContainer: {
        width: 24,
        alignItems: 'center',
        marginRight: 16,
        opacity: 0.6,
    },
    menuText: {
        fontSize: 18,
        color: '#333333',
    },
    spacer: {
        flex: 1,
    },
    balanceText: {
        fontSize: 16,
        color: '#F5A623',
        fontWeight: '500',
    },
    pointsText: {
        fontSize: 16,
        color: '#F5A623',
        fontWeight: '500',
    },
    logoutSection: {
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    logoutMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    logoutMenuText: {
        fontSize: 18,
        color: '#FF3B30',
        fontWeight: '500',
    },
    versionSection: {
        backgroundColor: '#F5F5F5',
        width: '100%',
        paddingVertical: 16,
    },
    versionText: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
    },
});