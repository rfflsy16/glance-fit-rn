import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { recommendations, exclusivePrograms } from "@/screens/Program";

export default function Detail() {
    const route = useRoute();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { id } = route.params as { id: number };
    
    const program = [...recommendations, ...exclusivePrograms].find(p => p.id === id);
    
    if (!program) return null;

    return (
        <ScrollView 
            style={[styles(theme).container]} 
            showsVerticalScrollIndicator={false}
        >
            {/* Header Image */}
            <View style={styles(theme).imageContainer}>
                <Image 
                    source={{ uri: program.image }}
                    style={styles(theme).headerImage}
                />
                <View style={styles(theme).durationBadge}>
                    <Text style={styles(theme).durationText}>{program.duration}</Text>
                </View>
            </View>

            <View style={styles(theme).content}>
                <Text style={styles(theme).title}>{program.title}</Text>

                {/* About Section */}
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Tentang Program Ini</Text>
                    <Text style={styles(theme).description}>
                        Sulit untuk menaikkan berat badan, padahal sudah mencoba berbagai cara? tenang, 
                        Program Gain Weight in 21 Days dari Glance Fit dirancang khusus untuk membantumu 
                        mencapai berat badan ideal dengan metode yang sehat dan terbukti efektif.
                    </Text>
                    <Text style={[styles(theme).description, { marginTop: 12 }]}>
                        Selama tiga minggu, Kamu akan belajar lebih mendalam mengenai hal - hal yang
                        dibutuhkan untuk menerapkan pola makan yang tepat demi menaikkan berat badan.
                    </Text>
                </View>

                {/* Weekly Guide */}
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Panduan Mingguan</Text>
                    {[
                        { id: 1, title: "Minggu ke 1", subtitle: "Menetapkan strategi yang tepat" },
                        { id: 2, title: "Minggu ke 2", subtitle: "Mengoptimalkan pola makan" },
                        { id: 3, title: "Minggu ke 3", subtitle: "Mempertahankan dan meningkatkan hasil" }
                    ].map((week) => (
                        <TouchableOpacity key={week.id} style={styles(theme).weekCard}>
                            <View style={styles(theme).weekHeader}>
                                <View>
                                    <Text style={styles(theme).weekTitle}>{week.title}</Text>
                                    <Text style={styles(theme).weekSubtitle}>{week.subtitle}</Text>
                                </View>
                                <MaterialCommunityIcons name="lock" size={24} color={theme.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Equipment */}
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Yang akan kamu butuhkan</Text>
                    <View style={styles(theme).equipmentList}>
                        {[
                            { id: 1, icon: "scale-bathroom", name: "Timbang badan" },
                            { id: 2, icon: "yoga", name: "Matras olahraga" },
                            { id: 3, icon: "tshirt-crew", name: "Pakaian olahraga" },
                            { id: 4, icon: "shoe-sneaker", name: "Sepatu olahraga" }
                        ].map((item) => (
                            <View key={item.id} style={styles(theme).equipmentItem}>
                                <MaterialCommunityIcons 
                                    name={item.icon as any} 
                                    size={24} 
                                    color={theme.primary} 
                                />
                                <Text style={styles(theme).equipmentText}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles(theme).startButton}>
                <Text style={styles(theme).startButtonText}>Mulai transformasi</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 240,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    durationText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: theme.textSecondary,
        lineHeight: 22,
    },
    weekCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weekTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    weekSubtitle: {
        fontSize: 14,
        color: theme.textSecondary,
    },
    equipmentList: {
        gap: 16,
    },
    equipmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    equipmentText: {
        fontSize: 16,
        color: theme.textPrimary,
    },
    startButton: {
        backgroundColor: theme.primary,
        padding: 16,
        borderRadius: 12,
        margin: 20,
        marginTop: 0,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
}); 