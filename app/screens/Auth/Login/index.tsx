import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/constants/Theme';

import { slideItems } from './slideData';
import useSlide from './useSlide';

// Ambil ukuran layar
const { width } = Dimensions.get('window');

export default function Login() {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    // Gunakan custom hook
    const { 
        currentIndex, 
        scrollViewRef, 
        handleScroll, 
        handleScrollEnd,
        getRealIndex,
        realSlideCount,
        extendedSlides
    } = useSlide({
        slides: slideItems,
        autoSlideInterval: 3000
    });
    
    return (
        <View style={styles(theme).container}>
            {/* Image carousel */}
            <View style={styles(theme).imageContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleScrollEnd}
                    scrollEventThrottle={16}
                    contentOffset={{ x: width, y: 0 }} // Start at first real slide
                >
                    {extendedSlides.map((item) => (
                        <Image 
                            key={item.id}
                            source={item.image} 
                            style={{ width, height: '100%' }} 
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
            </View>
            
            {/* Content container */}
            <View style={styles(theme).contentContainer}>
                {/* Pagination */}
                <View style={styles(theme).paginationContainer}>
                    {Array(realSlideCount).fill(0).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles(theme).paginationDot,
                                getRealIndex(currentIndex) === index && styles(theme).activeDot
                            ]}
                        />
                    ))}
                </View>
                
                {/* Title */}
                <Text style={styles(theme).title}>
                    Track Your Activity
                </Text>
                
                {/* Description */}
                <Text style={styles(theme).description}>
                    Ikuti program kesehatan yg disesuaikan dgn kebutuhan kmu utk mencapai tujuan kebugaran dgn lebih efektif.
                </Text>
            </View>
            
            {/* Login Buttons */}
            <View style={[styles(theme).buttonsContainer, { paddingBottom: insets.bottom || 24 }]}>
                {/* Google Sign In */}
                <TouchableOpacity 
                    style={styles(theme).googleButton} 
                    onPress={() => navigation.navigate('Google')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="logo-google" size={20} color="#fff" />
                    <Text style={styles(theme).googleButtonText}>
                        Login dgn Google
                    </Text>
                </TouchableOpacity>
                
                {/* Phone Sign In */}
                <TouchableOpacity 
                    style={styles(theme).phoneButton} 
                    onPress={() => navigation.navigate('PhoneStack')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="phone-portrait-outline" size={20} color={theme.primary} />
                    <Text style={styles(theme).phoneButtonText}>
                        Login dgn No. HP
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    imageContainer: {
        height: '50%',
        width: '100%',
        backgroundColor: theme.primary,
    },
    image: {
        width,
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        justifyContent: 'flex-start',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: theme.primary,
        width: 8,
        height: 8,
    },
    title: {
        color: theme.textPrimary,
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 34,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        color: '#757575',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0.25,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    buttonsContainer: {
        paddingHorizontal: 24,
        gap: 16,
        width: '100%',
        marginTop: 'auto',
    },
    googleButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 8,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    phoneButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    phoneButtonText: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});