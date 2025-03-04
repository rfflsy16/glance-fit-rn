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

type PlanOption = {
  id: string;
  amount: number;
  price: string;
  isRecommended?: boolean;
};

export default function TopUp() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const planOptions: PlanOption[] = [
    { id: '1', amount: 365, price: 'Rp535.000.00', isRecommended: true },
    { id: '2', amount: 136, price: 'Rp200.000.00' },
    { id: '3', amount: 30, price: 'Rp75.000.00' },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string>(
    planOptions.find((plan) => plan.isRecommended)?.id || '1'
  );

  return (
    <View style={[styles(theme).container, { paddingTop: insets.top }]}>
      {/* Header */}
      <TouchableOpacity
        style={styles(theme).backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={24} color="#374151" />
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        style={styles(theme).scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(theme).content}>
          <Text style={styles(theme).title}>Glance fit eksklusif plan</Text>
          <Text style={styles(theme).subtitle}>
            Top-up Glance Fit Balance untuk membuka fitur eksklusif dan
            maksimalkan target kesehatanmu.
          </Text>

          {/* Benefits */}
          <View style={styles(theme).benefitsContainer}>
            <View style={styles(theme).benefitRow}>
              <Ionicons name="checkmark" size={20} color="#2B6872" />
              <Text style={styles(theme).benefitText}>
                Program kesehatan terpersonalisasi
              </Text>
            </View>
            <View style={styles(theme).benefitRow}>
              <Ionicons name="checkmark" size={20} color="#2B6872" />
              <Text style={styles(theme).benefitText}>
                Kumpulkan poin setiap hari
              </Text>
            </View>
            <View style={styles(theme).benefitRow}>
              <Ionicons name="checkmark" size={20} color="#2B6872" />
              <Text style={styles(theme).benefitText}>
                Voucher dan rewards menarik
              </Text>
            </View>
            <View style={styles(theme).benefitRow}>
              <Ionicons name="checkmark" size={20} color="#2B6872" />
              <Text style={styles(theme).benefitText}>
                dan masih banyak lagi
              </Text>
            </View>
          </View>

          {/* Plan Selection */}
          <Text style={styles(theme).sectionTitle}>Pilih Balance Plan</Text>

          <View style={styles(theme).planContainer}>
            {planOptions.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles(theme).planCard,
                  selectedPlan === plan.id && styles(theme).selectedCard,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <View style={styles(theme).cardHeader}>
                  {plan.isRecommended ? (
                    <View style={styles(theme).recommendedBadge}>
                      <Text style={styles(theme).recommendedText}>
                        Direkomenadiskan
                      </Text>
                    </View>
                  ) : (
                    <View style={styles(theme).recommendedBadgePlaceholder} />
                  )}
                  <View style={styles(theme).radioContainer}>
                    <View
                      style={[
                        styles(theme).radioOuter,
                        selectedPlan === plan.id &&
                          styles(theme).radioOuterSelected,
                      ]}
                    >
                      {selectedPlan === plan.id && (
                        <View style={styles(theme).radioInner} />
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles(theme).planContent}>
                  <View style={styles(theme).planLeft}>
                    <Text style={styles(theme).planAmount}>{plan.amount}</Text>
                    <Text style={styles(theme).planLabel}>Balance</Text>
                  </View>
                  <Text style={styles(theme).planPrice}>{plan.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles(theme).disclaimer}>
            1 balance bisa digunakan untuk 1 hari penggunaan semua fitur
            eksklusif tanpa batas.
          </Text>

          <TouchableOpacity
            style={styles(theme).button}
            onPress={() => {
              const selectedPlanData = planOptions.find(
                (plan) => plan.id === selectedPlan
              );
              if (selectedPlanData) {
                navigation.navigate('Pembayaran', {
                  amount: selectedPlanData.amount,
                  price: selectedPlanData.price,
                });
              }
            }}
          >
            <Text style={styles(theme).buttonText}>
              Lanjutkan ke pembayaran
            </Text>
          </TouchableOpacity>
        </View>
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
    scrollView: {
      flex: 1,
    },
    backButton: {
      width: 40 * SCALE,
      height: 40 * SCALE,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16 * SCALE,
    },
    content: {
      paddingHorizontal: 24 * SCALE,
      paddingTop: 24 * SCALE,
      paddingBottom: 24 * SCALE,
    },
    title: {
      fontSize: 24 * SCALE,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 12 * SCALE,
    },
    subtitle: {
      fontSize: 16 * SCALE,
      color: '#6B7280',
      lineHeight: 24 * SCALE,
      marginBottom: 32 * SCALE,
    },
    benefitsContainer: {
      gap: 16 * SCALE,
      marginBottom: 40 * SCALE,
    },
    benefitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12 * SCALE,
    },
    benefitText: {
      fontSize: 14 * SCALE,
      color: '#374151',
      lineHeight: 24 * SCALE,
    },
    sectionTitle: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 24 * SCALE,
    },
    planContainer: {
      gap: 16 * SCALE,
      marginBottom: 24 * SCALE,
    },
    planCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16 * SCALE,
      padding: 24 * SCALE,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      minHeight: 120 * SCALE,
    },
    planContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8 * SCALE,
    },
    planAmount: {
      fontSize: 32 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    planLabel: {
      fontSize: 16 * SCALE,
      color: '#6B7280',
      marginLeft: 8 * SCALE,
    },
    planPrice: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#000000',
    },
    disclaimer: {
      fontSize: 14 * SCALE,
      color: '#6B7280',
      textAlign: 'center',
      marginVertical: 32 * SCALE,
      lineHeight: 20 * SCALE,
    },
    button: {
      backgroundColor: '#2B6872',
      borderRadius: 8 * SCALE,
      paddingVertical: 16 * SCALE,
      marginBottom: 24 * SCALE,
    },
    buttonText: {
      fontSize: 16 * SCALE,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    selectedCard: {
      backgroundColor: '#F0FAFB',
      borderColor: '#2B6872',
      borderWidth: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16 * SCALE,
    },
    radioContainer: {
      alignSelf: 'flex-start',
    },
    radioOuter: {
      width: 20 * SCALE,
      height: 20 * SCALE,
      borderRadius: 10 * SCALE,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterSelected: {
      borderColor: '#2B6872',
    },
    radioInner: {
      width: 10 * SCALE,
      height: 10 * SCALE,
      borderRadius: 5 * SCALE,
      backgroundColor: '#2B6872',
    },
    recommendedBadge: {
      backgroundColor: '#ABE4E8',
      paddingHorizontal: 12 * SCALE,
      paddingVertical: 6 * SCALE,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    recommendedBadgePlaceholder: {
      height: 28 * SCALE,
    },
    recommendedText: {
      fontSize: 12 * SCALE,
      color: '#1F7379',
      fontWeight: '500',
    },
  });
