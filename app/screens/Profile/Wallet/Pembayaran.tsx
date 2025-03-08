import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

type PaymentMethod = {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
};

const WalletIcon = () => (
  <View style={styles().iconContainer}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 10H23"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

const BankIcon = () => (
  <View style={styles().iconContainer}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10V17M8 10V17M12 10V17M16 10V17M20 10V17M3 21H21M3 7H21M4 3H20L22 7H2L4 3Z"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

const CryptoIcon = () => (
  <View style={styles().iconContainer}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 17L12 22L22 17"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12L12 17L22 12"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

export default function Pembayaran() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { amount, price } = route.params as { amount: number; price: string };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'ewallet',
      title: 'E-wallet',
      icon: <WalletIcon />,
    },
    {
      id: 'bank',
      title: 'Virtual Account (Bank)',
      icon: <BankIcon />,
    },
    {
      id: 'crypto',
      title: 'SPARC Token Crypto',
      icon: <CryptoIcon />,
      subtitle: '+10 Balance',
    },
  ];

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
        <Text style={styles(theme).headerTitle}>Pembayaran</Text>
        <View style={{ width: 40 * SCALE }} />
      </View>

      {/* Content */}
      <View style={styles(theme).content}>
        {/* Selected Plan */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionHeader}>
            <Text style={styles(theme).sectionTitle}>Balance plan saya</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles(theme).changeButton}>Ubah plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles(theme).planCard}>
            <View style={styles(theme).planInfo}>
              <Text style={styles(theme).balanceAmount}>{amount}</Text>
              <Text style={styles(theme).balanceLabel}>Balance</Text>
            </View>
            <Text style={styles(theme).price}>{price}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles(theme).section}>
          <View style={styles(theme).methodsList}>
            <Text style={styles(theme).methodsTitle}>Metode pembayaran</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles(theme).methodItem}
              >
                {method.icon}
                <View style={styles(theme).methodInfo}>
                  <Text style={styles(theme).methodTitle}>{method.title}</Text>
                  {method.subtitle && (
                    <Text style={styles(theme).methodSubtitle}>
                      {method.subtitle}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="#9CA3AF"
                  style={styles(theme).methodArrow}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles(theme).totalSection}>
          <Text style={styles(theme).totalLabel}>Total tagihan</Text>
          <Text style={styles(theme).totalAmount}>{price}</Text>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={styles(theme).paymentButton}
          onPress={() =>
            navigation.navigate('DetailPembayaran', { amount, price })
          }
        >
          <Text style={styles(theme).paymentButtonText}>
            Lakukan pembayaran
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (theme?: Theme) =>
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
      marginBottom: 16 * SCALE,
    },
    backButton: {
      width: 40 * SCALE,
      // height: 40 * SCALE,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '500',
      color: '#000000',
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16 * SCALE,
    },
    sectionTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    changeButton: {
      fontSize: 14 * SCALE,
      color: '#2B6872',
      fontWeight: '500',
    },
    planCard: {
      backgroundColor: '#F0FAFB',
      borderRadius: 8 * SCALE,
      padding: 24 * SCALE,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planInfo: {
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
      color: '#000000',
    },
    price: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#2B6872',
    },
    methodsList: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8 * SCALE,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    methodsTitle: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
      padding: 16 * SCALE,
    },
    methodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16 * SCALE,
    },
    methodInfo: {
      flex: 1,
      marginLeft: 16 * SCALE,
    },
    methodTitle: {
      fontSize: 14 * SCALE,
      fontWeight: '500',
      color: '#000000',
    },
    methodSubtitle: {
      fontSize: 12 * SCALE,
      color: '#6B7280',
      marginTop: 4 * SCALE,
    },
    methodArrow: {
      marginLeft: 8 * SCALE,
    },
    iconContainer: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      backgroundColor: '#F3F4F6',
      borderRadius: 20 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      marginBottom: 32 * SCALE,
    },
    totalLabel: {
      fontSize: 14 * SCALE,
      color: '#000000',
    },
    totalAmount: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    paymentButton: {
      backgroundColor: '#2B6872',
      borderRadius: 8 * SCALE,
      paddingVertical: 16 * SCALE,
      marginBottom: 40 * SCALE,
    },
    paymentButtonText: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
