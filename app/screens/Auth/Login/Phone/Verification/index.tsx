import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';

export default function Verification() {
    const [otpValue, setOtpValue] = useState('');
    const hiddenInputRef = useRef<TextInput>(null);
    const [timer, setTimer] = useState(150);

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    // Setup keyboard dismiss when tapping outside
    useEffect(() => {
        const keyboardDismissListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                // Optional: add any state updates needed when keyboard hides
            }
        );

        return () => {
            keyboardDismissListener.remove();
        };
    }, []);

    // Handle screen tap to dismiss keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = React.useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}.${String(remainingSeconds).padStart(2, '0')}`;
    }, []);

    const handleOtpChange = React.useCallback((value: string) => {
        const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtpValue(numbersOnly);
    }, []);

    const isOtpComplete = otpValue.length === 6;

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles(theme).keyboardAvoidingView}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles(theme).dismissArea} 
                onPress={dismissKeyboard}
            >
                <View style={[styles(theme).container, { paddingTop: insets.top }]}>
                    <Pressable 
                        style={styles(theme).backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={theme.textSecondary} />
                    </Pressable>

                    <View style={styles(theme).headerContainer}>
                        <Text style={styles(theme).title}>Masukkan kode verifikasi</Text>
                        <Text style={styles(theme).subtitle}>
                            Kami sudah mengirimkan 6 nomor kode{'\n'}
                            OTP ke nomor ini <Text style={styles(theme).phoneNumber}>+62xxxxxxxx3</Text>
                        </Text>
                    </View>


                    <Pressable 
                        style={styles(theme).otpContainer}
                        onPress={() => hiddenInputRef.current?.focus()}
                    >
                        <TextInput
                            ref={hiddenInputRef}
                            value={otpValue}
                            onChangeText={handleOtpChange}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={styles(theme).hiddenInput}
                            autoFocus
                        />
                        {Array(6).fill(0).map((_, index) => (
                            <View style={styles(theme).inputWrapper} key={`otp-${index}`}>
                                <View style={[
                                    styles(theme).otpInput,
                                    otpValue[index] && styles(theme).otpInputFilled
                                ]}>
                                    <Text style={[
                                        styles(theme).otpText,
                                        !otpValue[index] && styles(theme).placeholder
                                    ]}>
                                        {otpValue[index] || '-'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Pressable>

                    <Text style={styles(theme).resendText}>
                        Tidak menerima kode? Kirim ulang dalam <Text style={styles(theme).timerText}>{formatTime(timer)}</Text>
                    </Text>

                    <View style={[styles(theme).footer, { paddingBottom: insets.bottom + 16 }]}>
                        <Pressable 
                            style={[
                                styles(theme).continueButton,
                                !isOtpComplete && styles(theme).continueButtonDisabled
                            ]}
                            disabled={!isOtpComplete}
                            onPress={() => navigation.navigate('NameInput')}
                        >
                            <Text style={[
                                styles(theme).continueButtonText,
                                !isOtpComplete && styles(theme).continueButtonTextDisabled
                            ]}>
                                Lanjut
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: theme.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    backButton: {
        padding: 16,
    },
    headerContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        lineHeight: 24,
    },
    phoneNumber: {
        fontWeight: '700', // Lebih bold sesuai gambar
        color: theme.textSecondary, // Warna sama dengan teks lainnya
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        paddingHorizontal: 16,
    },
    inputWrapper: {
        position: 'relative',
        width: '15%',
        aspectRatio: 1,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    otpInput: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: '#757575',
        borderRadius: 8,
        backgroundColor: theme.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInputFilled: {
        borderColor: '#2B6872',
        backgroundColor: theme.background,
    },
    otpText: {
        fontSize: 24,
        color: '#2B6872',
        textAlign: 'center',
    },
    placeholder: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        lineHeight: 48,
        color: '#757575',
        fontSize: 24,
        pointerEvents: 'none',
    },
    resendText: {
        marginTop: 24,
        marginHorizontal: 16,
        textAlign: 'left',
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.5,
        fontFamily: 'Poppins',
    },
    timerText: {
        color: '#2B6872',
        fontWeight: '500',
        fontFamily: 'Poppins',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    continueButton: {
        backgroundColor: theme.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: theme.surfaceLight,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    continueButtonTextDisabled: {
        color: theme.textSecondary,
    },
    dismissArea: {
        flex: 1,
    },
});