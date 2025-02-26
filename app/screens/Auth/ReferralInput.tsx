import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import RefferalModal from './RefferalModal';

const VALID_REFERRAL_CODES = ['A34D8', 'AGD45', 'TEST123'];

export default function ReferralInput() {
    const [referralCode, setReferralCode] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isValid, setIsValid] = useState(false);
    
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    // Setup keyboard dismiss when tapping outside
    useEffect(() => {
        const keyboardDismissListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setIsFocused(false);
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

    // Handle referral code input
    const handleReferralChange = (text: string) => {
        // Convert to uppercase and remove spaces
        const formattedText = text.toUpperCase().replace(/\s/g, '');
        setReferralCode(formattedText);
    };

    // Validate referral code
    const validateReferralCode = () => {
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            const isValidCode = VALID_REFERRAL_CODES.includes(referralCode);
            setIsValid(isValidCode);
            setShowModal(true);
            setIsLoading(false);
        }, 1000);
    };


    // Handle continue button press
    const handleSubmit = () => {
        dismissKeyboard();
        validateReferralCode();
    };

    // Handle skip button press
    const handleSkip = () => {
        navigation.navigate('BottomTab');
    };

     // Handle close modal and navigate if valid
     const handleCloseModal = () => {
        setShowModal(false);
        if (isValid) {
            // Wait a bit before navigating for better UX
            setTimeout(() => {
                navigation.navigate('BottomTab');
            }, 300);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles(theme).keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles(theme).dismissArea} 
                onPress={dismissKeyboard}
            >
                <View style={[styles(theme).container, { paddingTop: insets.top + 20 }]}>
                    <View style={styles(theme).headerContainer}>
                        <Text style={styles(theme).title}>Punya kode referral?</Text>
                        <Text style={styles(theme).subtitle}>
                            Tambahkan kode referral anda pada form berikut
                        </Text>
                    </View>

                    <View style={styles(theme).inputContainer}>
                        <TextInput
                            style={[
                                styles(theme).input,
                                isFocused && styles(theme).inputFocused,
                                referralCode && styles(theme).inputFilled
                            ]}
                            placeholder="Contoh: AGD45"
                            placeholderTextColor={theme.textTertiary}
                            value={referralCode}
                            onChangeText={handleReferralChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoCapitalize="characters"
                            maxLength={10}
                            autoFocus
                        />
                    </View>

                    <View style={[styles(theme).footer, { paddingBottom: insets.bottom || 16 }]}>
                        <View style={styles(theme).buttonContainer}>
                            <TouchableOpacity 
                                style={styles(theme).skipButton}
                                onPress={handleSkip}
                            >
                                <Text style={styles(theme).skipButtonText}>Lewati</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                            style={[
                                    styles(theme).submitButton,
                                    !referralCode && styles(theme).submitButtonDisabled
                                ]}
                                disabled={!referralCode || isLoading}
                                onPress={handleSubmit}
                            >
                                {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={[
                                styles(theme).submitButtonText,
                                !referralCode && styles(theme).submitButtonTextDisabled
                            ]}>
                                Kirim
                            </Text>
                        )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <RefferalModal 
                visible={showModal}
                isValid={isValid}
                onClose={handleCloseModal}
            />
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
        paddingHorizontal: 16,
    },
    dismissArea: {
        flex: 1,
    },
    headerContainer: {
        marginBottom: 24,
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
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: theme.textPrimary,
        backgroundColor: theme.background,
    },
    inputFocused: {
        borderColor: theme.primary,
    },
    inputFilled: {
        borderColor: theme.primary,
        color: theme.primary,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    skipButton: {
        paddingVertical: 16,
        width: '50%',
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.primary,
    },
    submitButton: {
        backgroundColor: '#2B6872',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        width: '50%',
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    submitButtonTextDisabled: {
        color: theme.textTertiary,
    },
});
