import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

interface LeaveModalProps {
    visible: boolean;
    onClose: () => void; 
    onConfirm: () => void;
}

export function ConfirmModal({ visible, onClose, onConfirm }: ConfirmModalProps) {
    const { theme, isDark } = useTheme();
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            // Reset nilai animasi
            modalOpacity.setValue(0);
            modalScale.setValue(0.8);
            
            // Animasi fade in & scale up
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animasi fade out & scale down saat modal ditutup
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 0.8,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles(theme, isDark).modalOverlay}>
            <Animated.View 
                style={[
                    styles(theme, isDark).modalContainer,
                    {
                        opacity: modalOpacity,
                        transform: [{ scale: modalScale }]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles(theme, isDark).closeButton}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color={theme.textPrimary} />
                </TouchableOpacity>

                <View style={styles(theme, isDark).modalContentContainer}>
                    <Text style={styles(theme, isDark).modalTitle}>
                        2 Balance akan terpotong untuk mengikuti tantangan ini
                    </Text>

                    <TouchableOpacity
                        style={styles(theme, isDark).continueButton}
                        onPress={onConfirm}
                    >
                        <Text style={styles(theme, isDark).continueButtonText}>
                            Lanjutkan
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

export function LeaveModal({ visible, onClose, onConfirm }: LeaveModalProps) {
    const { theme, isDark } = useTheme();
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            // Reset nilai animasi
            modalOpacity.setValue(0);
            modalScale.setValue(0.8);
            
            // Animasi fade in & scale up
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animasi fade out & scale down
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(modalScale, {
                    toValue: 0.8,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles(theme, isDark).modalOverlay}>
            <Animated.View 
                style={[
                    styles(theme, isDark).leaveModalContainer,
                    {
                        opacity: modalOpacity,
                        transform: [{ scale: modalScale }]
                    }
                ]}
            >
                <View style={styles(theme, isDark).modalContentContainer}>
                    <Text style={styles(theme, isDark).leaveModalTitle}>
                        Yakin ingin meninggalkan?
                    </Text>
                    <Text style={styles(theme, isDark).leaveModalSubtitle}>
                        Program yang telah diikuti tidak dapat ditinggalkan dan akan tetap mengurangi Balance.
                    </Text>
                    <View style={styles(theme, isDark).modalButtonsContainer}>
                        <TouchableOpacity
                            style={styles(theme, isDark).cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles(theme, isDark).cancelButtonText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles(theme, isDark).leaveButton}
                            onPress={onConfirm}
                        >
                            <Text style={styles(theme, isDark).leaveButtonText}>
                                Keluar Program
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = (theme: Theme, isDark: boolean) =>
    StyleSheet.create({
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
        leaveModalTitle: {
            color: theme.textPrimary,
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 8,
        },
        leaveModalSubtitle: {
            color: '#6B7280',
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
    });