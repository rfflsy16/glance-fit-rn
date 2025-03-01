import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getProgramById, getInstructionsByProgram } from "../constans";

// Tambahin type untuk icon names
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type IoniconsName = keyof typeof Ionicons.glyphMap;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width dari design

export default function Detail() {
    const route = useRoute();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { id } = route.params as { id: number };
    
    // Get program & instructions data
    const program = getProgramById(id);
    const instructions = getInstructionsByProgram(id);
    
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
                            <Ionicons 
                                name={"chevron-back" as IoniconsName} 
                                size={20 * SCALE} 
                                color="white" 
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles(theme).iconButton}>
                            <MaterialCommunityIcons 
                                name={"dots-vertical" as MaterialIconName} 
                                size={20 * SCALE} 
                                color="white" 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Duration & Title */}
                    <View style={styles(theme).headerContent}>
                        <Text style={styles(theme).duration}>{program.duration}</Text>
                        <Text style={styles(theme).headerTitle}>{program.title}</Text>
                    </View>
                </View>

                {/* Content Sections */}
                <View style={styles(theme).contentContainer}>
                    {/* About Section */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionTitle}>Tentang Program Ini</Text>
                        <Text style={styles(theme).description}>
                            {program.description}
                        </Text>
                    </View>

                    {/* Weekly Guide */}
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).sectionTitle}>Panduan Mingguan</Text>

                        {instructions.map((instruction) => (
                            <TouchableOpacity 
                                key={instruction.id} 
                                style={styles(theme).weekCard}
                                onPress={() => navigation.navigate('ProgramStack', {
                                    screen: 'Instruction',
                                    params: { id: instruction.id }
                                })}
                            >
                                <View style={styles(theme).weekHeader}>
                                    <View>
                                        <Text style={styles(theme).weekTitle}>
                                            {instruction.title}
                                        </Text>
                                        <Text style={styles(theme).weekSubtitle}>
                                            {instruction.subtitle}
                                        </Text>
                                    </View>
                                    <MaterialCommunityIcons 
                                        name={program.isExclusive ? "lock" : "chevron-right"} 
                                        size={24 * SCALE} 
                                        color={theme.textSecondary} 
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Equipment */}
                    <View style={styles(theme).equipmentSection}>
                        <Text style={styles(theme).sectionTitle}>Yang akan kamu butuhkan</Text>
                        <View style={styles(theme).equipmentContainer}>
                            {program.equipment.map((item) => (
                                <View key={item.id} style={styles(theme).equipmentItem}>
                                    <View style={styles(theme).equipmentIconBg}>
                                        <MaterialCommunityIcons 
                                            name={item.icon as MaterialIconName} 
                                            size={40 * SCALE} 
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
                        <TouchableOpacity 
                            style={styles(theme).startButton}
                            onPress={() => navigation.navigate('ProgramStack', {
                                screen: 'Instruction',
                                params: { id: instructions[0]?.id }
                            })}
                        >
                            <Text style={styles(theme).startButtonText}>
                                Mulai transformasi
                            </Text>
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
        height: 250 * SCALE,
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
        top: 40 * SCALE,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20 * SCALE,
    },
    iconButton: {
        width: 30 * SCALE,
        height: 30 * SCALE,
        borderRadius: 15 * SCALE,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        position: 'absolute',
        bottom: 20 * SCALE,
        left: 20 * SCALE,
        right: 20 * SCALE,
    },
    duration: {
        fontSize: 14 * SCALE,
        fontWeight: '500',
        color: theme.textPrimary,
        backgroundColor: theme.background,
        alignSelf: 'flex-start',
        paddingHorizontal: 12 * SCALE,
        paddingVertical: 6 * SCALE,
        borderRadius: 16 * SCALE,
        marginBottom: 12 * SCALE,
    },
    headerTitle: {
        fontSize: 28 * SCALE,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    section: {
        padding: 20 * SCALE,
    },
    sectionTitle: {
        fontSize: 20 * SCALE,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 16 * SCALE,
    },
    description: {
        fontSize: 15 * SCALE,
        color: theme.textSecondary,
        lineHeight: 22 * SCALE,
    },
    weekCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 12 * SCALE,
        padding: 16 * SCALE,
        marginBottom: 12 * SCALE,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weekTitle: {
        fontSize: 16 * SCALE,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4 * SCALE,
    },
    weekSubtitle: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
    },
    equipmentSection: {
        marginHorizontal: 20 * SCALE,
        padding: 20 * SCALE,
        backgroundColor: '#FFFFFF',
        borderRadius: 16 * SCALE,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 20 * SCALE,
    },
    equipmentContainer: {
        gap: 16 * SCALE,
    },
    equipmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12 * SCALE,
    },
    equipmentIconBg: {
        width: 40 * SCALE,
        height: 40 * SCALE,
        borderRadius: 8 * SCALE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    equipmentText: {
        fontSize: 16 * SCALE,
        color: theme.textPrimary,
    },
    startButtonSection: {
        padding: 20 * SCALE,
        backgroundColor: theme.background,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    startButton: {
        backgroundColor: theme.primary,
        padding: 16 * SCALE,
        borderRadius: 12 * SCALE,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16 * SCALE,
        fontWeight: '600',
    },
}); 