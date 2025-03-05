import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Dimensions, Modal, StyleSheet, Text, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

const SCALE = Dimensions.get('window').width / 375;
interface SuccessModalProps {
    visible: boolean;
    fadeAnim: Animated.Value;
    onAnimationFinish?: () => void;
}

export default function SuccessModal({ visible, fadeAnim, onAnimationFinish }: SuccessModalProps) {
    const { theme } = useTheme();
    const lottieRef = useRef<LottieView>(null);

    if (visible) {
        lottieRef.current?.reset();
        lottieRef.current?.play();
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
        >
            <Animated.View style={[
                styles(theme).modalContainer,
                { opacity: fadeAnim }
            ]}>
                <View style={styles(theme).modalContent}>
                    <LottieView
                        ref={lottieRef}
                        source={require('@/assets/lotties/Success.json')}
                        autoPlay
                        loop={false}
                        style={styles(theme).lottie}
                        onAnimationFinish={onAnimationFinish}
                    />
                    <Text style={styles(theme).modalTitle}>Konsumsi air</Text>
                    <Text style={styles(theme).modalSubtitle}>berhasil dicatat</Text>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 343 * SCALE,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    lottie: {
        width: 72 * SCALE,
        height: 72 * SCALE,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.textPrimary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 20,
        color: theme.textSecondary,
    },
});