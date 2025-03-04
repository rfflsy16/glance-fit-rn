import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

type Activity = {
  id: string;
  type: 'purchase' | 'reward' | 'usage';
  title: string;
  description: string;
  date: string;
  time: string;
};

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'purchase',
    title: 'Pembelian balance',
    description: '30 balance berhasil ditambahkan',
    date: '17 Agustus 2024',
    time: '20:50 WIB',
  },
  {
    id: '2',
    type: 'reward',
    title: 'Rewards!',
    description:
      'Selamat kamu telah mendapatkan 10 balance tambahan berhasil ditambahkan',
    date: '17 Agustus 2024',
    time: '20:50 WIB',
  },
  {
    id: '3',
    type: 'usage',
    title: 'Penggunaan balance',
    description:
      'Selamat kamu telah mendapatkan 10 balance tambahan berhasil ditambahkan',
    date: '17 Agustus 2024',
    time: '20:50 WIB',
  },
];

const TopUpIcon = ({ color = '#EBF8F9', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" stroke={color} strokeWidth="2" />
    <Path
      d="M12 7V17M7 12H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TransactionIcon = ({ color = '#EBF8F9', size = 24 }) => (
  <Svg width={size + 1} height={size} viewBox="0 0 21 20" fill="none">
    <Path
      d="M18.8332 1.66699L9.6665 10.8337M18.8332 1.66699L12.9998 18.3337L9.6665 10.8337M18.8332 1.66699L2.1665 7.50033L9.6665 10.8337"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DollarIcon = ({ color = '#2B6872', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function Wallet() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Balance</Text>
        <View style={{ width: 40 * SCALE }}>
          <Text style={{ opacity: 0 }}>Placeholder for alignment</Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles(theme).balanceCard}>
        <View style={styles(theme).cardContent}>
          <View style={styles(theme).balanceSection}>
            <Text style={styles(theme).balanceLabel}>Balance saya</Text>
            <Text style={styles(theme).balanceAmount}>12</Text>
          </View>
          <View style={styles(theme).actionsContainer}>
            <TouchableOpacity
              style={styles(theme).actionButton}
              onPress={() => navigation.navigate('TopUp')}
            >
              <View style={styles(theme).actionIcon}>
                <TopUpIcon size={24} />
              </View>
              <Text style={styles(theme).actionText}>Top up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(theme).actionButton}>
              <View style={styles(theme).actionIcon}>
                <TransactionIcon size={24} />
              </View>
              <Text style={styles(theme).actionText}>Transaksi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Activity Section */}
      <View style={styles(theme).activitySection}>
        <View style={styles(theme).activityHeader}>
          <Text style={styles(theme).activityTitle}>Aktivitas terbaru</Text>
          <TouchableOpacity>
            <Text style={styles(theme).seeAllText}>Lihat semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles(theme).activitiesList}>
          {ACTIVITIES.map((activity) => (
            <View key={activity.id} style={styles(theme).activityItem}>
              <View style={styles(theme).activityIconContainer}>
                {activity.type === 'purchase' && (
                  <DollarIcon size={24} color="#B3B3B3" />
                )}
                {activity.type === 'reward' && (
                  <Ionicons name="gift-outline" size={24} color="#B3B3B3" />
                )}
                {activity.type === 'usage' && (
                  <DollarIcon size={24} color="#B3B3B3" />
                )}
              </View>
              <View style={styles(theme).activityContent}>
                <Text style={styles(theme).activityItemTitle}>
                  {activity.title}
                </Text>
                <Text style={styles(theme).activityDescription}>
                  {activity.description}
                </Text>
                <View style={styles(theme).activityTimeContainer}>
                  <Text style={styles(theme).activityDate}>
                    {activity.date}
                  </Text>
                  <Text style={styles(theme).activityTime}>
                    – {activity.time}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
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
      justifyContent: 'space-between',
      paddingHorizontal: 16 * SCALE,
      height: 48 * SCALE,
    },
    backButton: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: '#000000',
      textAlign: 'center',
      flex: 1,
    },
    balanceCard: {
      backgroundColor: '#002A39',
      margin: 16 * SCALE,
      borderRadius: 8 * SCALE,
      paddingHorizontal: 25 * SCALE,
      paddingVertical: 25 * SCALE,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceSection: {
      flex: 1,
    },
    balanceLabel: {
      fontSize: 16 * SCALE,
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 4 * SCALE,
    },
    balanceAmount: {
      fontSize: 40 * SCALE,
      fontWeight: '700',
      color: '#FFFFFF',
      transform: [{ scaleY: 1.1 }],
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: 32 * SCALE,
    },
    actionButton: {
      alignItems: 'center',
      width: 56 * SCALE,
    },
    actionIcon: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      borderRadius: 999,
      backgroundColor: 'rgba(12, 12, 13, 0.20)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4 * SCALE,
    },
    actionText: {
      fontSize: 12 * SCALE,
      color: 'rgba(255, 255, 255, 0.70)',
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: 20 * SCALE,
      letterSpacing: 0.1,
    },
    activitySection: {
      marginTop: 32 * SCALE,
      paddingHorizontal: 16 * SCALE,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16 * SCALE,
    },
    activityTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    seeAllText: {
      fontSize: 12 * SCALE,
      color: '#2B6872',
      fontWeight: '500',
      lineHeight: 16 * SCALE,
      letterSpacing: 0.5,
    },
    activitiesList: {
      marginTop: 16 * SCALE,
      gap: 32 * SCALE,
    },
    activityItem: {
      flexDirection: 'row',
      gap: 16 * SCALE,
      alignItems: 'flex-start',
    },
    activityIconContainer: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      borderRadius: 20 * SCALE,
      backgroundColor: '#F4F4F5',
      borderWidth: 1,
      borderColor: '#D9D9D9',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20 * SCALE,
    },
    activityContent: {
      flex: 1,
      gap: 8 * SCALE,
    },
    activityItemTitle: {
      fontSize: 14 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    activityDescription: {
      fontSize: 12 * SCALE,
      color: '#6B7280',
      lineHeight: 16 * SCALE,
    },
    activityTimeContainer: {
      flexDirection: 'row',
      gap: 4 * SCALE,
    },
    activityDate: {
      fontSize: 12 * SCALE,
      color: '#9CA3AF',
    },
    activityTime: {
      fontSize: 12 * SCALE,
      color: '#9CA3AF',
    },
  });
