import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { useNavigation } from '@react-navigation/native';

// Data dummy untuk notifikasi
const notifications = [
    {
        id: 1,
        title: 'Yuk lanjutin program kebugaranmu',
        message: 'Kamu sudah berhasil menyelesaikan program kesehatan hari pertamamu. Yuk mulai program hari keduamu!',
        date: '09/08/2024 07:00'
    },
    {
        id: 2, 
        title: 'Top-up balance gagal',
        message: 'Ups, top-up balance-mu gagal diproses. Coba lagi kembali ya. Pastikan saldomu cukup.',
        date: '07/08/2024 10:32'
    },
    {
        id: 3,
        title: 'Programmu menunggu',
        message: 'Hei, sepertinya kamu sudah lama ngga lari nih. Yuk, mulai lagi program larimu biar poinmu bertambah.',
        date: '07/08/2024 10:32'
    },
    {
        id: 4,
        title: 'Data profilmu belum lengkap',
        message: 'Segera lengkapi profilmu agar kami dapat memberikan rekomendasi yang cocok untukmu',
        date: '07/08/2024 10:32'
    }
];

export default function Notification() {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles(theme).container, { paddingTop: insets.top }]}>
            <Header 
                title="Notifikasi" 
                showBackButton 
                onPressBack={() => navigation.goBack()}
            />
            
            <ScrollView style={styles(theme).content}>
                {notifications.map((notification) => (
                    <View key={notification.id} style={styles(theme).notificationItem}>
                        <Text style={styles(theme).notificationTitle}>
                            {notification.title}
                        </Text>
                        <Text style={styles(theme).notificationMessage}>
                            {notification.message}
                        </Text>
                        <Text style={styles(theme).notificationDate}>
                            {notification.date}
                        </Text>
                        <View style={styles(theme).divider} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    content: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16
    },
    notificationItem: {
        paddingVertical: 16
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8
    },
    notificationMessage: {
        fontSize: 14,
        color: theme.textSecondary,
        lineHeight: 20,
        marginBottom: 8
    },
    notificationDate: {
        fontSize: 12,
        color: theme.textTertiary,
        marginBottom: 16
    },
    divider: {
        height: 1,
        backgroundColor: theme.divider,
        marginTop: 4
    }
});
