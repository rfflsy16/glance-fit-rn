import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import LottieView from 'lottie-react-native';

// Ambil dimensi layar
const { width: screenWidth } = Dimensions.get('window');

interface RefferalModalProps {
    visible: boolean;
    isValid: boolean;
    onClose: () => void;
}

export default function RefferalModal({ visible, isValid, onClose }: RefferalModalProps) {
    const { theme } = useTheme();
    const lottieRef = useRef<LottieView>(null);

    // Reset animasi pas modal ke close
    const handleClose = () => {
        if (lottieRef.current && isValid) {
            lottieRef.current.play();
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles(theme).modalOverlay}>
                <View style={styles(theme).modalContainer}>
                    {isValid ? (
                        <>
                            <View style={styles(theme).iconContainer}>
                                <LottieView
                                    ref={lottieRef}
                                    source={require('@/assets/lotties/Success.json')}
                                    autoPlay
                                    loop={false}
                                    style={styles(theme).successImage}
                                />
                            </View>
                            <Text style={styles(theme).modalTitle}>Kode referral valid</Text>
                        </>
                    ) : (
                        <>
                            <View style={styles(theme).iconContainer}>
                                <LottieView
                                    ref={lottieRef}
                                    source={require('@/assets/lotties/Failed.json')}
                                    autoPlay
                                    loop={false}
                                    style={styles(theme).errorIcon}
                                />
                            </View>
                            <Text style={styles(theme).modalTitle}>Kode referral tidak valid</Text>
                        </>
                    )}
                    
                    <TouchableOpacity 
                        style={[
                            styles(theme).modalButton,
                            isValid ? styles(theme).successButton : styles(theme).errorButton
                        ]}
                        onPress={handleClose}
                    >
                        <Text style={styles(theme).modalButtonText}>
                            {isValid ? 'Selesai' : 'Coba Lagi'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: Math.min(343, screenWidth * 0.9), // Gunakan 90% lebar layar atau max 343px
        backgroundColor: theme.background,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        gap: 24,
        flexDirection: 'column',
    },
    iconContainer: {
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        gap: 10,
        marginBottom: 0,
    },
    successImage: {
        width: 120,
        height: 120,
    },
    errorIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        borderWidth: 4,
        borderColor: 'rgba(229, 57, 53, 0.2)',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 0,
        textAlign: 'center',
    },
    modalButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successButton: {
        backgroundColor: '#2B6872',
    },
    errorButton: {
        backgroundColor: '#E53935',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});