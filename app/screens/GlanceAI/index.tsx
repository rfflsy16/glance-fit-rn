import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import LottieView from 'lottie-react-native';
import GlanceBot2 from '@/assets/lotties/GlanceBot2.json';

export default function GlanceAI() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hai! Aku GlanceAI, asisten fitness-mu 👋', sender: 'ai', time: '10:00' },
        { id: 2, text: 'Hari ini target lari 5km bisa dicapai nih! 🏃‍♂️', sender: 'ai', time: '10:01' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [showFoodAnalysis, setShowFoodAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const handleSend = () => {
        if (inputMessage.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: 'user',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');
        }
    };

    const handleFoodAnalysis = (type: 'camera' | 'gallery') => {
        // Implementasi analisis gambar
        setShowFoodAnalysis(false);
        setAnalysisResult('🍔 Burger: ±650 kalori\n🍟 Kentang goreng: ±340 kalori\n🥤 Cola: ±150 kalori');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View style={[styles(theme).container, { paddingTop: insets.top }]}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={[1]}
                        renderItem={() => (
                            <>
                                {/* Header - tambah padding horizontal */}
                                <View>
                                    <Header title="GlanceAI" />
                                </View>
                                
                                {/* AI Section - padding sudah ada di style */}
                                <View style={styles(theme).aiSection}>
                                    <View style={styles(theme).aiHeader}>
                                        <Ionicons name="sparkles" size={24} color={theme.secondary} />
                                        <Text style={styles(theme).aiTitle}>Rekomendasi AI Hari Ini</Text>
                                    </View>
                                    <View style={styles(theme).aiContent}>
                                        <View style={styles(theme).aiCard}>
                                            <Text style={styles(theme).aiText}>
                                                🏃 Lari pagi 30 menit (±300 kalori)
                                            </Text>
                                            <View style={styles(theme).progressBar}>
                                                <View style={[styles(theme).progressFill, { width: '45%' }]} />
                                            </View>
                                        </View>
                                        <View style={styles(theme).aiCard}>
                                            <Text style={styles(theme).aiText}>
                                                🥗 Konsumsi max 1800 kalori
                                            </Text>
                                            <View style={styles(theme).progressBar}>
                                                <View style={[styles(theme).progressFill, { width: '82%' }]} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Lottie - tambah padding */}
                                <View style={{ paddingHorizontal: 16 }}>
                                    <LottieView
                                        source={GlanceBot2}
                                        autoPlay
                                        loop
                                        style={[styles(theme).lottieContainer, { height: 250 }]}
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Quick Actions Grid - tambah padding parent */}
                                <View style={{ paddingHorizontal: 16 }}>
                                    <View style={styles(theme).gridContainer}>
                                        <Pressable 
                                            style={[styles(theme).gridItem, { backgroundColor: theme.primary + '15' }]}
                                            onPress={() => setShowFoodAnalysis(true)}
                                        >
                                            <Ionicons name="camera" size={28} color={theme.primary} />
                                            <Text style={styles(theme).gridText}>Analisis Makanan</Text>
                                        </Pressable>
                                        <Pressable 
                                            style={[styles(theme).gridItem, { backgroundColor: theme.secondary + '15' }]}
                                        >
                                            <Ionicons name="barbell" size={28} color={theme.secondary} />
                                            <Text style={styles(theme).gridText}>Rutin Olahraga</Text>
                                        </Pressable>
                                        <Pressable 
                                            style={[styles(theme).gridItem, { backgroundColor: theme.info + '15' }]}
                                        >
                                            <Ionicons name="bed" size={28} color={theme.info} />
                                            <Text style={styles(theme).gridText}>Analisis Tidur</Text>
                                        </Pressable>
                                        <Pressable 
                                            style={[styles(theme).gridItem, { backgroundColor: theme.success + '15' }]}
                                        >
                                            <Ionicons name="chatbubbles" size={28} color={theme.success} />
                                            <Text style={styles(theme).gridText}>Chat Pribadi</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </>
                        )}
                        contentContainerStyle={{ 
                            paddingBottom: 100,
                            flexGrow: 1
                        }}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
                
                {/* Input Section - Bungkus dengan View terpisah */}
                <View style={[
                    styles(theme).inputWrapper,
                    { 
                        paddingHorizontal: 16,
                        backgroundColor: theme.background
                    }
                ]}>
                    <TextInput
                        style={[styles(theme).input, { 
                            marginRight: 8,
                            paddingVertical: 10,
                            maxHeight: 100
                        }]}
                        placeholder="Tanya apapun ke GlanceAI..."
                        placeholderTextColor={theme.textSecondary}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <Pressable 
                        onPress={handleSend} 
                        style={({ pressed }) => [
                            styles(theme).sendButton,
                            pressed && { opacity: 0.8 },
                            { width: 40, height: 40 }
                        ]}
                    >
                        <Ionicons name="send" size={18} color={theme.textInverse} />
                    </Pressable>
                </View>

                {/* Food Analysis Modal */}
                <Modal visible={showFoodAnalysis} transparent animationType="fade">
                    <Pressable 
                        style={styles(theme).modalOverlay} 
                        onPress={() => setShowFoodAnalysis(false)}
                    >
                        <View style={styles(theme).modalContent}>
                            <Text style={styles(theme).modalTitle}>Analisis Makanan 🍴</Text>
                            
                            <Pressable 
                                style={styles(theme).modalButton}
                                onPress={() => handleFoodAnalysis('camera')}
                            >
                                <Ionicons name="camera" size={24} color={theme.textPrimary} />
                                <View style={styles(theme).buttonTextContainer}>
                                    <Text style={styles(theme).modalButtonMainText}>Ambil Foto</Text>
                                    <Text style={styles(theme).modalButtonSubText}>Deteksi kalori real-time</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                            </Pressable>
                            
                            <Pressable 
                                style={styles(theme).modalButton}
                                onPress={() => handleFoodAnalysis('gallery')}
                            >
                                <Ionicons name="image" size={24} color={theme.textPrimary} />
                                <View style={styles(theme).buttonTextContainer}>
                                    <Text style={styles(theme).modalButtonMainText}>Pilih dari Galeri</Text>
                                    <Text style={styles(theme).modalButtonSubText}>Analisis foto existing</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                            </Pressable>
                            
                            <View style={styles(theme).modalDivider} />
                            
                            <Pressable 
                                style={styles(theme).closeButton}
                                onPress={() => setShowFoodAnalysis(false)}
                            >
                                <Text style={styles(theme).closeText}>Batalkan</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    aiSection: {
        backgroundColor: theme.primary + '1A',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 0
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16
    },
    aiTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.textPrimary
    },
    aiContent: {
        gap: 12
    },
    aiCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16
    },
    aiText: {
        fontSize: 14,
        color: theme.textPrimary,
        marginBottom: 12,
        lineHeight: 20
    },
    progressBar: {
        height: 6,
        backgroundColor: theme.surfaceLight,
        borderRadius: 3,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.primary,
        borderRadius: 3
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24
    },
    gridItem: {
        width: '48%',
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderWidth: 0
    },
    gridText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textPrimary,
        textAlign: 'center',
        marginTop: 8
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: theme.background,
        marginTop: 'auto'
    },
    input: {
        flex: 1,
        backgroundColor: theme.cardBackground,
        borderRadius: 20,
        paddingHorizontal: 16,
        color: theme.textPrimary,
        fontSize: 14,
        textAlignVertical: 'center',
        minHeight: 40
    },
    sendButton: {
        backgroundColor: theme.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.overlay
    },
    modalContent: {
        backgroundColor: theme.cardBackground,
        width: '90%',
        borderRadius: 24,
        padding: 20
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.textPrimary,
        textAlign: 'center',
        marginBottom: 20
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.surfaceLight,
        marginVertical: 6
    },
    buttonTextContainer: {
        flex: 1,
        marginHorizontal: 12
    },
    modalButtonMainText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textPrimary
    },
    modalButtonSubText: {
        fontSize: 12,
        color: theme.textSecondary,
        marginTop: 2
    },
    modalDivider: {
        height: 1,
        backgroundColor: theme.border,
        marginVertical: 16
    },
    closeButton: {
        padding: 12
    },
    closeText: {
        color: theme.error,
        fontWeight: '600',
        textAlign: 'center'
    },
    lottieContainer: {
        height: 250,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 16
    }
});
