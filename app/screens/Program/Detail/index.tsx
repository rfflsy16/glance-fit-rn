import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { recommendations, exclusivePrograms } from "@/screens/Program";

export default function Detail() {
    const route = useRoute();

    
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { id } = route.params as { id: number };
    
    const program = [...recommendations, ...exclusivePrograms].find(p => p.id === id);
    
    if (!program) return null;

    return (
        <View style={styles(theme).mainContainer}>
            <StatusBar barStyle="light-content" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section with Image and Overlay */}
                <View style={styles(theme).headerSection}>
                    <Image 
                        source={{ uri: program.image }}
                        style={styles(theme).headerImage}
                    />
                    <View style={styles(theme).imageOverlay} />
                    
                    {/* Back & Menu Buttons */}
                    <View style={styles(theme).headerNav}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            style={styles(theme).iconButton}
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles(theme).iconButton}>
                            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Duration & Title */}
                    <View style={styles(theme).headerContent}>
                        <Text style={styles(theme).duration}>3 Minggu</Text>
                        <Text style={styles(theme).headerTitle}>Gain Weight in 21 Days</Text>
                    </View>
                </View>

                {/* Content Sections */}
                <View style={styles(theme).contentContainer}>
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
                    <View style={styles(theme).equipmentSection}>
                        <Text style={styles(theme).sectionTitle}>Yang akan kamu butuhkan</Text>
                        <View style={styles(theme).equipmentContainer}>
                            {[
                                { id: 1, icon: "scale-bathroom", name: "Timbang badan", bg: "#FFF7ED" },
                                { id: 2, icon: "yoga", name: "Matras olahraga", bg: "#F0F9FF" },
                                { id: 3, icon: "tshirt-crew", name: "Pakaian olahraga", bg: "#F5F3FF" },
                                { id: 4, icon: "shoe-sneaker", name: "Sepatu olahraga", bg: "#FEF2F2" }
                            ].map((item) => (
                                <View key={item.id} style={styles(theme).equipmentItem}>
                                    <View style={[styles(theme).equipmentIconBg, { backgroundColor: item.bg }]}>
                                        <MaterialCommunityIcons 
                                            name={item.icon as any} 
                                            size={24} 
                                            color={theme.primary} 
                                        />
                                    </View>
                                    <Text style={styles(theme).equipmentText}>{item.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Start Button */}
                    <View style={styles(theme).startButtonSection}>
                        <TouchableOpacity style={styles(theme).startButton}>
                            <Text style={styles(theme).startButtonText}>Mulai transformasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerSection: {
        height: 280,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    headerNav: {
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    duration: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    section: {
        padding: 20,
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
    equipmentSection: {
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 20,
    },
    equipmentContainer: {
        gap: 16,
    },
    equipmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    equipmentIconBg: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    equipmentText: {
        fontSize: 16,
        color: theme.textPrimary,
    },
    startButtonSection: {
        padding: 20,
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    startButton: {
        backgroundColor: theme.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 