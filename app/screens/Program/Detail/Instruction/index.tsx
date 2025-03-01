import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { Theme } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

type InstructionRouteParams = {
    id: number;
}

export default function Instruction() {
    const { theme } = useTheme();
    const route = useRoute<RouteProp<Record<string, InstructionRouteParams>, string>>();
    const navigation = useNavigation();
    const { id } = route.params;
    const [activeDay, setActiveDay] = useState(1);
    
    const weekData = {
        title: "Minggu ke-1",
        subtitle: "Menerapkan strategi yang tepat",
        description: "Di minggu pertama, fokus utama adalah memahami tubuhmu dan menentukan strategi yang paling efektif untuk menambah berat badan. Kamu akan belajar tentang kebutuhan kalori harian, cara memilih makanan yang tepat, dan pentingnya keseimbangan nutrisi",
        days: [
            { id: 1, day: 1 },
            { id: 2, day: 2 },
            { id: 3, day: 3 },
            { id: 4, day: 4 },
            { id: 5, day: 5 },
            { id: 6, day: 6 },
            { id: 7, day: 7 },
        ],
        content: {
            topik: "Mengetahui Kebutuhan Kalori",
            sasaran: "Menghitung kebutuhan kalori harian berdasarkan berat badan, tinggi badan, usia, dan aktivitas fisik.",
            panduan: "Menghitung kebutuhan kalori harian adalah langkah pertama yang sangat penting dalam perjalanan penambahan berat badan. Kalori adalah satuan energi yang diperoleh dari makanan, dan tubuh membutuhkan kalori ini untuk berfungsi secara optimal. Namun, jika tujuanmu adalah menambah berat badan, maka konsumsi kalori sesuai kebutuhan dasar tidak akan cukup.\n\nUntuk memulai, kamu perlu menghitung Basal Metabolic Rate (BMR), yaitu jumlah kalori yang dibutuhkan tubuhmu untuk menjalankan fungsi-fungsi dasar seperti bernapas, menjaga suhu tubuh, dan fungsi organ vital lainnya, bahkan saat kamu sedang beristirahat. Setelah itu, tambahkan kalori tambahan yang dibutuhkan sesuai dengan tingkat aktivitas fisikmu. Misalnya, jika kamu adalah orang yang cukup aktif, kalikan BMR dengan angka tertentu (biasanya sekitar 1.55 untuk aktivitas sedang).\n\nLangkah ini sangat penting karena tanpa memahami berapa banyak kalori yang tubuhmu butuhkan, akan sulit untuk mencapai penambahan berat badan yang diinginkan. Misalnya, jika BMR-mu adalah 1.800 kalori, dan kamu memiliki gaya hidup yang cukup aktif, kamu mungkin membutuhkan sekitar 2.800 kalori per hari untuk mempertahankan berat badanmu saat ini. Untuk menambah berat badan, kamu perlu mengonsumsi lebih dari itu, mungkin sekitar 3.000-3.200 kalori per hari. Dengan angka ini, kamu dapat mulai merencanakan pola makan harian yang tepat.\n\nSetelah kamu memahami kebutuhan kalori harianmu untuk menambah berat badan, langkah berikutnya adalah memastikan bahwa kalori tambahan ini berasal dari sumber makanan yang sehat dan bergizi. Fokus pada makanan yang kaya protein seperti daging tanpa lemak, ikan, telur, dan produk susu, serta karbohidrat kompleks seperti beras merah, quinoa, dan ubi jalar. Jangan lupa tambahkan lemak sehat seperti alpukat, kacang-kacangan, dan minyak zaitun.\n\nPenting juga untuk membagi asupan kalori harianmu menjadi beberapa kali makan, mungkin 5-6 kali sehari, daripada hanya 3 kali makan besar. Ini akan membantu tubuhmu menyerap nutrisi lebih efisien dan mencegah rasa kenyang berlebihan yang bisa mengurangi nafsu makan.\n\nJangan lupa, setiap tubuh berbeda-beda, dan kebutuhan kalori ini bisa saja berbeda seiring waktu dan dengan perubahan tingkat aktivitas. Oleh karena itu, penting untuk terus memantau asupan kalori dan berat badan, serta menyesuaikan sesuai hasil yang kamu capai.",
            aktivitas: "Mengisi data melalui kalkulator kalori ini, simpan hasilnya untuk digunakan sebagai acuan di hari-hari berikutnya."
        }
    };

    return (
        <View style={styles(theme).container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header dengan back button */}
            <View style={styles(theme).header}>
                <TouchableOpacity 
                    style={styles(theme).backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Judul dan subtitle */}
                <View style={styles(theme).headerContent}>
                    <Text style={styles(theme).title}>{weekData.title}</Text>
                    <Text style={styles(theme).subtitle}>{weekData.subtitle}</Text>
                </View>
                
                {/* Deskripsi minggu */}
                <Text style={styles(theme).description}>
                    {weekData.description}
                </Text>
                
                {/* Tab hari */}
                <View style={styles(theme).dayTabsWrapper}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles(theme).dayTabsContent}
                    >
                        {weekData.days.map((day) => (
                            <TouchableOpacity 
                                key={day.id}
                                style={[
                                    styles(theme).dayTab,
                                    activeDay === day.day && styles(theme).activeTab
                                ]}
                                onPress={() => setActiveDay(day.day)}
                            >
                                <Text style={[
                                    styles(theme).dayTabText,
                                    activeDay === day.day && styles(theme).activeTabText
                                ]}>
                                    Hari {day.day}
                                </Text>
                                {activeDay === day.day && <View style={styles(theme).tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                {/* Konten materi */}
                <View style={styles(theme).content}>
                    {/* Topik */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionLabel}>Topik</Text>
                        <Text style={styles(theme).topicText}>{weekData.content.topik}</Text>
                    </View>
                    
                    {/* Sasaran */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionLabel}>Sasaran</Text>
                        <Text style={styles(theme).sectionText}>{weekData.content.sasaran}</Text>
                    </View>
                    
                    {/* Panduan */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionLabel}>Panduan</Text>
                        <Text style={styles(theme).sectionText}>{weekData.content.panduan}</Text>
                    </View>
                    
                    {/* Aktivitas */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionLabel}>Aktivitas</Text>
                        <Text style={styles(theme).sectionText}>{weekData.content.aktivitas}</Text>
                    </View>
                    
                    {/* Button Selesaikan - Bagian dari konten, tidak floating */}
                    <TouchableOpacity style={styles(theme).completeButton}>
                        <Text style={styles(theme).completeButtonText}>
                            Selesaikan Hari {activeDay}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        paddingTop: 16 * SCALE,
        paddingHorizontal: 16 * SCALE,
    },
    backButton: {
        width: 40 * SCALE,
        height: 40 * SCALE,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerContent: {
        paddingHorizontal: 16 * SCALE,
        marginBottom: 16 * SCALE,
    },
    title: {
        fontSize: 20 * SCALE,
        fontWeight: '700',
        color: theme.textPrimary,
        marginTop: 8 * SCALE,
    },
    subtitle: {
        fontSize: 16 * SCALE,
        color: theme.textSecondary,
        marginTop: 4 * SCALE,
    },
    description: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
        lineHeight: 20 * SCALE,
        marginHorizontal: 16 * SCALE,
    },
    dayTabsWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginTop: 20 * SCALE,
    },
    dayTabsContent: {
        paddingHorizontal: 16 * SCALE,
    },
    dayTab: {
        paddingHorizontal: 16 * SCALE,
        paddingVertical: 12 * SCALE,
        marginRight: 16 * SCALE,
        position: 'relative',
    },
    dayTabText: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
    },
    activeTab: {
        backgroundColor: 'transparent',
    },
    activeTabText: {
        color: theme.primary,
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2 * SCALE,
        backgroundColor: theme.primary,
    },
    content: {
        padding: 16 * SCALE,
    },
    section: {
        marginBottom: 24 * SCALE,
    },
    sectionLabel: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
        marginBottom: 8 * SCALE,
    },
    topicText: {
        fontSize: 18 * SCALE,
        fontWeight: '700',
        color: theme.textPrimary,
    },
    sectionText: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
        lineHeight: 20 * SCALE,
    },
    completeButton: {
        backgroundColor: theme.primary,
        paddingVertical: 16 * SCALE,
        borderRadius: 8 * SCALE,
        alignItems: 'center',
        marginTop: 8 * SCALE,
        marginBottom: 24 * SCALE,
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16 * SCALE,
        fontWeight: '600',
    },
});