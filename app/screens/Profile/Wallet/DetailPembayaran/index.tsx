import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
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

export default function DetailPembayaran() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    amount,
    price,
    transactionId = 'GDjckadb001',
  } = route.params as {
    amount: number;
    price: string;
    transactionId?: string;
  };
  const [countdown, setCountdown] = useState('01:08:20');
  const [showWaiting, setShowWaiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock transaction ID
  const virtualAccount = '294792750445000001';

  useEffect(() => {
    // In a real app, implement actual countdown logic here
    // For now, we'll just show the static time
  }, []);

  const handleCopyVA = () => {
    Clipboard.setString(virtualAccount);
    // You might want to show a toast or some feedback here
  };

  const handleConfirm = () => {
    setShowWaiting(true);
    setTimeout(() => {
      setShowWaiting(false);
      setShowSuccess(true);
      // Show success screen for 2 seconds before navigating
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTab' }],
        });
      }, 10000);
    }, 3000);
  };

  if (showSuccess) {
    return (
      <View
        style={[styles(theme).waitingContainer, { paddingTop: insets.top }]}
      >
        <View style={styles(theme).waitingHeader}>
          <TouchableOpacity
            style={styles(theme).closeButton}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'BottomTab' }],
              });
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles(theme).waitingTitle}>Status Transaksi</Text>
        </View>
        <ScrollView
          style={styles(theme).scrollView}
          contentContainerStyle={styles(theme).scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(theme).waitingContent}>
            <LottieView
              source={require('@/assets/lotties/Success.json')}
              autoPlay
              loop={false}
              style={styles(theme).lottie}
            />
            <Text style={styles(theme).successTitle}>Pembayaran Berhasil</Text>
            <Text style={styles(theme).successDate}>
              Telah diselesaikan pada{'\n'}
              27 Desember 2024, 21:03 WIB
            </Text>

            <Text style={styles(theme).ringkasanTitle}>
              Ringkasan pembayaran
            </Text>

            <View style={styles(theme).ringkasanSection}>
              <View style={styles(theme).ringkasanRow}>
                <Text style={styles(theme).ringkasanLabel}>ID Transaksi</Text>
                <Text style={styles(theme).ringkasanValue}>
                  {transactionId}
                </Text>
              </View>
            </View>

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

            <View style={styles(theme).totalPaymentRow}>
              <Text style={styles(theme).totalPaymentLabel}>
                Total pembayaran
              </Text>
              <Text style={styles(theme).totalPaymentValue}>{price}</Text>
            </View>

            <View style={styles(theme).noteContainer}>
              <View style={styles(theme).noteIconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              <Text style={styles(theme).noteText}>
                Status transaksi diperbarui setiap 15 detik.{'\n'}
                Anda dapat menutup halaman ini dan{'\n'}
                memeriksa status di halaman transaksi.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (showWaiting) {
    return (
      <View
        style={[styles(theme).waitingContainer, { paddingTop: insets.top }]}
      >
        <View style={styles(theme).waitingHeader}>
          <Text style={styles(theme).waitingTitle}>Status Transaksi</Text>
        </View>
        <ScrollView
          style={styles(theme).scrollView}
          contentContainerStyle={styles(theme).scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(theme).waitingContent}>
            <LottieView
              source={require('@/assets/lotties/Waiting.json')}
              autoPlay
              loop
              style={styles(theme).lottie}
            />
            <Text style={styles(theme).waitingText}>Memeriksa pembayaran</Text>
            <Text style={styles(theme).waitingSubtext}>
              Selesaikan pembayaran sebelum
            </Text>
            <Text style={styles(theme).waitingDate}>
              27 Desember 2024, 23:59 WIB
            </Text>

            <Text style={styles(theme).ringkasanTitle}>
              Ringkasan pembayaran
            </Text>

            <View style={styles(theme).ringkasanSection}>
              <View style={styles(theme).ringkasanRow}>
                <Text style={styles(theme).ringkasanLabel}>ID Transaksi</Text>
                <Text style={styles(theme).ringkasanValue}>
                  {transactionId}
                </Text>
              </View>
            </View>

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

            <View style={styles(theme).totalPaymentRow}>
              <Text style={styles(theme).totalPaymentLabel}>
                Total pembayaran
              </Text>
              <Text style={styles(theme).totalPaymentValue}>{price}</Text>
            </View>

            <View style={styles(theme).noteContainer}>
              <View style={styles(theme).noteIconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              <Text style={styles(theme).noteText}>
                Status transaksi diperbarui setiap 15 detik.{'\n'}
                Anda dapat menutup halaman ini dan{'\n'}
                memeriksa status di halaman transaksi.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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
        <Text style={styles(theme).headerTitle}>Detail pembayaran</Text>
        <View style={{ width: 40 * SCALE }} />
      </View>

      {/* Content */}
      <View style={styles(theme).content}>
        {/* Transaction ID */}
        <View style={styles(theme).section}>
          <View style={styles(theme).transactionContainer}>
            <Text style={styles(theme).sectionLabel}>ID Transaksi</Text>
            <Text style={styles(theme).transactionId}>{transactionId}</Text>
          </View>
        </View>

        {/* Balance Plan Card */}
        <View style={styles(theme).planCard}>
          <Text style={styles(theme).planTitle}>Top-up Balance Plan</Text>
          <View style={styles(theme).planDetails}>
            <View style={styles(theme).balanceContainer}>
              <Text style={styles(theme).balanceAmount}>{amount}</Text>
              <Text style={styles(theme).balanceLabel}>Balance</Text>
            </View>
            <Text style={styles(theme).price}>{price}</Text>
          </View>
        </View>

        {/* Payment Deadline and Purpose Section */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).purposeTitle}>Tujuan pembayaran</Text>
          <View style={styles(theme).paymentDetailsBox}>
            {/* Payment Deadline */}
            <View style={styles(theme).deadlineSection}>
              <Text style={styles(theme).deadlineLabel}>
                Selesaikan pembayaran sebelum
              </Text>
              <View style={styles(theme).deadlineContainer}>
                <Text style={styles(theme).deadline}>
                  29 Desember 2024, 23:00 WIB
                </Text>
                <Text style={styles(theme).countdown}>{countdown}</Text>
              </View>
            </View>

            {/* Bank Info */}
            <View style={styles(theme).bankSection}>
              <View style={styles(theme).bankInfo}>
                <View style={styles(theme).bankNameContainer}>
                  <Image
                    source={require('@/assets/images/BCA-512.png')}
                    style={styles(theme).bankLogo}
                  />
                  <Text style={styles(theme).bankName}>Bank BCA</Text>
                </View>
                <Text style={styles(theme).accountType}>Virtual Account</Text>
              </View>
              <TouchableOpacity
                style={styles(theme).copyButton}
                onPress={handleCopyVA}
              >
                <Text style={styles(theme).vaNumber}>{virtualAccount}</Text>
                <Ionicons name="documents-outline" size={20} color="#757575" />
              </TouchableOpacity>
            </View>

            {/* Total Payment */}
            <View style={styles(theme).totalSection}>
              <Text style={styles(theme).totalLabel}>Total pembayaran</Text>
              <Text style={styles(theme).totalAmount}>{price}</Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles(theme).confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles(theme).confirmButtonText}>
            Konfirmasi pembayaran
          </Text>
        </TouchableOpacity>
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
      // paddingHorizontal: 16 * SCALE,
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
      paddingHorizontal: 16 * SCALE,
    },
    section: {
      marginBottom: 24 * SCALE,
    },
    transactionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionLabel: {
      fontSize: 14 * SCALE,
      fontWeight: '600',
      // color: theme.textSecondary,
    },
    transactionId: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
      fontWeight: '400',
    },
    planCard: {
      backgroundColor: '#F0FAFB',
      borderRadius: 12 * SCALE,
      padding: 16 * SCALE,
      marginBottom: 24 * SCALE,
    },
    planTitle: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      marginBottom: 8 * SCALE,
    },
    planDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8 * SCALE,
    },
    balanceAmount: {
      fontSize: 32 * SCALE,
      fontWeight: '600',
      color: '#2B6872',
    },
    balanceLabel: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
    },
    price: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#2B6872',
    },
    deadlineLabel: {
      fontSize: 15 * SCALE,
      color: theme.textSecondary,
      marginBottom: 7 * SCALE,
    },
    deadlineContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deadline: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      fontWeight: '700',
    },
    countdown: {
      fontSize: 14 * SCALE,
      color: '#C00F0C',
      fontWeight: '600',
    },
    purposeTitle: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginBottom: 16 * SCALE,
    },
    paymentDetailsBox: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12 * SCALE,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 24 * SCALE,
    },
    deadlineSection: {
      marginBottom: 24 * SCALE,
    },
    bankSection: {
      backgroundColor: '#FFFFFF',
      marginBottom: 24 * SCALE,
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
      alignSelf: 'center',
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
    totalSection: {
      paddingTop: 12 * SCALE,
      borderTopColor: '#E5E7EB',
    },
    totalLabel: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      marginBottom: 4 * SCALE,
    },
    totalAmount: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    confirmButton: {
      backgroundColor: '#2B6872',
      borderRadius: 8 * SCALE,
      paddingVertical: 16 * SCALE,
      position: 'absolute',
      bottom: 0,
      left: 16 * SCALE,
      right: 16 * SCALE,
      marginBottom: 40 * SCALE,
    },
    confirmButtonText: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    waitingContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    waitingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56 * SCALE,
      position: 'relative',
      marginBottom: 16 * SCALE,
    },
    closeButton: {
      position: 'absolute',
      left: 16 * SCALE,
      height: 40 * SCALE,
      width: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    waitingTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: theme.textPrimary,
      textAlign: 'center',
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    waitingContent: {
      alignItems: 'center',
      paddingHorizontal: 24 * SCALE,
      paddingBottom: 24 * SCALE,
    },
    lottie: {
      width: 201 * SCALE,
      height: 201 * SCALE,
      marginBottom: 24 * SCALE,
    },
    waitingText: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 5 * SCALE,
    },
    waitingSubtext: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      marginBottom: 20 * SCALE,
    },
    waitingDate: {
      fontSize: 14 * SCALE,
      color: theme.textPrimary,
      fontWeight: '700',
      marginBottom: 32 * SCALE,
    },
    ringkasanTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 20 * SCALE,
      alignSelf: 'flex-start',
    },
    ringkasanSection: {
      marginBottom: 10 * SCALE,
      width: '100%',
    },
    ringkasanRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ringkasanLabel: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
    },
    ringkasanValue: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    planSummaryCard: {
      backgroundColor: '#F0FAFB',
      borderRadius: 12 * SCALE,
      paddingHorizontal: 16 * SCALE,
      paddingVertical: 20 * SCALE,
      marginBottom: 24 * SCALE,
      width: '100%',
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
      marginBottom: 16 * SCALE,
      width: '100%',
    },
    totalPaymentLabel: {
      fontSize: 16 * SCALE,
      color: theme.textSecondary,
    },
    totalPaymentValue: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    noteContainer: {
      backgroundColor: '#F9FAFB',
      borderRadius: 12 * SCALE,
      padding: 16 * SCALE,
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    noteIconContainer: {
      marginRight: 12 * SCALE,
      marginTop: 2 * SCALE,
    },
    noteText: {
      fontSize: 14 * SCALE,
      color: `#5A5A5A`,
      lineHeight: 20 * SCALE,
    },
    successTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8 * SCALE,
    },
    successDate: {
      fontSize: 14 * SCALE,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 32 * SCALE,
    },
  });
