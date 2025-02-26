import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';

type AccountItem = {
    name: string;
    email: string;
    avatar: string;
};

const accounts: AccountItem[] = [
    {
        name: 'Steve Harrington',
        email: 'stevee@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        name: 'Eddie Munson',
        email: 'ediee@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
        name: 'Mike Wheeler',
        email: 'mikewheeler@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=3'
    }
];

export default function Google() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Pressable 
                style={styles(theme).backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={24} color={theme.textSecondary} />
            </Pressable>

            <View style={styles(theme).headerContainer}>
                <Image 
                    source={require('@/assets/glance-fit/icon.png')}
                    style={styles(theme).logo}
                />
                <Text style={styles(theme).title}>Pilih Akun</Text>
                <Text style={styles(theme).subtitle}>
                    untuk melanjutkan masuk ke Glance Fit
                </Text>
            </View>

            <View style={styles(theme).accountsContainer}>
                {accounts.map((account, index) => (
                    <Pressable 
                        key={index}
                        style={styles(theme).accountItem}
                    >
                        <Image 
                            source={{ uri: account.avatar }}
                            style={styles(theme).avatar}
                        />
                        <View style={styles(theme).accountInfo}>
                            <Text style={styles(theme).accountName}>{account.name}</Text>
                            <Text style={styles(theme).accountEmail}>{account.email}</Text>
                        </View>
                    </Pressable>
                ))}

                <Pressable style={styles(theme).accountItem}>
                    <View style={styles(theme).addAccountIcon}>
                        <Ionicons name="person-add-outline" size={24} color={theme.textSecondary} />
                    </View>
                    <View style={styles(theme).accountInfo}>
                        <Text style={styles(theme).accountName}>Tambah akun lain</Text>
                    </View>
                </Pressable>
            </View>

            <View style={[styles(theme).footer, { paddingBottom: insets.bottom + 16 }]}>
                <Text style={styles(theme).footerText}>
                    Dengan melanjutkan, Anda menyetujui{' '}
                    <Text style={styles(theme).linkText}>Kebijakan Privasi</Text>
                    {' '}dan{' '}
                    <Text style={styles(theme).linkText}>Ketentuan Layanan</Text>
                </Text>
                <Pressable style={styles(theme).continueButton}>
                    <Text style={styles(theme).continueButtonText}>Lanjut</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    backButton: {
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 16,
        backgroundColor: '#2B6872',
        borderRadius: 30, // Mengubah menjadi setengah dari width/height untuk membuat lingkaran sempurna
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: 'center',
    },
    accountsContainer: {
        backgroundColor: theme.cardBackground,
        margin: 16,
        borderRadius: 16,
        padding: 8,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    addAccountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountInfo: {
        marginLeft: 12,
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.textPrimary,
    },
    accountEmail: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    footerText: {
        fontSize: 14,
        color: theme.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    linkText: {
        color: theme.primary,
        textDecorationLine: 'underline',
    },
    continueButton: {
        backgroundColor: theme.cardBackground,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textSecondary,
    },
});