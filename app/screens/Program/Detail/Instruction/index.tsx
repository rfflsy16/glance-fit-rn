import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchInstructionsByProgramId, updateProgramProgress } from '../../api';
import { Instruction as InstructionType } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width from design

type InstructionRouteParams = {
  id: number;
  programId?: number;
  weekNumber?: number;
  instructions?: InstructionType[];
};

export default function Instruction() {
  const { theme } = useTheme();
  const route =
    useRoute<RouteProp<Record<string, InstructionRouteParams>, string>>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Get params from route
  const {
    id,
    programId: routeProgramId,
    weekNumber: routeWeekNumber,
    instructions: routeInstructions,
  } = route.params;

  const [activeDay, setActiveDay] = useState(1);
  const [instructions, setInstructions] = useState<InstructionType[]>(
    routeInstructions || []
  );
  const [loading, setLoading] = useState(!routeInstructions);
  const [weekNumber, setWeekNumber] = useState(routeWeekNumber || 1);
  const [programId, setProgramId] = useState(routeProgramId || id);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  // Fetch instructions if not provided in route params
  useEffect(() => {
    if (!routeInstructions) {
      const loadInstructions = async () => {
        try {
          setLoading(true);
          const data = await fetchInstructionsByProgramId(programId);
          setInstructions(data);

          // Set week number from first instruction if not provided
          if (!routeWeekNumber && data.length > 0) {
            setWeekNumber(data[0].weekNumber);
          }
        } catch (error) {
          console.error('Error loading instructions:', error);
        } finally {
          setLoading(false);
        }
      };

      loadInstructions();
    }
  }, [programId, routeInstructions, routeWeekNumber]);

  // Group instructions by day
  const instructionsByDay = instructions.reduce((acc, instruction) => {
    // Only include instructions for the current week
    if (instruction.weekNumber !== weekNumber) return acc;

    const dayNumber = instruction.dayNumber;
    if (!acc[dayNumber]) {
      acc[dayNumber] = [];
    }
    acc[dayNumber].push(instruction);
    return acc;
  }, {} as Record<number, InstructionType[]>);

  // Sort days by dayNumber
  const sortedDays = Object.keys(instructionsByDay)
    .map(Number)
    .sort((a, b) => a - b);

  // Get the active day instruction
  const activeDayInstruction = instructionsByDay[activeDay]?.[0];

  // Get week description from the first instruction of the week
  const weekDescription =
    instructions.find((instruction) => instruction.weekNumber === weekNumber)
      ?.description || '';

  // Handle day completion
  const handleCompleteDay = async () => {
    if (!completedDays.includes(activeDay)) {
      const newCompletedDays = [...completedDays, activeDay];
      setCompletedDays(newCompletedDays);

      // Calculate progress percentage
      const totalDays = sortedDays.length;
      const progress = (newCompletedDays.length / totalDays) * 100;

      // Update progress in the backend
      try {
        await updateProgramProgress(programId, progress);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Minggu ke-{weekNumber}</Text>
        <View style={{ width: 40 }} /> {/* Placeholder for alignment */}
      </View>

      <ScrollView
        style={styles(theme).content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(theme).scrollContent}
      >
        <View style={styles(theme).weekDescriptionContainer}>
          <Text style={styles(theme).weekTitle}>{weekDescription}</Text>
        </View>

        {/* Day Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles(theme).dayTabsContainer}
          contentContainerStyle={styles(theme).dayTabsScrollContent}
        >
          {sortedDays.map((day) => (
            <TouchableOpacity
              key={`day-tab-${day}`}
              style={styles(theme).dayTab}
              onPress={() => setActiveDay(day)}
            >
              <View style={styles(theme).dayTabContent}>
                <Text
                  style={[
                    styles(theme).dayTabText,
                    activeDay === day && styles(theme).activeDayTabText,
                  ]}
                >
                  Hari {day}
                </Text>
                {completedDays.includes(day) && (
                  <View style={styles(theme).checkmarkContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16 * SCALE}
                      color={theme.primary}
                    />
                  </View>
                )}
              </View>
              {activeDay === day && (
                <View style={styles(theme).activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles(theme).emptyContainer}>
            <Text style={styles(theme).emptyText}>Loading...</Text>
          </View>
        ) : activeDayInstruction ? (
          <View style={styles(theme).instructionContent}>
            {/* Topic Section */}
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionLabel}>Topik</Text>
              <Text style={styles(theme).topicText}>
                {activeDayInstruction.title}
              </Text>
            </View>

            {/* Target Section */}
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionLabel}>Sasaran</Text>
              <Text style={styles(theme).sectionText}>
                {activeDayInstruction.description}
              </Text>
            </View>

            {/* Guide Section */}
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionLabel}>Panduan</Text>
              <Text style={styles(theme).sectionText}>
                {activeDayInstruction.steps}
              </Text>
            </View>

            {/* Activity Section */}
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionLabel}>Aktivitas</Text>
              <Text style={styles(theme).sectionText}>
                {activeDayInstruction.tips}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles(theme).emptyContainer}>
            <Text style={styles(theme).emptyText}>
              No instructions available for this day.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Complete Button Container */}
      {!loading && activeDayInstruction && (
        <View style={styles(theme).completeButtonContainer}>
          <TouchableOpacity
            style={[
              styles(theme).completeButton,
              completedDays.includes(activeDay) &&
                styles(theme).completedButton,
            ]}
            onPress={handleCompleteDay}
          >
            <Text style={styles(theme).completeButtonText}>
              {completedDays.includes(activeDay)
                ? 'Sudah Selesai'
                : `Selesaikan Hari ${activeDay}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16 * SCALE,
      height: 48 * SCALE,
      backgroundColor: '#FFFFFF',
    },
    backButton: {
      position: 'absolute',
      height: 48 * SCALE,
      width: 48 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    headerTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
      textAlign: 'center',
      width: '100%',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 24 * SCALE,
    },
    weekDescriptionContainer: {
      paddingHorizontal: 16 * SCALE,
      paddingTop: 16 * SCALE,
      paddingBottom: 16 * SCALE,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    weekTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: '#000000',
    },
    weekDescription: {
      fontSize: 14 * SCALE,
      lineHeight: 20 * SCALE,
      color: '#6B7280',
      paddingHorizontal: 16 * SCALE,
      marginTop: 8 * SCALE,
      marginBottom: 24 * SCALE,
    },
    dayTabsContainer: {
      height: 44 * SCALE,
      //   borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    dayTabsScrollContent: {
      paddingLeft: 16 * SCALE,
      height: '100%',
    },
    dayTab: {
      height: '100%',
      marginRight: 32 * SCALE,
      justifyContent: 'center',
      position: 'relative',
    },
    dayTabText: {
      fontSize: 16 * SCALE,
      color: '#6B7280',
      fontWeight: '400',
    },
    activeDayTabText: {
      color: theme.primary,
      fontWeight: '600',
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: -1,
      left: 0,
      right: 0,
      height: 2 * SCALE,
      backgroundColor: theme.primary,
    },
    instructionContent: {
      paddingHorizontal: 16 * SCALE,
      paddingTop: 24 * SCALE,
    },
    section: {
      marginBottom: 24 * SCALE,
    },
    sectionLabel: {
      fontSize: 14 * SCALE,
      fontWeight: 'bold',

      color: 'black',
      marginBottom: 4 * SCALE,
    },
    topicText: {
      fontSize: 18 * SCALE,
      fontWeight: '700',
      color: '#000000',
      marginTop: 4 * SCALE,
    },
    sectionText: {
      fontSize: 14 * SCALE,
      lineHeight: 20 * SCALE,
      color: '#6B7280',
    },
    completeButtonContainer: {
      paddingHorizontal: 16 * SCALE,
      paddingBottom: 36 * SCALE,
      paddingTop: 16 * SCALE,
      backgroundColor: '#FFFFFF',
    },
    completeButton: {
      backgroundColor: '#0F766E',
      paddingVertical: 16 * SCALE,
      borderRadius: 8 * SCALE,
      alignItems: 'center',
    },
    completeButtonText: {
      color: '#FFFFFF',
      fontSize: 16 * SCALE,
      fontWeight: '600',
    },
    emptyContainer: {
      padding: 24 * SCALE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 14 * SCALE,
      color: '#6B7280',
      textAlign: 'center',
    },
    dayTabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * SCALE,
    },
    checkmarkContainer: {
      marginLeft: 4 * SCALE,
    },
    completedButton: {
      backgroundColor: '#4B5563',
    },
  });
