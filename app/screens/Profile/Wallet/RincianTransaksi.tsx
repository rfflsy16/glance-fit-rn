import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Clipboard,
  Dimensions,
  Image,
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

type RouteParams = {
  transactionId: string;
  amount: number;
  price: string;
  status: TransactionStatus;
  date: string;
  time: string;
};

export default function RincianTransaksi() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { transactionId, amount, price, status, date, time } =
    route.params as RouteParams;

  // Mock data - replace with API call later
  const virtualAccount = '294792750445000001';
  const countdown = '01:08:20';

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

  const getDateText = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return 'Selesaikan pembayaran sebelum';
      case 'success':
        return 'Pembayaran selesai pada tanggal';
      case 'failed':
        return 'Tagihan gagal dibayar pada tanggal';
      default:
        return '';
    }
  };

  const handleCopyVA = () => {
    Clipboard.setString(virtualAccount);
    // You might want to show a toast or some feedback here
  };

  const handleButtonPress = () => {
    if (status === 'pending') {
      navigation.navigate('DetailPembayaran', {
        amount,
        price,
        transactionId,
      });
    } else {
      navigation.navigate('TopUp');
    }
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
        <Text style={styles(theme).headerTitle}>Rincian transaksi</Text>
        <View style={{ width: 40 * SCALE }} />
      </View>

      {['success', 'failed'].includes(status) ? (
        <View style={styles(theme).successFailedContainer}>
          <ScrollView
            style={styles(theme).content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles(theme).mainContainer}>
              {/* Status Section */}
              <View style={styles(theme).section}>
                <View style={styles(theme).rowContainer}>
                  <Text style={styles(theme).sectionLabel}>Status</Text>
                  <Text
                    style={[
                      styles(theme).statusText,
                      { color: getStatusColor(status) },
                    ]}
                  >
                    {getStatusText(status)}
                  </Text>
                </View>
              </View>

              <View style={styles(theme).horizontalDivider} />

              {/* Tagihan Section */}
              <View style={styles(theme).section}>
                <Text
                  style={[
                    styles(theme).sectionLabel,
                    { fontSize: 16 * SCALE, color: 'black' },
                  ]}
                >
                  Tagihan
                </Text>
                <View style={styles(theme).tagihanContent}>
                  <View style={styles(theme).rowContainer}>
                    <Text style={styles(theme).tagihanLabel}>ID Transaksi</Text>
                    <Text style={styles(theme).tagihanValue}>
                      {transactionId}
                    </Text>
                  </View>
                  <View style={styles(theme).rowContainer}>
                    <Text style={styles(theme).tagihanLabel}>
                      Tanggal Tagihan
                    </Text>
                    <Text style={styles(theme).tagihanValue}>{date}</Text>
                  </View>
                  <View style={{ marginTop: 24 * SCALE }}>
                    <Text style={styles(theme).tagihanLabel}>
                      {getDateText(status)}
                    </Text>
                    <Text
                      style={[
                        styles(theme).tagihanValue,
                        { marginTop: 8 * SCALE },
                      ]}
                    >
                      <View style={styles(theme).dateTimeContainer}>
                        <Text style={styles(theme).tagihanValue}>
                          {date}, {`${time} WIB`}
                        </Text>
                      </View>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles(theme).horizontalDivider} />

              {/* Ringkasan pembayaran Section */}
              <View style={[styles(theme).section, styles(theme).lastSection]}>
                <Text
                  style={[
                    styles(theme).sectionLabel,
                    {
                      marginVertical: 16 * SCALE,
                      color: 'black',
                      fontWeight: '500',
                    },
                  ]}
                >
                  Ringkasan pembayaran
                </Text>
                <View style={styles(theme).planSummaryCard}>
                  <Text style={styles(theme).planSummaryTitle}>
                    Top-up Balance Plan
                  </Text>
                  <View style={styles(theme).planSummaryContent}>
                    <View style={styles(theme).balanceInfo}>
                      <Text style={styles(theme).balanceNumber}>{amount}</Text>
                      <Text style={styles(theme).balanceText}>Balance</Text>
                    </View>
                    <Text style={styles(theme).planPrice}>{price}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Button for success/failed status */}
            <TouchableOpacity
              style={styles(theme).button}
              onPress={handleButtonPress}
            >
              <Text style={styles(theme).buttonText}>Pesan Lagi</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <View style={styles(theme).pendingContainer}>
          <ScrollView
            style={styles(theme).content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles(theme).mainContainer}>
              {/* Status Section */}
              <View style={styles(theme).section}>
                <View style={styles(theme).rowContainer}>
                  <Text style={styles(theme).sectionLabel}>Status</Text>
                  <Text
                    style={[
                      styles(theme).statusText,
                      { color: getStatusColor(status) },
                    ]}
                  >
                    {getStatusText(status)}
                  </Text>
                </View>
              </View>

              <View style={styles(theme).horizontalDivider} />

              {/* Tagihan Section */}
              <View style={styles(theme).section}>
                <Text
                  style={[
                    styles(theme).sectionLabel,
                    { fontSize: 16 * SCALE, color: 'black' },
                  ]}
                >
                  Tagihan
                </Text>
                <View style={styles(theme).tagihanContent}>
                  <View style={styles(theme).rowContainer}>
                    <Text style={styles(theme).tagihanLabel}>ID Transaksi</Text>
                    <Text style={styles(theme).tagihanValue}>
                      {transactionId}
                    </Text>
                  </View>
                  <View style={styles(theme).rowContainer}>
                    <Text style={styles(theme).tagihanLabel}>
                      Tanggal Tagihan
                    </Text>
                    <Text style={styles(theme).tagihanValue}>{date}</Text>
                  </View>
                  <View style={{ marginTop: 24 * SCALE }}>
                    <Text style={styles(theme).tagihanLabel}>
                      {getDateText(status)}
                    </Text>
                    <Text
                      style={[
                        styles(theme).tagihanValue,
                        { marginTop: 8 * SCALE },
                      ]}
                    >
                      <View style={styles(theme).dateTimeContainer}>
                        <Text style={styles(theme).tagihanValue}>
                          {date}, {`${time} WIB`}
                        </Text>
                        {status === 'pending' && (
                          <Text style={styles(theme).countdown}>
                            {countdown}
                          </Text>
                        )}
                      </View>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles(theme).horizontalDivider} />

              {/* Ringkasan pembayaran Section */}
              <View style={[styles(theme).section, styles(theme).lastSection]}>
                <Text
                  style={[
                    styles(theme).sectionLabel,
                    {
                      marginVertical: 16 * SCALE,
                      color: 'black',
                      fontWeight: '500',
                    },
                  ]}
                >
                  Ringkasan pembayaran
                </Text>
                <View style={styles(theme).planSummaryCard}>
                  <Text style={styles(theme).planSummaryTitle}>
                    Top-up Balance Plan
                  </Text>
                  <View style={styles(theme).planSummaryContent}>
                    <View style={styles(theme).balanceInfo}>
                      <Text style={styles(theme).balanceNumber}>{amount}</Text>
                      <Text style={styles(theme).balanceText}>Balance</Text>
                    </View>
                    <Text style={styles(theme).planPrice}>{price}</Text>
                  </View>
                </View>
              </View>

              {/* Payment Method - Only show for pending status */}
              {status === 'pending' && (
                <View
                  style={[styles(theme).section, styles(theme).lastSection]}
                >
                  <Text
                    style={[
                      styles(theme).sectionLabel,
                      { marginBottom: 16 * SCALE },
                    ]}
                  >
                    Tujuan pembayaran
                  </Text>
                  <View style={styles(theme).bankSection}>
                    <View style={styles(theme).bankInfo}>
                      <View style={styles(theme).bankNameContainer}>
                        <Image
                          source={require('@/assets/images/BCA-512.png')}
                          style={styles(theme).bankLogo}
                        />
                        <Text style={styles(theme).bankName}>Bank BCA</Text>
                      </View>
                      <Text style={styles(theme).accountType}>
                        Virtual Account
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles(theme).copyButton}
                      onPress={handleCopyVA}
                    >
                      <Text style={styles(theme).vaNumber}>
                        {virtualAccount}
                      </Text>
                      <Ionicons
                        name="documents-outline"
                        size={20}
                        color="#757575"
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles(theme).totalPaymentRow,
                      { marginTop: 20 * SCALE },
                    ]}
                  >
                    <Text style={styles(theme).totalPaymentLabel}>
                      Total pembayaran
                    </Text>
                    <Text style={styles(theme).totalPaymentValue}>{price}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Button for pending status */}
            <TouchableOpacity
              style={styles(theme).button}
              onPress={handleButtonPress}
            >
              <Text style={styles(theme).buttonText}>
                Selesaikan Pembayaran
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
      justifyContent: 'space-between',
      height: 48 * SCALE,
      marginBottom: 16 * SCALE,
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
      color: theme.textPrimary,
      textAlign: 'center',
      flex: 1,
    },
    content: {
      flex: 1,
    },
    mainContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12 * SCALE,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      marginBottom: 24 * SCALE,
    },
    section: {
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 20 * SCALE,
    },
    lastSection: {
      paddingBottom: 16 * SCALE,
      paddingTop: 0,
    },
    horizontalDivider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginHorizontal: 16 * SCALE,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 24 * SCALE,
    },
    tagihanContent: {
      marginTop: 16 * SCALE,
    },
    sectionLabel: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
      lineHeight: 20 * SCALE,
    },
    statusText: {
      fontSize: 14 * SCALE,
      fontWeight: '500',
      lineHeight: 20 * SCALE,
    },
    tagihanLabel: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
    },
    tagihanValue: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      fontWeight: '700',
    },
    countdown: {
      color: '#C00F0C',
    },
    planSummaryCard: {
      backgroundColor: '#F0FAFB',
      borderRadius: 12 * SCALE,
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 20 * SCALE,
      marginBottom: 16 * SCALE,
    },
    planSummaryTitle: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
      marginBottom: 12 * SCALE,
    },
    planSummaryContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8 * SCALE,
    },
    balanceNumber: {
      fontSize: 32 * SCALE,
      fontWeight: '600',
      color: '#2B6872',
    },
    balanceText: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
    },
    planPrice: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#2B6872',
    },
    totalPaymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalPaymentLabel: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      paddingVertical: 12 * SCALE,
    },
    totalPaymentValue: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    bankSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12 * SCALE,
      // padding: 16 * SCALE,
    },
    bankInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12 * SCALE,
    },
    bankNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8 * SCALE,
    },
    bankLogo: {
      width: 32 * SCALE,
      height: 32 * SCALE,
      borderRadius: 10 * SCALE,
    },
    bankName: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    accountType: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
    },
    copyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderRadius: 8 * SCALE,
      padding: 12 * SCALE,
      borderWidth: 1,
      borderColor: '#757575',
    },
    vaNumber: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    button: {
      width: '100%',
      backgroundColor: '#2B6872',
      borderRadius: 8 * SCALE,
      paddingVertical: 16 * SCALE,
      marginBottom: 40 * SCALE,
    },
    buttonText: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    dateTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    successFailedContainer: {
      flex: 1,
      paddingHorizontal: 16 * SCALE,
    },
    buttonContainer: {
      paddingBottom: 40 * SCALE,
    },
    pendingContainer: {
      flex: 1,
      paddingHorizontal: 16 * SCALE,
    },
  });
