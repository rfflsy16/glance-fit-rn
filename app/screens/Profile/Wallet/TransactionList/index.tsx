import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
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

type TransactionStatus = 'pending' | 'success' | 'failed';

type Transaction = {
  id: string;
  type: 'top-up';
  title: string;
  amount: number;
  price: string;
  status: TransactionStatus;
  date: string;
  time: string;
};

type GroupedTransactions = {
  [date: string]: Transaction[];
};

// Mock data - replace with API call later
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'GDjckadb001',
    type: 'top-up',
    title: 'Top-up Balance Plan',
    amount: 365,
    price: 'Rp535,000,00',
    status: 'pending',
    date: '27 Desember 2024',
    time: '15:30',
  },
  {
    id: 'GDjckadb002',
    type: 'top-up',
    title: 'Top-up Balance Plan',
    amount: 365,
    price: 'Rp535,000,00',
    status: 'failed',
    date: '25 Desember 2024',
    time: '09:45',
  },
  {
    id: 'GDjckadb003',
    type: 'top-up',
    title: 'Top-up Balance Plan',
    amount: 30,
    price: 'Rp70,000,00',
    status: 'success',
    date: '24 November 2024',
    time: '13:20',
  },
  {
    id: 'GDjckadb004',
    type: 'top-up',
    title: 'Top-up Balance Plan',
    amount: 136,
    price: 'Rp200,000,00',
    status: 'success',
    date: '10 Juli 2024',
    time: '11:15',
  },
  {
    id: 'GDjckadb005',
    type: 'top-up',
    title: 'Top-up Balance Plan',
    amount: 365,
    price: 'Rp535,000,00',
    status: 'failed',
    date: '28 Juni 2024',
    time: '16:50',
  },
];

const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'pending', label: 'Menunggu pembayaran' },
  { id: 'success', label: 'Dibayar' },
  { id: 'failed', label: 'Gagal' },
];

export default function TransactionList() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'success':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      default:
        return theme.textPrimary;
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return 'Menunggu pembayaran';
      case 'success':
        return 'Dibayar';
      case 'failed':
        return 'Gagal';
      default:
        return '';
    }
  };

  const filteredTransactions = MOCK_TRANSACTIONS.filter((transaction) => {
    if (activeTab === 'all') return true;
    return transaction.status === activeTab;
  });

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('PaymentStack', {
      screen: 'RincianTransaksi',
      params: {
        transactionId: transaction.id,
        amount: transaction.amount,
        price: transaction.price,
        status: transaction.status,
        date: transaction.date,
        time: transaction.time,
      },
    });
  };

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Transaksi saya</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles(theme).tabsContainer}
        contentContainerStyle={styles(theme).tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles(theme).tab,
              activeTab === tab.id && styles(theme).activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles(theme).tabText,
                activeTab === tab.id && styles(theme).activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transaction List */}
      <ScrollView
        style={styles(theme).transactionList}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles(theme).transactionItem}
            onPress={() => handleTransactionPress(transaction)}
          >
            <View style={styles(theme).transactionContent}>
              <View style={styles(theme).dateStatusContainer}>
                <Text style={styles(theme).transactionDate}>
                  {transaction.date}
                </Text>
                <Text
                  style={[
                    styles(theme).transactionStatus,
                    { color: getStatusColor(transaction.status) },
                  ]}
                >
                  {getStatusText(transaction.status)}
                </Text>
              </View>
              <View style={styles(theme).transactionHeader}>
                <View>
                  <Text style={styles(theme).transactionTitle}>
                    {transaction.title}
                  </Text>
                  <Text style={styles(theme).totalPaymentLabel}>
                    Total pembayaran
                  </Text>
                </View>
                <View style={styles(theme).rightContent}>
                  <Text style={styles(theme).balanceAmount}>
                    {transaction.amount} Balance
                  </Text>
                  <View style={{ height: 12 * SCALE }} />
                  <Text style={styles(theme).transactionPrice}>
                    {transaction.price}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      height: 48 * SCALE,
      marginBottom: 16 * SCALE,
    },
    backButton: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      zIndex: 1,
    },
    headerTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: theme.textPrimary,
      textAlign: 'center',
      flex: 1,
    },
    tabsContainer: {
      maxHeight: 36 * SCALE,
      marginBottom: 24 * SCALE,
      width: '100%',
      // alignSelf: 'center',
      paddingHorizontal: 16 * SCALE,
    },
    tabsContent: {
      // paddingHorizontal: 16 * SCALE,
      // width: '100%',
      gap: 8 * SCALE,
    },
    tab: {
      paddingHorizontal: 2 * SCALE,
      paddingVertical: 8 * SCALE,
      borderRadius: 0,
      backgroundColor: 'transparent',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#2B6872',
    },
    tabText: {
      fontSize: 14 * SCALE,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    activeTabText: {
      color: '#2B6872',
    },
    transactionList: {
      flex: 1,
      paddingHorizontal: 16 * SCALE,
    },
    transactionItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12 * SCALE,
      marginBottom: 16 * SCALE,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    transactionContent: {
      padding: 16 * SCALE,
    },
    dateStatusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16 * SCALE,
    },
    transactionDate: {
      fontSize: 12 * SCALE,
      // color: theme.textSecondary,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8 * SCALE,
    },
    transactionTitle: {
      fontSize: 14 * SCALE,
      color: '#9CA3AF',
      marginBottom: 12 * SCALE,
    },
    totalPaymentLabel: {
      fontSize: 14 * SCALE,
      color: '#9CA3AF',
    },
    rightContent: {
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    balanceAmount: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    transactionPrice: {
      fontSize: 14 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    transactionStatus: {
      fontSize: 12 * SCALE,
      fontWeight: '500',
    },
  });
