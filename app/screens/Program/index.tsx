import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchAllPrograms,
  fetchExclusivePrograms,
  fetchInstructionsByProgramId,
  fetchProgramsByCategory,
  getAIRecommendations,
} from './api';
import Card from './common/Card';
import { CategoryData, Instruction, Program } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width dari design

export default function ProgramScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default: Semua
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exclusivePrograms, setExclusivePrograms] = useState<Program[]>([]);
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  );
  // @ts-ignore - Ignore type checking for navigation
  const navigation = useNavigation();

  // Fetch programs based on selected category
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError('');
      try {
        let fetchedPrograms: Program[];

        if (selectedCategoryId === 1) {
          // Fetch all programs
          fetchedPrograms = await fetchAllPrograms();
        } else {
          // Fetch programs by category
          fetchedPrograms = await fetchProgramsByCategory(selectedCategoryId);
        }

        // Filter non-exclusive programs
        const regularPrograms = fetchedPrograms.filter((p) => !p.isExclusive);

        // Get AI recommendations for regular programs
        const recommendations = await getAIRecommendations(regularPrograms);
        setRecommendedPrograms(recommendations);

        // Fetch exclusive programs separately
        const exclusives = await fetchExclusivePrograms();
        setExclusivePrograms(exclusives);

        // Store all programs for reference
        setPrograms(fetchedPrograms);

        // If we have programs, select the first one to show instructions
        if (fetchedPrograms.length > 0) {
          setSelectedProgramId(fetchedPrograms[0].id);
          const instructionsData = await fetchInstructionsByProgramId(
            fetchedPrograms[0].id
          );
          setInstructions(instructionsData);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [selectedCategoryId]);

  // Format duration string from weeklyDuration
  const formatDuration = (weeklyDuration: number): string => {
    const weeks = Math.ceil(weeklyDuration / 7);
    return `${weeks} Minggu`;
  };

  // Map program data to display format
  const mapProgramForDisplay = (program: Program) => ({
    ...program,
    duration: formatDuration(program.weeklyDuration),
    image: program.imgUrl,
    // Add isFollow property (required by Card component)
    isFollow: false, // Default value since it's not in the backend schema
    // Default equipment if not available from API
    equipment: [
      {
        id: 1,
        name: 'Timbang badan',
        icon: 'scale-bathroom',
        bgColor: '#FFF7ED',
      },
    ],
  });

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

    // Previous week must be completed to unlock this week
    const previousWeek = weeklyInstructions[weekNumber - 1];
    if (!previousWeek) return false;

    return previousWeek.every(
      (instruction: Instruction) => instruction.isCompleted
    );
  };

  return (
    <ScrollView
      style={[styles(theme).container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles(theme).pageTitle}>Program</Text>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(theme).categoriesContainer}
      >
        {CategoryData.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles(theme).categoryButton,
              selectedCategoryId === category.id &&
                styles(theme).categoryButtonActive,
            ]}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <Text
              style={[
                styles(theme).categoryText,
                selectedCategoryId === category.id &&
                  styles(theme).categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading State */}
      {loading && (
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles(theme).loadingText}>Loading programs...</Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && (
        <View style={styles(theme).errorContainer}>
          <Text style={styles(theme).errorText}>{error}</Text>
          <TouchableOpacity
            style={styles(theme).retryButton}
            onPress={() => setSelectedCategoryId(selectedCategoryId)} // Trigger re-fetch
          >
            <Text style={styles(theme).retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Regular Programs (AI Recommended) */}
      {!loading && !error && recommendedPrograms.length > 0 && (
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Rekomendasi untukmu</Text>
          <Text style={styles(theme).sectionSubtitle}>
            Temukan yg sesuai dgn kebutuhanmu
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles(theme).programsContainer}
          >
            {recommendedPrograms.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles(theme).cardWrapper,
                  index === 0 && { marginLeft: 16 * SCALE },
                  index === recommendedPrograms.length - 1 && {
                    marginRight: 16 * SCALE,
                  },
                ]}
              >
                <Card item={mapProgramForDisplay(item)} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Exclusive Programs */}
      {!loading && !error && exclusivePrograms.length > 0 && (
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>
            Program eksklusif dari Glance Fit
          </Text>
          <Text style={styles(theme).sectionSubtitle}>
            Program spesial dgn hasil maksimal
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles(theme).programsContainer}
          >
            {exclusivePrograms.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles(theme).cardWrapper,
                  index === 0 && { marginLeft: 16 * SCALE },
                  index === exclusivePrograms.length - 1 && {
                    marginRight: 16 * SCALE,
                  },
                ]}
              >
                <Card item={mapProgramForDisplay(item)} exclusive={true} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* No Programs Found */}
      {!loading && !error && programs.length === 0 && (
        <View style={styles(theme).emptyContainer}>
          <Text style={styles(theme).emptyText}>No programs found</Text>
        </View>
      )}

      {/* Weekly Guide */}
      {!loading && !error && instructions.length > 0 && (
        <View style={styles(theme).weeklyGuide}>
          <Text style={styles(theme).weeklyGuideTitle}>Panduan Mingguan</Text>
          {sortedWeeks.map((weekNumber) => {
            const weekInstructions = weeklyInstructions[weekNumber];
            const isUnlocked = isWeekUnlocked(weekNumber);
            const isCompleted = weekInstructions.every(
              (i: Instruction) => i.isCompleted
            );

            // Get the first instruction for this week to display title and subtitle
            const firstInstruction = weekInstructions[0];

            return (
              <TouchableOpacity
                key={`week-${weekNumber}`}
                style={[
                  styles(theme).weekItem,
                  !isUnlocked && styles(theme).weekItemLocked,
                ]}
                onPress={() => {
                  if (isUnlocked && selectedProgramId) {
                    // Navigate to instruction screen through ProgramStack
                    // @ts-ignore - Ignore type checking for navigation.navigate
                    navigation.navigate('ProgramStack', {
                      screen: 'Instruction',
                      params: {
                        id: selectedProgramId, // For backward compatibility
                        programId: selectedProgramId,
                        weekNumber,
                        instructions: weekInstructions,
                      },
                    });
                  }
                }}
                disabled={!isUnlocked}
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
                  {isUnlocked ? (
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
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    pageTitle: {
      fontSize: 24 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginHorizontal: 16 * SCALE,
      marginVertical: 16 * SCALE,
      textAlign: 'center',
    },
    categoriesContainer: {
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 8 * SCALE,
      gap: 8 * SCALE,
    },
    categoryButton: {
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 8 * SCALE,
      borderRadius: 20 * SCALE,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 8 * SCALE,
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryText: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
    },
    categoryTextActive: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    section: {
      paddingTop: 24 * SCALE,
    },
    sectionTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4 * SCALE,
      marginHorizontal: 16 * SCALE,
    },
    sectionSubtitle: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginBottom: 16 * SCALE,
      marginHorizontal: 16 * SCALE,
    },
    programsContainer: {
      paddingBottom: 16 * SCALE,
    },
    cardWrapper: {
      marginRight: 12 * SCALE,
    },
    loadingContainer: {
      padding: 20 * SCALE,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10 * SCALE,
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
    },
    errorContainer: {
      padding: 20 * SCALE,
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16 * SCALE,
      color: theme.error,
      marginBottom: 10 * SCALE,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20 * SCALE,
      paddingVertical: 10 * SCALE,
      borderRadius: 8 * SCALE,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    emptyContainer: {
      padding: 40 * SCALE,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    weeklyGuide: {
      padding: 16 * SCALE,
    },
    weeklyGuideTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 16 * SCALE,
    },
    weekItem: {
      padding: 12 * SCALE,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8 * SCALE,
      marginBottom: 8 * SCALE,
      flexDirection: 'row',
      alignItems: 'center',
    },
    weekItemLocked: {
      backgroundColor: theme.background,
    },
    weekContent: {
      flex: 1,
    },
    weekTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    weekSubtitle: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
    },
    weekIconContainer: {
      width: 24 * SCALE,
      height: 24 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
