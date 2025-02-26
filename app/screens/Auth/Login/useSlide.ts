import { useRef, useState, useEffect } from 'react';
import { Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent, ImageSourcePropType } from 'react-native';

// Ambil ukuran layar
const { width } = Dimensions.get('window');

// Tipe untuk slide item
export interface SlideItem {
    id: string;
    image: ImageSourcePropType;
}

interface UseSlideProps {
    slides: SlideItem[];
    autoSlideInterval?: number;
}

export default function useSlide({ 
    slides, 
    autoSlideInterval = 3000
}: UseSlideProps) {
    // Buat slides dengan clone untuk infinite scroll
    const extendedSlides = [
        // Clone slide terakhir di awal
        { 
            id: 'clone-last',
            image: slides[slides.length - 1].image,
        },
        // Slide asli
        ...slides,
        // Clone slide pertama di akhir
        { 
            id: 'clone-first',
            image: slides[0].image,
        }
    ];
    
    const [currentIndex, setCurrentIndex] = useState(1);
    const scrollViewRef = useRef<ScrollView>(null);
    const realSlideCount = slides.length;
    
    // Auto slide setiap interval
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentIndex >= extendedSlides.length - 1) {
                // Reset ke slide pertama
                scrollViewRef.current?.scrollTo({
                    x: width,
                    animated: false
                });
                setCurrentIndex(1);
                return;
            }
            
            const nextIndex = currentIndex + 1;
            scrollViewRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true
            });
            setCurrentIndex(nextIndex);
        }, autoSlideInterval);
        
        return () => clearInterval(timer);
    }, [currentIndex, extendedSlides.length, autoSlideInterval]);
    
    // Handle scroll event
    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    }
    
    // Handle scroll end untuk infinite scroll
    function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        
        // Infinite scroll logic
        if (index === extendedSlides.length - 1) {
            // Jika di slide terakhir (clone), pindah ke slide asli pertama
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: width,
                    animated: false
                });
                setCurrentIndex(1);
            }, 10);
        } else if (index === 0) {
            // Jika di slide pertama (clone), pindah ke slide asli terakhir
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: width * (extendedSlides.length - 2),
                    animated: false
                });
                setCurrentIndex(extendedSlides.length - 2);
            }, 10);
        }
    }
    
    // Konversi index untuk pagination dots
    function getRealIndex(index: number) {
        // Konversi dari index carousel ke index pagination
        if (index === 0) return realSlideCount - 1;
        if (index === extendedSlides.length - 1) return 0;
        return index - 1;
    }
    
    return {
        currentIndex,
        scrollViewRef,
        handleScroll,
        handleScrollEnd,
        getRealIndex,
        realSlideCount,
        extendedSlides
    };
}