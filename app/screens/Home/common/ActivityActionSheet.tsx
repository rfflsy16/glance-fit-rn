import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import { 
    Animated, 
    Dimensions, 
    Easing,
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    TouchableWithoutFeedback, 
    View 
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface ActivityOption {
    id: string;
    icon: string;
    label: string;
    onPress: () => void;
}

interface ActivityActionSheetProps {
    visible: boolean;
    onClose: () => void;
    options: ActivityOption[];
}

export default function ActivityActionSheet({ 
    visible, 
    onClose, 
    options 
}: ActivityActionSheetProps) {
    const { theme, isDark } = useTheme();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const animationInProgress = useRef(false);

    useEffect(() => {
        if (visible && !animationInProgress.current) {
            animationInProgress.current = true;
            
            translateY.setValue(SCREEN_HEIGHT);
            opacity.setValue(0);
            
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true
                })
            ]).start(() => {
                animationInProgress.current = false;
            });
        } else if (!visible && !animationInProgress.current) {
            animationInProgress.current = true;
            
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start(() => {
                animationInProgress.current = false;
            });
        }
    }, [visible]);

    const handleClose = () => {
        if (animationInProgress.current) return;
        
        animationInProgress.current = true;

        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT, 
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            animationInProgress.current = false;
            onClose();
        });
    };

    const handleOptionPress = (option: ActivityOption) => {
        handleClose();
        setTimeout(() => option.onPress(), 300);
    };

    if (!visible && !animationInProgress.current) return null;

    return (
        <View style={styles(theme, isDark).container} pointerEvents={animationInProgress.current ? 'none' : 'auto'}>
            <Animated.View style={[styles(theme, isDark).overlay, { opacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <BlurView
                        intensity={25}
                        tint={isDark ? 'dark' : 'light'}
                        style={styles(theme, isDark).blurView}
                    />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View 
                style={[
                    styles(theme, isDark).bottomSheet,
                    { transform: [{ translateY }] }
                ]}
            >
                <View style={styles(theme, isDark).header}>
                    <View style={styles(theme, isDark).headerLine} />
                    <Text style={styles(theme, isDark).title}>Mulai latihan dan catat</Text>
                </View>

                <View style={styles(theme, isDark).optionsGrid}>
                    <View style={styles(theme, isDark).optionsRow}>
                        <TouchableOpacity
                            style={styles(theme, isDark).optionButton}
                            onPress={() => handleOptionPress(options[0])}
                        >
                            <Ionicons name="walk-outline" size={20} color={theme.primary} />
                            <Text style={styles(theme, isDark).optionText}>Jalan kaki</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles(theme, isDark).optionButton}
                            onPress={() => handleOptionPress(options[1])}
                        >
                            <Ionicons name="speedometer-outline" size={20} color={theme.primary} />
                            <Text style={styles(theme, isDark).optionText}>Lari</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles(theme, isDark).optionsRow}>
                        <TouchableOpacity
                            style={styles(theme, isDark).optionButton}
                            onPress={() => handleOptionPress(options[2])}
                        >
                            <Ionicons name="restaurant-outline" size={20} color={theme.primary} />
                            <Text style={styles(theme, isDark).optionText}>Makanan</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles(theme, isDark).optionButton}
                            onPress={() => handleOptionPress(options[3])}
                        >
                            <Ionicons name="water-outline" size={20} color={theme.primary} />
                            <Text style={styles(theme, isDark).optionText}>Air</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = (theme: Theme, isDark: boolean) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            zIndex: 1000,
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        blurView: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        bottomSheet: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingBottom: 24,
        },
        header: {
            alignItems: 'center',
            paddingTop: 8,
            marginBottom: 20,
        },
        headerLine: {
            width: 36,
            height: 4,
            backgroundColor: '#E5E7EB',
            borderRadius: 2,
            marginBottom: 16,
        },
        title: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.textPrimary,
        },
        optionsGrid: {
            paddingHorizontal: 4,
            marginBottom: 8,
        },
        optionsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
        },
        optionButton: {
            width: '48%',
            height: 48,
            backgroundColor: theme.background,
            borderRadius: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E6F7F8',
        },
        optionText: {
            marginLeft: 8,
            fontSize: 14,
            fontWeight: '500',
            color: theme.textPrimary,
        },
    });