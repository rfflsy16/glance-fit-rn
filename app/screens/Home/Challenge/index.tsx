import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
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

// Dummy participant data
const participants = [
  {
    id: 1,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 2,
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    id: 3,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 4,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  // Additional participants that won't be shown directly
  {
    id: 5,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 6,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 7,
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    id: 8,
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
  {
    id: 9,
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
  },
  {
    id: 10,
    avatar: 'https://randomuser.me/api/portraits/men/61.jpg',
  },
];

export default function ChallengeDetail() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pageBlurred, setPageBlurred] = useState(false);
  const [showFullScreenSuccess, setShowFullScreenSuccess] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false); // For testing purposes

  // Number of avatars to display directly
  const maxVisibleAvatars = 4;
  const remainingParticipants = participants.length - maxVisibleAvatars;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleJoinChallenge = () => {
    setShowConfirmModal(true);
  };

  const confirmJoinChallenge = () => {
    setShowConfirmModal(false);
    setPageBlurred(true);
    setShowFullScreenSuccess(true);

    setTimeout(() => {
      setShowFullScreenSuccess(false);
      setPageBlurred(false);
      setHasJoined(true);
    }, 1000);
  };

  const handleLeaveChallenge = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveChallenge = () => {
    setShowLeaveModal(false);
    setHasJoined(false);
  };

  const dismissFullScreenSuccess = () => {
    setShowFullScreenSuccess(false);
    setPageBlurred(false);
  };

  return (
    <View style={[styles(theme, isDark).container, { paddingTop: insets.top }]}>
      {/* Full Screen Success Message */}
      {showFullScreenSuccess && (
        <View
          style={[
            styles(theme, isDark).fullScreenSuccessContainer,
            { top: insets.top + 16 },
          ]}
        >
          <View style={styles(theme, isDark).fullScreenSuccessContent}>
            <Text style={styles(theme, isDark).fullScreenSuccessText}>
              Berhasil bergabung kedalam Program
            </Text>
          </View>
        </View>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <View style={styles(theme, isDark).modalOverlay}>
          <View style={styles(theme, isDark).modalContainer}>
            <TouchableOpacity
              style={styles(theme, isDark).closeButton}
              onPress={() => setShowConfirmModal(false)}
            >
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>

            <View style={styles(theme, isDark).modalContentContainer}>
              <Text style={styles(theme, isDark).modalTitle}>
                2 Balance akan terpotong untuk mengikuti tantangan ini
              </Text>

              <TouchableOpacity
                style={styles(theme, isDark).continueButton}
                onPress={confirmJoinChallenge}
              >
                <Text style={styles(theme, isDark).continueButtonText}>
                  Lanjutkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Leave Challenge Modal */}
      {showLeaveModal && (
        <View style={styles(theme, isDark).modalOverlay}>
          <View style={styles(theme, isDark).leaveModalContainer}>
            <View style={styles(theme, isDark).modalContentContainer}>
              <Text style={styles(theme, isDark).leaveModalTitle}>
                Yakin ingin meninggalkan?
              </Text>
              <Text style={styles(theme, isDark).leaveModalSubtitle}>
                2 Balance yang terpotong tidak dapat dikembalikan
              </Text>
              <View style={styles(theme, isDark).modalButtonsContainer}>
                <TouchableOpacity
                  style={styles(theme, isDark).cancelButton}
                  onPress={() => setShowLeaveModal(false)}
                >
                  <Text style={styles(theme, isDark).cancelButtonText}>
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles(theme, isDark).leaveButton}
                  onPress={confirmLeaveChallenge}
                >
                  <Text style={styles(theme, isDark).leaveButtonText}>
                    Tinggalkan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Page Blur Overlay */}
      {pageBlurred && (
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'dark'}
          style={styles(theme, isDark).blurOverlay}
        />
      )}

      {/* Header */}
      <View style={styles(theme, isDark).header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles(theme, isDark).backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles(theme, isDark).headerTitle}>Tantangan</Text>
        {hasJoined && (
          <TouchableOpacity
            style={styles(theme, isDark).menuButton}
            onPress={handleLeaveChallenge}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles(theme, isDark).scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Challenge Image */}
        <View style={styles(theme, isDark).imageContainer}>
          <Image
            source={require('@/assets/images/runner-dark.jpg')}
            style={styles(theme, isDark).challengeImage}
            resizeMode="cover"
          />

          {/* Challenge Badge */}
          <View style={styles(theme, isDark).badgeContainer}>
            <BlurView
              intensity={20}
              tint="light"
              style={styles(theme, isDark).badgeBlur}
            >
              <Text style={styles(theme, isDark).badgeText}>Pemula</Text>
            </BlurView>
          </View>

          {/* Challenge Icon */}
          <Image
            source={require('@/assets/images/challenge.png')}
            style={styles(theme, isDark).challengeIcon}
          />
        </View>

        {/* Challenge Content */}
        <View style={styles(theme, isDark).contentWrapper}>
          <View style={styles(theme, isDark).contentCard}>
            <Text style={styles(theme, isDark).title}>
              Jalan kaki pagi hari 30 menit
            </Text>
            <Text style={styles(theme, isDark).date}>
              Berakhir 17 Agustus 2024
            </Text>

            <View style={styles(theme, isDark).pointsContainer}>
              <Image
                source={require('@/assets/images/coin-v2.png')}
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles(theme, isDark).points}>200 Points</Text>
            </View>

            {hasJoined ? (
              <>
                {/* Commented start time for when user has joined */}
                <View style={styles(theme, isDark).joinedTimeWrapper}>
                  <Text style={styles(theme, isDark).startTime}>
                    Berakhir dalam
                  </Text>
                  <Text style={styles(theme, isDark).startTimeNumbers}>
                    21:24:04
                  </Text>
                </View>
                {/* <View style={styles(theme, isDark).progressContainer}>
                  <Text style={styles(theme, isDark).progressText}>
                    Progress anda
                  </Text>
                  <View style={styles(theme, isDark).progressBarContainer}>
                    <View style={styles(theme, isDark).progressBarCompleted} />
                    <View style={styles(theme, isDark).progressBarRemaining} />
                  </View>
                  <Text style={styles(theme, isDark).progressValue}>
                    10 menit dari 60 menit
                  </Text> */}
                {/* <View style={styles(theme, isDark).progressBarContainer}>
                        <View style={styles(theme, isDark).progressBarFullyCompleted} />
                      </View>
                      <Text style={styles(theme, isDark).progressValue}>
                        Selesai
                      </Text> */}
                {/* </View> */}
              </>
            ) : null}

            {!hasJoined && (
              <View style={styles(theme, isDark).checklistContainer}>
                <View style={styles(theme, isDark).checklistItem}>
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                  <Text style={styles(theme, isDark).checklistText}>
                    Tantangan jalan kaki
                  </Text>
                </View>
                <View style={styles(theme, isDark).checklistItem}>
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                  <Text style={styles(theme, isDark).checklistText}>
                    30 menit / hari setiap pagi
                  </Text>
                </View>
                <View style={styles(theme, isDark).checklistItem}>
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                  <Text style={styles(theme, isDark).checklistText}>
                    Selama 2 hari 16-17 Agustus 2024
                  </Text>
                </View>
              </View>
            )}

            <View style={styles(theme, isDark).section}>
              <Text style={styles(theme, isDark).sectionTitle}>Deskripsi</Text>
              <Text style={styles(theme, isDark).description}>
                Berjalan kaki 30 menit setiap pagi memberikan manfaat bagi
                kesehatan jantung dan mood, serta membantu mengontrol berat
                badan. Aktivitas ini juga memperbaiki kualitas tidur dan
                kesehatan mental.
              </Text>
            </View>

            <View style={styles(theme, isDark).section}>
              <Text style={styles(theme, isDark).sectionTitle}>
                Detail Tantangan
              </Text>
              <Text style={styles(theme, isDark).description}>
                Dorong diri Anda untuk memulai kebiasaan sehat, tantangan ini
                dimulai pada pukul 05.00 16 Agustus dan berakhir pukul 15.30 17
                Agustus.
              </Text>
              <Text style={styles(theme, isDark).description}>
                Selama 2 hari anda cukup jalan kaki luar ruangan selama 30 menit
                per hari. Anda dapat melakukan aktivitas ini di rentang jam
                05.30 - 09.30 pagi.
              </Text>
            </View>

            {!hasJoined && (
              <View style={styles(theme, isDark).section}>
                <Text style={styles(theme, isDark).sectionTitle}>
                  Partisipan
                </Text>
                <View style={styles(theme, isDark).participantsContainer}>
                  <View style={styles(theme, isDark).avatars}>
                    {participants
                      .slice(0, maxVisibleAvatars)
                      .map((participant, index) => (
                        <View
                          key={participant.id}
                          style={[
                            styles(theme, isDark).avatarContainer,
                            {
                              zIndex: maxVisibleAvatars - index,
                              marginLeft: index > 0 ? -12 : 0,
                            },
                          ]}
                        >
                          <Image
                            source={{ uri: participant.avatar }}
                            style={styles(theme, isDark).avatar}
                          />
                        </View>
                      ))}
                    {remainingParticipants > 0 && (
                      <View
                        style={[
                          styles(theme, isDark).avatarContainer,
                          styles(theme, isDark).remainingAvatars,
                          { marginLeft: -12 },
                        ]}
                      >
                        <Text
                          style={styles(theme, isDark).remainingAvatarsText}
                        >
                          +{remainingParticipants}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles(theme, isDark).timeWrapper}>
                    <Text style={styles(theme, isDark).startTime}>
                      Dimulai dalam
                    </Text>
                    <Text style={styles(theme, isDark).startTimeNumbers}>
                      21:24:04
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Join Button */}
      {!hasJoined && (
        <View style={styles(theme, isDark).joinButtonContainer}>
          <TouchableOpacity
            style={styles(theme, isDark).joinButton}
            onPress={handleJoinChallenge}
          >
            <Text style={styles(theme, isDark).joinButtonText}>
              Ikuti tantangan
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.surfaceLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10 * SCALE,
      backgroundColor: theme.background,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 28,
      color: theme.textPrimary,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 200 * SCALE,
    },
    challengeImage: {
      width: '100%',
      height: '100%',
    },
    badgeContainer: {
      position: 'absolute',
      top: 16 * SCALE,
      right: 16 * SCALE,
      zIndex: 10,
      overflow: 'hidden',
      borderRadius: 999,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.40)',
    },
    badgeBlur: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
      overflow: 'hidden',
      borderRadius: 999,
    },
    badgeText: {
      color: '#F3F3F3',
      fontSize: 12,
      fontWeight: '500',
    },
    challengeIcon: {
      position: 'absolute',
      bottom: -30 * SCALE,
      left: 16 * SCALE,
      width: 60 * SCALE,
      height: 60 * SCALE,
      zIndex: 10,
      borderRadius: 12 * SCALE,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    contentWrapper: {
      flex: 1,
      padding: 16 * SCALE,
      marginTop: 24 * SCALE,
      backgroundColor: theme.surfaceLight,
    },
    contentCard: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 16 * SCALE,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: 15 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 8 * SCALE,
    },
    date: {
      fontSize: 14,
      color: isDark ? '#FFF' : theme.textPrimary,
      marginTop: 4,
    },
    pointsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      gap: 4,
      backgroundColor: '#FFFBEB',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    points: {
      fontSize: 14,
      color: '#E5A000',
      fontWeight: '600',
    },
    checklistContainer: {
      marginTop: 24 * SCALE,
      gap: 8,
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checklistText: {
      fontSize: 14,
      color: theme.textPrimary,
    },
    section: {
      marginTop: 24 * SCALE,
    },
    sectionTitle: {
      fontSize: 18 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    description: {
      fontSize: 12 * SCALE,
      color: isDark ? '#FFF' : theme.textPrimary,
      lineHeight: 16 * SCALE,
      letterSpacing: 0.4,
      marginBottom: 8,
      fontWeight: '300',
    },
    participantsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    joinedTimeWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 4,
      gap: 12,
    },
    avatars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      width: 36 * SCALE,
      height: 36 * SCALE,
      borderRadius: 18 * SCALE,
      borderWidth: 2,
      borderColor: theme.background,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    remainingAvatars: {
      backgroundColor: theme.surfaceDark,
      justifyContent: 'center',
      alignItems: 'center',
    },
    remainingAvatarsText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#FFF' : theme.textTertiary,
    },
    startTime: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    startTimeNumbers: {
      fontSize: 14,
      color: theme.textPrimary,
      fontWeight: '600',
    },
    joinButtonContainer: {
      width: '100%',
      paddingHorizontal: 10 * SCALE,
      paddingTop: 24 * SCALE,
      paddingBottom: 48 * SCALE,
      backgroundColor: theme.background,
    },
    joinButton: {
      width: '100%',
      backgroundColor: theme.primary,
      padding: 16 * SCALE,
      borderRadius: 8,
      alignItems: 'center',
    },
    joinButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContainer: {
      backgroundColor: theme.background,
      width: Math.min(374 * SCALE, SCREEN_WIDTH * 0.9),
      paddingVertical: 32,
      paddingHorizontal: 24,
      borderRadius: 16,
      flexDirection: 'column',
      alignItems: 'center',
    },
    leaveModalContainer: {
      backgroundColor: theme.background,
      width: Math.min(374 * SCALE, SCREEN_WIDTH * 0.9),
      paddingVertical: 24,
      paddingHorizontal: 16,
      borderRadius: 16,
      flexDirection: 'column',
      alignItems: 'center',
    },
    modalContentContainer: {
      width: '100%',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 16 * SCALE,
      right: 16 * SCALE,
      padding: 4,
      zIndex: 1,
    },
    modalTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '400',
      width: '100%',
      textAlign: 'left',
      lineHeight: 22,
      marginTop: 24 * SCALE,
      marginBottom: 24 * SCALE,
    },
    continueButton: {
      backgroundColor: theme.primary,
      padding: 12 * SCALE,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 48 * SCALE,
    },
    continueButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '500',
    },
    blurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 900,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    fullScreenSuccessContainer: {
      position: 'absolute',
      top: 16,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 950,
    },
    fullScreenSuccessContent: {
      backgroundColor: '#DEF7EC',
      paddingVertical: 16 * SCALE,
      paddingHorizontal: 24 * SCALE,
      borderRadius: 8,
      width: '90%',
      alignItems: 'center',
    },
    fullScreenSuccessText: {
      color: '#03543F',
      fontSize: 16,
      fontWeight: '400',
      textAlign: 'center',
    },
    menuButton: {
      padding: 8,
    },
    leaveModalTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    },
    leaveModalSubtitle: {
      color: '#6B7280', // Using the exact color from the image
      fontSize: 14,
      textAlign: 'left',
      marginBottom: 32,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    cancelButtonText: {
      color: '#EC221F',
      fontSize: 16,
      fontWeight: '500',
    },
    leaveButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    leaveButtonText: {
      color: '#303030',
      fontSize: 16,
      fontWeight: '500',
    },
    progressContainer: {
      marginTop: 24,
      backgroundColor: '#F4F4F5',
      padding: 16,
      borderRadius: 8,
    },
    progressText: {
      fontSize: 14,
      color: theme.textPrimary,
      marginBottom: 8,
    },
    progressBarContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    progressBarCompleted: {
      height: 4,
      width: '16.67%', // 10 minutes out of 60 minutes = 16.67%
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    progressBarRemaining: {
      height: 4,
      width: '83.33%', // Remaining 50 minutes out of 60 minutes = 83.33%
      backgroundColor: '#D9D9D9',
      borderRadius: 2,
    },
    progressBarFullyCompleted: {
      height: 4,
      width: '100%',
      backgroundColor: '#2B6872', // Using the brand/secondary color from the image
      borderRadius: 2,
    },
    progressValue: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 8,
    },
  });
