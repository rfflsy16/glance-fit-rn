import { View, Text, StyleSheet, TouchableOpacity, Switch, SectionList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';

type SettingsItem = {
    icon: string;
    title: string;
    type: 'navigate' | 'toggle';
    screen?: string;
    value?: boolean;
};

type SettingsSection = {
    title: string;
    data: SettingsItem[];
};

const SETTINGS_DATA: SettingsSection[] = [
    {
        title: "Akun",
        data: [
            { 
                icon: 'person',
                title: 'Edit Profil',
                type: 'navigate',
                screen: 'EditProfile'
            },
            {
                icon: 'lock-closed',
                title: 'Ubah Password',
                type: 'navigate',
                screen: 'ChangePassword'
            }
        ]
    },
    {
        title: "Preferensi Aplikasi",
        data: [
            {
                icon: 'moon',
                title: 'Tema Gelap',
                type: 'toggle',
                value: false
            },
            {
                icon: 'notifications',
                title: 'Notifikasi',
                type: 'toggle',
                value: true
            },
            {
                icon: 'language',
                title: 'Bahasa',
                type: 'navigate',
                screen: 'LanguageSettings'
            }
        ]
    },
    {
        title: "Keamanan",
        data: [
            {
                icon: 'finger-print',
                title: 'Autentikasi Biometrik',
                type: 'toggle',
                value: true
            },
            {
                icon: 'shield-checkmark',
                title: 'Verifikasi 2 Langkah',
                type: 'navigate',
                screen: 'TwoFactorAuth'
            }
        ]
    },
    {
        title: "Dukungan",
        data: [
            {
                icon: 'help-circle',
                title: 'Bantuan',
                type: 'navigate',
                screen: 'HelpCenter'
            },
            {
                icon: 'document-text',
                title: 'Ketentuan Layanan',
                type: 'navigate',
                screen: 'TermsOfService'
            }
        ]
    }
];

// Props untuk renderItem
type RenderItemProps = {
    item: SettingsItem;
};

export default function Settings() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { theme, toggleDarkMode, isDark } = useTheme();


    const getIconColor = (iconName: string) => {
        switch(iconName) {
            case 'person': return theme.iconPrimary;
            case 'lock-closed': return theme.iconWarning;
            case 'moon': return theme.iconPrimary;
            case 'notifications': return theme.iconWarning;
            case 'language': return theme.iconAccent;
            case 'finger-print': return theme.iconSecondary;
            case 'shield-checkmark': return theme.iconAccent;
            case 'help-circle': return theme.iconPrimary;
            case 'document-text': return theme.iconWarning;
            default: return theme.iconPrimary;
        }
    };


    const renderItem = ({ item }: RenderItemProps) => (
        <TouchableOpacity 
            style={styles(theme).itemContainer}
            onPress={() => item.type === 'navigate' && console.log('Navigate to', item.screen)}
        >
            <View style={styles(theme).itemLeft}>
                <Ionicons 
                    name={item.icon as keyof typeof Ionicons.glyphMap} 
                    size={24} 
                    color={getIconColor(item.icon)} 
                />
                <Text style={styles(theme).itemTitle}>{item.title}</Text>
            </View>
            
            {item.type === 'toggle' ? (
                <Switch
                    value={isDark}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: theme.cardBackground, true: theme.primary }}
                    thumbColor={theme.background}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={theme.iconPrimary} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Header 
                title="Pengaturan"
                showBackButton
                onPressBack={() => navigation.goBack()}
            />
            <SectionList
                sections={SETTINGS_DATA}
                keyExtractor={(item, index) => item.title + index}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                    <Text style={styles(theme).sectionHeader}>{section.title}</Text>
                )}
                ListFooterComponent={
                    <Pressable
                        onPress={() => navigation.navigate('Auth')}
                        style={styles(theme).logoutButton}
                    >
                        <Ionicons 
                            name="log-out-outline" 
                            size={20} 
                            color="#fff" 
                            style={styles(theme).logoutIcon}
                        />
                        <Text style={styles(theme).logoutText}>Keluar Akun</Text>
                    </Pressable>
                }
                contentContainerStyle={{ paddingBottom: 48 }}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    sectionHeader: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 24,
        marginBottom: 12,
        marginHorizontal: 16,
        fontWeight: '500'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        marginHorizontal: 16
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    itemTitle: {
        fontSize: 16,
        color: theme.textPrimary
    },
    logoutButton: {
        backgroundColor: '#DC2626',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 32,
        elevation: 2,
        marginHorizontal: 16
    },
    logoutIcon: {
        marginRight: 12
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5
    }
});