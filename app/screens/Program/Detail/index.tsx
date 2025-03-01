import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Theme } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getProgramById, getInstructionsByProgram } from "../constans";

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

    const handleStartProgram = () => {
        console.log('Mulai program:', program.title);
    };

    return (
        <View style={styles(theme).container}>
            <StatusBar barStyle="light-content" />
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles(theme).scrollContent}
            >
                {/* Header Image */}
                <View style={styles(theme).headerSection}>
                    <Image 
                        source={{ uri: program.image }}
                        style={styles(theme).headerImage}
                    />
                    <View style={styles(theme).headerOverlay} />
                    
                    {/* Back & Menu Buttons */}
                    <View style={styles(theme).headerNav}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            style={styles(theme).iconButton}
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles(theme).iconButton}>
                            <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Duration Badge & Title */}
                    <View style={styles(theme).headerContent}>
                        <View style={styles(theme).durationBadge}>
                            <Text style={styles(theme).durationText}>{program.duration}</Text>
                        </View>
                        <Text style={styles(theme).headerTitle}>{program.title}</Text>
                    </View>
                </View>

                {/* Progress Section - Only show if following */}
                {program.isFollow && (
                    <View style={styles(theme).progressCard}>
                        <Text style={styles(theme).progressText}>1 hari dari 21 hari</Text>
                        <View style={styles(theme).progressBar}>
                            <View style={[styles(theme).progressFill, { width: '5%' }]} />
                        </View>
                    </View>
                )}

                {/* About Section */}
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Tentang Program Ini</Text>
                    <Text style={styles(theme).description}>{program.description}</Text>
                </View>

                {/* Weekly Guide */}
                <View style={styles(theme).section}>
                    <Text style={styles(theme).sectionTitle}>Panduan Mingguan</Text>
                    {instructions.map((instruction) => (
                        <TouchableOpacity 
                            key={instruction.id}
                            style={[
                                styles(theme).weekCard,
                                program.isFollow && instruction.isComplete && styles(theme).weekCardActive
                            ]}
                            onPress={() => {
                                if (program.isFollow && instruction.isComplete) {
                                    navigation.navigate('ProgramStack', {
                                        screen: 'Instruction',
                                        params: { id: instruction.id }
                                    });
                                }
                            }}
                            disabled={!program.isFollow || !instruction.isComplete}
                        >
                            <View>
                                <Text style={styles(theme).weekTitle}>{instruction.title}</Text>
                                <Text style={styles(theme).weekSubtitle}>{instruction.subtitle}</Text>
                            </View>
                            <MaterialCommunityIcons 
                                name={program.isFollow && instruction.isComplete ? "chevron-right" : "lock"} 
                                size={24} 
                                color={theme.textSecondary}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Equipment Section */}
                <View style={styles(theme).equipmentCard}>
                    <Text style={styles(theme).sectionTitle}>Yang akan kamu butuhkan</Text>
                    <View style={styles(theme).equipmentList}>
                        {program.equipment.map((item) => (
                            <View key={item.id} style={styles(theme).equipmentItem}>
                                <View style={[styles(theme).equipmentIcon, { backgroundColor: item.bgColor }]}>
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

                {/* Start Button - Only show if not following */}
                {!program.isFollow && (
                    <TouchableOpacity 
                        style={styles(theme).startButton}
                        onPress={handleStartProgram}
                    >
                        <Text style={styles(theme).startButtonText}>
                            Mulai transformasi
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContent: {
        paddingBottom: 24 * SCALE,
    },
    headerSection: {
        height: 220 * SCALE,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    headerNav: {
        position: 'absolute',
        top: 44 * SCALE,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16 * SCALE,
    },
    iconButton: {
        width: 40 * SCALE,
        height: 40 * SCALE,
        borderRadius: 20 * SCALE,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        position: 'absolute',
        bottom: 20 * SCALE,
        left: 16 * SCALE,
    },
    durationBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12 * SCALE,
        paddingVertical: 6 * SCALE,
        borderRadius: 16 * SCALE,
        alignSelf: 'flex-start',
        marginBottom: 8 * SCALE,
    },
    durationText: {
        fontSize: 14 * SCALE,
        color: theme.textPrimary,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 24 * SCALE,
        fontWeight: '700',
        color: '#FFF',
    },
    progressCard: {
        margin: 16 * SCALE,
        padding: 16 * SCALE,
        backgroundColor: '#FFF',
        borderRadius: 12 * SCALE,
        borderWidth: 1,
        borderColor: theme.border,
    },
    progressText: {
        fontSize: 14 * SCALE,
        color: theme.textSecondary,
        marginBottom: 8 * SCALE,
    },
    progressBar: {
        height: 4 * SCALE,
        backgroundColor: theme.border,
        borderRadius: 2 * SCALE,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.primary,
        borderRadius: 2 * SCALE,
    },
    section: {
        paddingHorizontal: 16 * SCALE,
        marginBottom: 24 * SCALE,
    },
    sectionTitle: {
        marginTop: 40 * SCALE,
        fontSize: 18 * SCALE,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16 * SCALE,
        backgroundColor: '#F8FAFC',
        borderRadius: 12 * SCALE,
        marginBottom: 12 * SCALE,
    },
    weekCardActive: {
        backgroundColor: '#E0F2FE',
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
    equipmentCard: {
        margin: 16 * SCALE,
        padding: 16 * SCALE,
        backgroundColor: '#FFF',
        borderRadius: 12 * SCALE,
        borderWidth: 1,
        borderColor: theme.border,
    },
    equipmentList: {
        gap: 16 * SCALE,
    },
    equipmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12 * SCALE,
    },
    equipmentIcon: {
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
    startButton: {
        marginHorizontal: 16 * SCALE,
        marginTop: 8 * SCALE,
        backgroundColor: theme.primary,
        padding: 16 * SCALE,
        borderRadius: 12 * SCALE,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16 * SCALE,
        fontWeight: '600',
    },
}); 