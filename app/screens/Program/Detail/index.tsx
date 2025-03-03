import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useProgram } from '@/hooks/useProgram';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Instruction, Program } from '../types';
import JoinProgramSuccess from './JoinProgramSuccess';
import LeaveProgramModal from './LeaveModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface RouteParams {
  id: number;
  program?: Program;
}

// Add navigation type
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export default function ProgramDetailScreen() {
  const route = useRoute();
  const { id, program: initialProgram } = route.params as RouteParams;
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [program, setProgram] = useState<Program | null>(
    initialProgram || null
  );
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);

  const {
    profileProgram: { data: profileData, isLoading: profileLoading },
    instructions: { data: instructions = [], isLoading: instructionsLoading },
    followProgram: { mutate: followProgram, isPending: followLoading },
    leaveProgram: { mutate: leaveProgram, isPending: leaveLoading },
  } = useProgram(Number(id));

  const loading = instructionsLoading || profileLoading;
  const isProgramFollowed = !!profileData?.id;
  const completedDays = profileData?.completedDays || [];

  // Calculate total days in the program
  const calculateTotalDays = (instructions: Instruction[]) => {
    return new Set(instructions.map((i) => i.dayNumber)).size;
  };

  // Calculate progress based on completed days and total days
  const progress = useMemo(() => {
    if (instructions.length > 0) {
      const totalDays = calculateTotalDays(instructions);
      return completedDays.length / totalDays;
    }
    return 0;
  }, [instructions, completedDays]);

  // Handle day completion callback
  const handleDayComplete = useCallback(
    (newCompletedDays: number[]) => {
      if (profileData) {
        // The cache update is now handled by the useProgram hook
        console.log('Day completed:', newCompletedDays);
      }
    },
    [profileData]
  );

  // Handle follow program
  const handleFollowProgram = async () => {
    try {
      if (!user?.profileId) {
        Alert.alert('Error', 'Please log in to follow this program');
        return;
      }

      await followProgram({
        profileId: Number(user.profileId),
        programId: Number(id),
        completedDays: [],
      });
      setShowJoinSuccess(true);
    } catch (error) {
      console.error('Follow program error:', error);
    }
  };

  // Handle leave program
  const handleLeaveProgram = () => {
    if (!program) return;
    leaveProgram(undefined);
    setShowLeaveModal(false);
    navigation.goBack();
  };

  // Group instructions by week
  const weeklyInstructions = instructions.reduce(
    (acc: Record<number, Instruction[]>, instruction: Instruction) => {
      const weekNumber = instruction.weekNumber;
      if (!acc[weekNumber]) {
        acc[weekNumber] = [];
      }
      acc[weekNumber].push(instruction);
      return acc;
    },
    {} as Record<number, Instruction[]>
  );

  // Sort weeks by weekNumber
  const sortedWeeks = Object.keys(weeklyInstructions)
    .map(Number)
    .sort((a, b) => a - b);

  // Check if a week is unlocked (week 1 is always unlocked)
  const isWeekUnlocked = (weekNumber: number) => {
    if (weekNumber === 1) return true;

    // For week 2 and beyond, check if at least one day from the previous week is completed
    const previousWeekInstructions = weeklyInstructions[weekNumber - 1] || [];
    if (previousWeekInstructions.length === 0) return false;

    // Get day numbers from previous week
    const previousWeekDays = previousWeekInstructions.map(
      (instruction: Instruction) => instruction.dayNumber
    );

    // Check if any day from previous week is completed
    return previousWeekDays.some((day: number) => completedDays.includes(day));
  };

  // Format requirements as equipment
  const formatEquipment = (requirements: string[] = []) => {
    const icons: Record<string, string> = {
      'timbang badan': 'scale-bathroom',
      matras: 'yoga',
      pakaian: 'tshirt-crew',
      sepatu: 'shoe-sneaker',
      default: 'dumbbell',
    };

    return requirements.map((req, index) => ({
      id: index + 1,
      name: req,
      icon: getIconForRequirement(req),
      bgColor: '#FFF7ED',
    }));
  };

  // Helper to get icon based on requirement text
  const getIconForRequirement = (requirement: string) => {
    const lowerReq = requirement.toLowerCase();
    if (lowerReq.includes('timbang') || lowerReq.includes('scale'))
      return 'scale-bathroom';
    if (lowerReq.includes('matras') || lowerReq.includes('yoga')) return 'yoga';
    if (lowerReq.includes('pakaian') || lowerReq.includes('baju'))
      return 'tshirt-crew';
    if (lowerReq.includes('sepatu')) return 'shoe-sneaker';
    if (lowerReq.includes('container') || lowerReq.includes('makanan'))
      return 'food-variant';
    return 'dumbbell'; // Default icon
  };

  // Update the navigation to Instruction screen to include the callback
  const navigateToInstruction = (weekNumber: number) => {
    navigation.navigate('Instruction', {
      id,
      programId: id,
      weekNumber,
      instructions,
      onDayComplete: handleDayComplete,
    });
  };

  if (loading) {
    return (
      <View style={[styles(theme).container, { paddingTop: insets.top }]}>
        <View style={styles(theme).header}>
          <TouchableOpacity
            style={styles(theme).backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles(theme).loadingText}>
            Loading program details...
          </Text>
        </View>
      </View>
    );
  }

  if (!program) {
    return (
      <View style={[styles(theme).container, { paddingTop: insets.top }]}>
        <View style={styles(theme).header}>
          <TouchableOpacity
            style={styles(theme).backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles(theme).errorContainer}>
          <Text style={styles(theme).errorText}>Program not found</Text>
          <TouchableOpacity
            style={styles(theme).retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles(theme).retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles(theme).scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with image */}
        <View style={styles(theme).header}>
          <TouchableOpacity
            style={styles(theme).backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {isProgramFollowed && (
            <TouchableOpacity
              style={styles(theme).menuButton}
              onPress={() => setShowLeaveModal(true)}
            >
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <View style={styles(theme).imageOverlay} />
          <Image
            source={{ uri: program.imgUrl }}
            style={styles(theme).headerImage}
          />
          <View style={styles(theme).headerContent}>
            <View style={styles(theme).durationBadge}>
              <Text style={styles(theme).durationText}>
                {Math.ceil(program.weeklyDuration / 7)} Minggu
              </Text>
            </View>
            <Text style={styles(theme).title}>{program.title}</Text>
          </View>
        </View>

        {/* Program Progress - Only show if program is followed */}
        {isProgramFollowed && (
          <View style={styles(theme).progressContainer}>
            <Text style={styles(theme).progressTitle}>
              Program Kemajuan Program
            </Text>
            <View style={styles(theme).progressSection}>
              <View style={styles(theme).progressBarContainer}>
                <View
                  style={[
                    styles(theme).progressBar,
                    { width: `${Math.min(progress * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles(theme).progressText}>
                {completedDays.length} hari dari{' '}
                {calculateTotalDays(instructions)} hari
              </Text>
            </View>
          </View>
        )}

        {/* Program Description */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Tentang Program Ini</Text>
          <Text style={styles(theme).description}>{program.description}</Text>
        </View>

        {/* Weekly Guides */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Panduan Mingguan</Text>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <Text style={{ display: 'none' }}>
              {JSON.stringify({ isProgramFollowed, sortedWeeks })}
            </Text>
          )}

          {sortedWeeks.length === 0 ? (
            <Text style={styles(theme).emptyText}>
              No weekly guides available yet.
            </Text>
          ) : (
            sortedWeeks.map((weekNumber) => {
              const weekInstructions = weeklyInstructions[weekNumber];
              const isCompleted = weekInstructions.every(
                (instruction: Instruction) => instruction.isCompleted
              );

              // Get the first instruction for this week to display title and subtitle
              const firstInstruction = weekInstructions[0];

              return (
                <TouchableOpacity
                  key={`week-${weekNumber}`}
                  style={[
                    styles(theme).weekItem,
                    !isProgramFollowed && styles(theme).weekItemLocked,
                  ]}
                  onPress={() => {
                    if (isProgramFollowed) {
                      navigateToInstruction(weekNumber);
                    }
                  }}
                  disabled={!isProgramFollowed}
                >
                  <View style={styles(theme).weekContent}>
                    <Text style={styles(theme).weekTitle}>
                      Minggu ke {weekNumber}
                    </Text>
                    <Text style={styles(theme).weekSubtitle}>
                      {firstInstruction.description}
                    </Text>
                  </View>
                  <View style={styles(theme).weekIconContainer}>
                    {isProgramFollowed ? (
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={theme.textSecondary}
                      />
                    ) : (
                      <Ionicons
                        name="lock-closed"
                        size={24}
                        color={theme.textSecondary}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Equipment Needed */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>
            Yang akan kamu butuhkan
          </Text>

          {program.requirements.length === 0 ? (
            <Text style={styles(theme).emptyText}>No equipment required.</Text>
          ) : (
            formatEquipment(program.requirements).map((item) => (
              <View
                key={`equipment-${item.id}`}
                style={styles(theme).equipmentItem}
              >
                <View
                  style={[
                    styles(theme).equipmentIconContainer,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color="#F97316"
                  />
                </View>
                <Text style={styles(theme).equipmentName}>{item.name}</Text>
              </View>
            ))
          )}
        </View>

        {/* Bottom padding to ensure content is not hidden behind the button */}
        {!isProgramFollowed && <View style={{ height: 80 * SCALE }} />}
      </ScrollView>

      {/* Follow Program Button - Only show if program is not followed */}
      {!isProgramFollowed && (
        <View style={styles(theme).followButtonContainer}>
          <TouchableOpacity
            style={styles(theme).followButton}
            onPress={handleFollowProgram}
            disabled={followLoading}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles(theme).followButtonText}>
                Mulai Transformasi
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <LeaveProgramModal
        visible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveProgram}
        loading={leaveLoading}
      />

      <JoinProgramSuccess
        visible={showJoinSuccess}
        onClose={() => setShowJoinSuccess(false)}
      />
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      position: 'relative',
      height: 230 * SCALE,
    },
    backButton: {
      position: 'absolute',
      top: 16 * SCALE,
      left: 16 * SCALE,
      zIndex: 10,
      width: 40 * SCALE,
      height: 40 * SCALE,
      borderRadius: 20 * SCALE,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1,
    },
    headerContent: {
      position: 'absolute',
      bottom: 16 * SCALE,
      left: 16 * SCALE,
      right: 16 * SCALE,
      zIndex: 2,
    },
    durationBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12 * SCALE,
      paddingVertical: 6 * SCALE,
      borderRadius: 16 * SCALE,
      alignSelf: 'flex-start',
      marginBottom: 8 * SCALE,
    },
    durationText: {
      color: '#FFFFFF',
      fontSize: 14 * SCALE,
      fontWeight: '500',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 24 * SCALE,
      fontWeight: '700',
    },
    progressContainer: {
      backgroundColor: theme.cardBackground,
      padding: 16 * SCALE,
      marginHorizontal: 16 * SCALE,
      marginTop: 16 * SCALE,
      borderRadius: 12 * SCALE,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    progressTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 12 * SCALE,
    },
    progressSection: {
      marginTop: 8 * SCALE,
    },
    progressText: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginTop: 8 * SCALE,
    },
    progressBarContainer: {
      height: 8 * SCALE,
      backgroundColor: theme.border,
      borderRadius: 4 * SCALE,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4 * SCALE,
    },
    section: {
      padding: 16 * SCALE,
      marginBottom: 8 * SCALE,
    },
    sectionTitle: {
      fontSize: 18 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 12 * SCALE,
    },
    description: {
      fontSize: 14 * SCALE,
      lineHeight: 22 * SCALE,
      color: theme.textSecondary,
    },
    weekItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardBackground,
      borderRadius: 12 * SCALE,
      padding: 16 * SCALE,
      marginBottom: 12 * SCALE,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    weekItemLocked: {
      opacity: 0.7,
    },
    weekContent: {
      flex: 1,
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
    weekIconContainer: {
      marginLeft: 12 * SCALE,
    },
    equipmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12 * SCALE,
    },
    equipmentIconContainer: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      borderRadius: 20 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12 * SCALE,
    },
    equipmentName: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12 * SCALE,
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16 * SCALE,
    },
    errorText: {
      fontSize: 16 * SCALE,
      color: theme.error,
      textAlign: 'center',
      marginBottom: 16 * SCALE,
    },
    retryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 8 * SCALE,
      borderRadius: 8 * SCALE,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16 * SCALE,
      fontWeight: '500',
    },
    emptyText: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: 12 * SCALE,
    },
    followButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16 * SCALE,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    followButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16 * SCALE,
      borderRadius: 8 * SCALE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    followButtonText: {
      color: '#FFFFFF',
      fontSize: 16 * SCALE,
      fontWeight: '600',
    },
    menuButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
