import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from './common/Card';
import { CategoryData, Program } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375; // Base width dari design

interface JoinProgramSuccessProps {
  visible: boolean;
  onClose: () => void;
}

function JoinProgramSuccess({ visible, onClose }: JoinProgramSuccessProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={joinSuccessStyles(theme).overlay}>
        <View style={joinSuccessStyles(theme).container}>
          <Text style={joinSuccessStyles(theme).text}>
            Berhasil bergabung kedalam Program
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const joinSuccessStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      backgroundColor: '#E8FFF1',
      paddingVertical: 16 * SCALE,
      paddingHorizontal: 24 * SCALE,
      borderRadius: 100,
      marginHorizontal: 16 * SCALE,
    },
    text: {
      color: '#15803D',
      fontSize: 14 * SCALE,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

export default function ProgramScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>([]);
  const navigation = useNavigation();

  // Fetch all programs
  const { data: allPrograms = [], isLoading: allProgramsLoading } = useFetch<
    Program[]
  >({
    endpoint: '/programs',
    enabled: true, // Always fetch all programs for recommendations
  });

  // Fetch programs by category
  const { data: categoryPrograms = [], isLoading: categoryProgramsLoading } =
    useFetch<Program[]>({
      endpoint: `/programs/category/${selectedCategoryId}`,
      enabled: selectedCategoryId !== 1,
    });

  // Fetch exclusive programs
  const { data: exclusivePrograms = [], isLoading: exclusiveProgramsLoading } =
    useFetch<Program[]>({
      endpoint: '/programs/exclusive',
    });

  // Get random recommendations from all programs
  const getRandomRecommendations = (programs: Program[]) => {
    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: Program[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Create a copy of the array to avoid mutating the original
    const shuffledPrograms = shuffleArray([...programs]);

    // Get first 3 programs after shuffling
    return shuffledPrograms.slice(0, 3);
  };

  useEffect(() => {
    if (allPrograms.length > 0) {
      const recommendations = getRandomRecommendations(allPrograms);
      setRecommendedPrograms(recommendations);
    }
  }, [allPrograms]);

  const loading =
    allProgramsLoading || categoryProgramsLoading || exclusiveProgramsLoading;
  const programs = selectedCategoryId === 1 ? allPrograms : categoryPrograms;
  const error = '';

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
    isFollow: false,
    equipment: [
      {
        id: 1,
        name: 'Timbang badan',
        icon: 'scale-bathroom',
        bgColor: '#FFF7ED',
      },
    ],
  });

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
            onPress={() => setSelectedCategoryId(selectedCategoryId)}
          >
            <Text style={styles(theme).retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* AI Recommended Programs */}
      {!loading &&
        !error &&
        recommendedPrograms.length > 0 &&
        selectedCategoryId === 1 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Rekomendasi untukmu</Text>
            <Text style={styles(theme).sectionSubtitle}>
              Temukan yang sesuai dengan kebutuhanmu
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
            Temukan yang sesuai dengan kebutuhanmu
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

      {/* Regular Programs */}
      {!loading &&
        !error &&
        programs.length > 0 &&
        selectedCategoryId !== 1 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Program Tersedia</Text>
            <Text style={styles(theme).sectionSubtitle}>
              Temukan yang sesuai dengan kebutuhanmu
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles(theme).programsContainer}
            >
              {programs.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles(theme).cardWrapper,
                    index === 0 && { marginLeft: 16 * SCALE },
                    index === programs.length - 1 && {
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

      {/* No Programs Found */}
      {!loading && !error && programs.length === 0 && (
        <View style={styles(theme).emptyContainer}>
          <Text style={styles(theme).emptyText}>No programs found</Text>
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
  });
