import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, useWindowDimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { recommendations, exclusivePrograms } from "@/screens/Program";

export default function Detail() {
    const route = useRoute();
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { id } = route.params as { id: number };
    
    const program = [...recommendations, ...exclusivePrograms].find(p => p.id === id);
    
    if (!program) return null;

    return (
        <View style={styles(theme, width, height).mainContainer}>
            <StatusBar barStyle="light-content" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section with Image and Overlay */}
                <View style={styles(theme, width, height).headerSection}>
                    <Image 
                        source={{ uri: program.image }}
                        style={styles(theme, width, height).headerImage}
                    />
                    <View style={styles(theme, width, height).imageOverlay} />
                    
                    {/* Back & Menu Buttons */}
                    <View style={styles(theme, width, height).headerNav}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            style={styles(theme, width, height).iconButton}
                        >
                            <Ionicons name="chevron-back" size={width * 0.1} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles(theme, width, height).iconButton}>
                            <MaterialCommunityIcons name="dots-vertical" size={width * 0.1} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Duration & Title */}
                    <View style={styles(theme, width, height).headerContent}>
                        <Text style={styles(theme, width, height).duration}>3 Minggu</Text>
                        <Text style={styles(theme, width, height).headerTitle}>Gain Weight in 21 Days</Text>
                    </View>
                </View>

                {/* Content Sections */}
                <View style={styles(theme, width, height).contentContainer}>
                    {/* About Section */}
                    <View style={styles(theme, width, height).section}>
                        <Text style={styles(theme, width, height).sectionTitle}>Tentang Program Ini</Text>
                        <Text style={styles(theme, width, height).description}>
                            Sulit untuk menaikkan berat badan, padahal sudah mencoba berbagai cara? tenang, 
                            Program Gain Weight in 21 Days dari Glance Fit dirancang khusus untuk membantumu 
                            mencapai berat badan ideal dengan metode yang sehat dan terbukti efektif.
                        </Text>
                        <Text style={[styles(theme, width, height).description, { marginTop: width * 0.02 }]}>
                            Selama tiga minggu, Kamu akan belajar lebih mendalam mengenai hal - hal yang
                            dibutuhkan untuk menerapkan pola makan yang tepat demi menaikkan berat badan.
                        </Text>
                    </View>

                    {/* Weekly Guide */}
                    <View style={styles(theme, width, height).section}>
                        <Text style={styles(theme, width, height).sectionTitle}>Panduan Mingguan</Text>

                        {[
                            { id: 1, title: "Minggu ke 1", subtitle: "Menetapkan strategi yang tepat" },
                            { id: 2, title: "Minggu ke 2", subtitle: "Mengoptimalkan pola makan" },
                            { id: 3, title: "Minggu ke 3", subtitle: "Mempertahankan dan meningkatkan hasil" }
                        ].map((week) => (
                            <TouchableOpacity key={week.id} style={styles(theme, width, height).weekCard}>
                                <View style={styles(theme, width, height).weekHeader}>
                                    <View>
                                        <Text style={styles(theme, width, height).weekTitle}>{week.title}</Text>
                                        <Text style={styles(theme, width, height).weekSubtitle}>{week.subtitle}</Text>
                                    </View>
                                    <MaterialCommunityIcons name="lock" size={width * 0.08} color={theme.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Equipment */}
                    <View style={styles(theme, width, height).equipmentSection}>
                        <Text style={styles(theme, width, height).sectionTitle}>Yang akan kamu butuhkan</Text>
                        <View style={styles(theme, width, height).equipmentContainer}>
                            {[
                                { id: 1, icon: "scale-bathroom", name: "Timbang badan", bg: "#FFF7ED" },
                                { id: 2, icon: "yoga", name: "Matras olahraga", bg: "#F0F9FF" },
                                { id: 3, icon: "tshirt-crew", name: "Pakaian olahraga", bg: "#F5F3FF" },
                                { id: 4, icon: "shoe-sneaker", name: "Sepatu olahraga", bg: "#FEF2F2" }
                            ].map((item) => (
                                <View key={item.id} style={styles(theme, width, height).equipmentItem}>
                                    <View style={[styles(theme, width, height).equipmentIconBg, { backgroundColor: item.bg }]}>
                                        <MaterialCommunityIcons 
                                            name={item.icon as any} 
                                            size={width * 0.1} 
                                            color={theme.primary} 
                                        />
                                    </View>
                                    <Text style={styles(theme, width, height).equipmentText}>{item.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Start Button */}
                    <View style={styles(theme, width, height).startButtonSection}>
                        <TouchableOpacity style={styles(theme, width, height).startButton}>
                            <Text style={styles(theme, width, height).startButtonText}>Mulai transformasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme, width: number, height: number) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    headerSection: {
        height: height * 0.35,
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
        top: height * 0.08,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
    },
    iconButton: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        position: 'absolute',
        bottom: height * 0.025,
        left: width * 0.05,
        right: width * 0.05,
    },
    duration: {
        color: '#FFFFFF',
        fontSize: width * 0.035,
        fontWeight: '500',
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: width * 0.07,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    section: {
        padding: width * 0.05,
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16,
    },
    description: {
        fontSize: width * 0.038,
        color: theme.textSecondary,
        lineHeight: 22,
    },
    weekCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 12,
        padding: width * 0.04,
        marginBottom: 12,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weekTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    weekSubtitle: {
        fontSize: width * 0.035,
        color: theme.textSecondary,
    },
    equipmentSection: {
        marginHorizontal: width * 0.05,
        padding: width * 0.05,
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
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    equipmentText: {
        fontSize: width * 0.04,
        color: theme.textPrimary,
    },
    startButtonSection: {
        padding: width * 0.05,
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    startButton: {
        backgroundColor: theme.primary,
        padding: width * 0.04,
        borderRadius: 12,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: width * 0.04,
        fontWeight: '600',
    },
}); 