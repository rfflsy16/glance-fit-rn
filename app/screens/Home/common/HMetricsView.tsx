import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

export type TabType = 'daily' | 'weekly' | 'monthly';

interface MetricsViewProps {
  title: string;
  navigation: any;
  descriptions: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  numbers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  suffix?: string;
  chartData: {
    daily: ChartData;
    weekly: ChartData;
    monthly: ChartData;
  };
  onPeriodChange?: (date: Date, type: TabType) => void;
}

interface WeeklyDetail {
  day: string;
  calories: number;
}

interface MonthlyDetail {
  period: string;
  calories: number;
}

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
  maximum?: number;
  weeklyDetails?: WeeklyDetail[];
  monthlyDetails?: MonthlyDetail[];
}

interface StyleProps {
  theme: Theme;
}

interface BarStyleProps extends StyleProps {
  totalBars: number;
}

const getMaxYAxis = (
  value: number,
  tabType: TabType,
  numbers: { daily: number; weekly: number; monthly: number }
) => {
  const targetValue =
    tabType === 'daily'
      ? numbers.daily
      : tabType === 'weekly'
      ? numbers.weekly
      : numbers.monthly;
  const maxValue = Math.max(value, targetValue);

  // For small numbers (less than 100), use more precise increments
  if (maxValue <= 5) {
    // Round up to the nearest 0.5
    return Math.ceil(maxValue * 2) / 2;
  }
  if (maxValue <= 20) {
    // Round up to the nearest 1
    return Math.ceil(maxValue);
  }
  if (maxValue <= 50) {
    // Round up to the nearest 5
    return Math.ceil(maxValue / 5) * 5;
  }
  if (maxValue <= 100) {
    // Round up to the nearest 10
    return Math.ceil(maxValue / 10) * 10;
  }
  if (maxValue <= 500) {
    // Round up to the nearest 50
    return Math.ceil(maxValue / 50) * 50;
  }
  if (maxValue <= 1000) {
    // Round up to the nearest 100
    return Math.ceil(maxValue / 100) * 100;
  }
  if (maxValue <= 5000) {
    // Round up to the nearest 500
    return Math.ceil(maxValue / 500) * 500;
  }
  // For very large numbers, round up to the nearest 1000
  return Math.ceil(maxValue / 1000) * 1000;
};

export default function MetricsView({
  title,
  navigation,
  descriptions,
  numbers,
  suffix,
  chartData,
  onPeriodChange,
}: MetricsViewProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getFormattedPeriod = useCallback(() => {
    if (activeTab === 'daily') {
      if (isToday(currentDate)) return 'Hari ini';
      if (isYesterday(currentDate)) return 'Kemarin';
      return currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
      });
    } else if (activeTab === 'weekly') {
      if (isThisWeek(currentDate)) return 'Minggu ini';
      if (isLastWeek(currentDate)) return 'Minggu lalu';
      return `Minggu ${currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
      })}`;
    } else {
      if (isThisMonth(currentDate)) return 'Bulan ini';
      if (isLastMonth(currentDate)) return 'Bulan lalu';
      return currentDate.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
    }
  }, [activeTab, currentDate]);

  const handlePrevious = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (activeTab === 'daily') {
        newDate.setDate(newDate.getDate() - 1);
      } else if (activeTab === 'weekly') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      if (onPeriodChange) {
        onPeriodChange(newDate, activeTab);
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (activeTab === 'daily') {
        newDate.setDate(newDate.getDate() + 1);
      } else if (activeTab === 'weekly') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      // Don't allow going beyond current date
      if (newDate > new Date()) return prevDate;

      if (onPeriodChange) {
        onPeriodChange(newDate, activeTab);
      }
      return newDate;
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (onPeriodChange) {
      onPeriodChange(currentDate, tab);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    return date >= firstDayOfWeek && date <= today;
  };

  const isLastWeek = (date: Date) => {
    const today = new Date();
    const firstDayOfLastWeek = new Date(today);
    firstDayOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
    const lastDayOfLastWeek = new Date(firstDayOfLastWeek);
    lastDayOfLastWeek.setDate(firstDayOfLastWeek.getDate() + 6);
    return date >= firstDayOfLastWeek && date <= lastDayOfLastWeek;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isLastMonth = (date: Date) => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    return (
      date.getMonth() === lastMonth.getMonth() &&
      date.getFullYear() === lastMonth.getFullYear()
    );
  };

  const getCurrentData = () => {
    const baseData = (() => {
      switch (activeTab) {
        case 'daily':
          return chartData.daily;
        case 'weekly':
          return chartData.weekly;
        case 'monthly':
          return chartData.monthly;
      }
    })();

    return {
      ...baseData,
      maximum: getMaxYAxis(
        Math.max(...baseData.datasets[0].data),
        activeTab,
        numbers
      ),
    };
  };

  const getCurrentNumber = () => {
    switch (activeTab) {
      case 'daily':
        return numbers.daily;
      case 'weekly':
        return numbers.weekly;
      case 'monthly':
        return numbers.monthly;
    }
  };

  const getCurrentDescription = () => {
    switch (activeTab) {
      case 'daily':
        return descriptions.daily;
      case 'weekly':
        return descriptions.weekly;
      case 'monthly':
        return descriptions.monthly;
    }
  };

  const data = getCurrentData();

  const formatNumberWithSuffix = (number: number) => {
    if (!suffix) return number.toLocaleString();
    return `${number.toLocaleString()} ${suffix}`;
  };

  const getYAxisLabels = (maximum: number) => {
    // Calculate nice round numbers for the labels
    const step = maximum / 4;
    return [
      maximum,
      Math.floor(maximum * 0.75),
      Math.floor(maximum * 0.5),
      Math.floor(maximum * 0.25),
      0,
    ].filter(Boolean); // Remove 0 if not needed
  };

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      {/* Fixed Header */}
      <View style={styles(theme).fixedHeader}>
        {/* Header */}
        <View style={styles(theme).header}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles(theme).backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles(theme).headerTitle}>{title}</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles(theme).tabContainer}>
          {(['daily', 'weekly', 'monthly'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles(theme).tabButton,
                activeTab === tab && styles(theme).activeTabButton,
              ]}
              onPress={() => handleTabChange(tab)}
            >
              <Text
                style={[
                  styles(theme).tabText,
                  activeTab === tab && styles(theme).activeTabText,
                ]}
              >
                {tab === 'daily'
                  ? 'Hari'
                  : tab === 'weekly'
                  ? 'Minggu'
                  : 'Bulan'}
              </Text>
              {activeTab === tab && (
                <View style={styles(theme).activeTabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles(theme).scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Navigation */}
        <View style={styles(theme).weekNavigation}>
          <TouchableOpacity
            style={styles(theme).weekNavButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles(theme).weekNavText}>{getFormattedPeriod()}</Text>
          <TouchableOpacity
            style={styles(theme).weekNavButton}
            onPress={handleNext}
            disabled={isToday(currentDate)}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isToday(currentDate) ? '#D1D5DB' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* Average Steps */}
        <View style={styles(theme).averageContainer}>
          <Text style={styles(theme).averageNumber}>{getCurrentNumber()}</Text>
          <Text style={styles(theme).averageLabel}>
            {getCurrentDescription()}
          </Text>
        </View>

        {/* Chart */}
        <View style={styles(theme).chartContainer}>
          {/* Y-Axis Labels */}
          <View style={styles(theme).yAxisLabels}>
            {getYAxisLabels(data.maximum).map((value, index) => (
              <Text
                key={index}
                style={[
                  styles(theme).yAxisLabel,
                  {
                    top: 180 * (1 - value / data.maximum), // 180 is the chart height
                    opacity: value === 0 ? 0 : 1, // Hide 0 if not needed
                  },
                ]}
                numberOfLines={1}
              >
                {value.toLocaleString()}
              </Text>
            ))}
          </View>

          {/* Chart Content */}
          <View
            style={[
              styles(theme).chartContent,
              {
                justifyContent: 'space-around',
                paddingHorizontal: 8 * SCALE,
              },
            ]}
          >
            {data.datasets[0].data.map((value, index) => {
              const totalBars = data.datasets[0].data.length;

              // Calculate maximum number of bars that can fit with full width
              const maxBarWidth = 12 * SCALE;
              const minGap = 4 * SCALE;
              const availableWidth = SCREEN_WIDTH - 35 * SCALE - 16 * SCALE * 2;
              const maxBarsWithFullWidth = Math.floor(
                availableWidth / (maxBarWidth + minGap)
              );

              // Determine actual bar width based on number of bars
              const barWidth =
                totalBars > maxBarsWithFullWidth
                  ? availableWidth / totalBars - minGap
                  : maxBarWidth;

              // Calculate height as a percentage of maximum value
              const heightPercentage = (value / data.maximum) * 100;
              const barHeight = (heightPercentage / 100) * 180; // 180 is chart height

              return (
                <View
                  key={index}
                  style={[styles(theme).barColumn, { width: barWidth }]}
                >
                  <View
                    style={[
                      styles(theme).bar,
                      {
                        width: barWidth,
                        height: Math.max(barHeight, 4), // Ensure minimum height of 4
                        opacity: value === 0 ? 0.3 : 1,
                        backgroundColor: value === 0 ? '#E5E7EB' : '#ABE4E8',
                        borderColor: value === 0 ? '#D1D5DB' : '#55C8D1',
                        borderRadius: Math.min(6, barWidth / 2),
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles(theme).barLabel,
                      {
                        fontSize: 11 * SCALE,
                        width:
                          totalBars <= 7
                            ? 40 * SCALE
                            : totalBars <= 18
                            ? 35 * SCALE
                            : 40 * SCALE,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {activeTab === 'daily'
                      ? index % 3 === 0
                        ? data.labels[Math.floor(index / 3)]
                        : ''
                      : activeTab === 'monthly'
                      ? index % 4 === 0
                        ? data.labels[Math.floor(index / 4)]
                        : ''
                      : data.labels[index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Details */}
        {(activeTab === 'weekly' || activeTab === 'monthly') && (
          <View style={styles(theme).detailsWrapper}>
            <Text style={styles(theme).detailsTitle}>
              {activeTab === 'weekly' ? 'Minggu ini' : 'Bulan ini'}
            </Text>
            <View style={styles(theme).detailsContainer}>
              {(activeTab === 'weekly'
                ? data.weeklyDetails || []
                : data.monthlyDetails || []
              ).map((item: WeeklyDetail | MonthlyDetail, index: number) => (
                <View
                  key={index}
                  style={[
                    styles(theme).detailItem,
                    (activeTab === 'weekly' || activeTab === 'monthly') &&
                      styles(theme).weeklyDetailItem,
                  ]}
                >
                  <Text
                    style={[
                      styles(theme).detailDay,
                      (activeTab === 'weekly' || activeTab === 'monthly') &&
                        styles(theme).weeklyDetailDay,
                    ]}
                  >
                    {activeTab === 'weekly'
                      ? (item as WeeklyDetail).day
                      : (item as MonthlyDetail).period}
                  </Text>
                  <Text
                    style={[
                      styles(theme).detailSteps,
                      (activeTab === 'weekly' || activeTab === 'monthly') &&
                        styles(theme).weeklyDetailSteps,
                    ]}
                  >
                    {formatNumberWithSuffix(item.calories)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 16 * SCALE,
    },
    fixedHeader: {
      backgroundColor: '#FFFFFF',
      zIndex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      // paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
      flex: 1,
      textAlign: 'center',
      marginRight: 28 * SCALE,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      // paddingHorizontal: 16,
      marginTop: 16 * SCALE,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      position: 'relative',
    },
    activeTabButton: {
      // Styling untuk tab aktif
    },
    tabText: {
      fontSize: 16,
      color: '#9CA3AF',
      fontWeight: '500',
    },
    activeTabText: {
      color: '#2B6872',
      fontWeight: '600',
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: '#2B6872',
      borderRadius: 1.5,
    },
    weekNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: 16,
      marginTop: 24,
    },
    weekNavButton: {
      paddingVertical: 4,
      paddingHorizontal: 30,
    },
    weekNavText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000000',
    },
    averageContainer: {
      alignItems: 'center',
      marginTop: 12 * SCALE,
      marginBottom: 16,
    },
    averageNumber: {
      fontSize: 48,
      fontWeight: '400',
      color: '#000000',
    },
    averageLabel: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
    },
    chartContainer: {
      flexDirection: 'row',
      marginTop: 16 * SCALE,
      paddingLeft: 20 * SCALE,
      height: 220 * SCALE,
      position: 'relative',
    },
    yAxisLabels: {
      width: 35 * SCALE,
      height: 180,
      position: 'absolute',
      left: 0,
      alignItems: 'flex-start',
    },
    yAxisLabel: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'left',
      position: 'absolute',
      left: 0,
      width: 35 * SCALE,
      paddingRight: 4 * SCALE,
    },
    chartContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: 180,
      paddingLeft: 13 * SCALE,
      paddingRight: 8 * SCALE,
    },
    barColumn: {
      alignItems: 'center',
      height: 180,
      justifyContent: 'flex-end',
      position: 'relative',
    } as const,
    bar: {
      backgroundColor: '#ABE4E8',
      minHeight: 4 * SCALE,
      borderWidth: 1,
      borderColor: '#55C8D1',
      borderRadius: 4,
      alignSelf: 'center',
    } as const,
    barLabel: {
      position: 'absolute',
      bottom: -24 * SCALE,
      color: 'black',
      textAlign: 'center',
      left: '50%',
      transform: [{ translateX: -20 * SCALE }],
    },
    detailsWrapper: {
      flex: 1,
      marginTop: 10,
    },
    detailsContainer: {
      flex: 1,
    },
    detailsTitle: {
      fontSize: 18 * SCALE,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 16 * SCALE,
    },
    detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16 * SCALE,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    weeklyDetailItem: {
      backgroundColor: '#F9FAFB',
      padding: 16 * SCALE,
      borderRadius: 8,
      marginBottom: 8 * SCALE,
      borderBottomWidth: 0,
    },
    detailDay: {
      fontSize: 16 * SCALE,
      color: '#000000',
    },
    weeklyDetailDay: {
      fontSize: 14 * SCALE,
      color: '#6B7280',
    },
    detailSteps: {
      fontSize: 16 * SCALE,
      fontWeight: '500',
      color: '#000000',
    },
    weeklyDetailSteps: {
      fontSize: 16 * SCALE,
      fontWeight: '400',
      color: '#000000',
    },
  });
