import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Program as ProgramType } from '../types';

// Extended Program type for display purposes
interface DisplayProgram extends ProgramType {
  duration: string;
  image: string;
  isFollow?: boolean;
  equipment: {
    id: number;
    name: string;
    icon: string;
    bgColor: string;
  }[];
}

interface CardProps {
  item: DisplayProgram;
  exclusive?: boolean;
}

export default function Card({ item, exclusive = false }: CardProps) {
  const { theme } = useTheme();
  // @ts-ignore - Ignore type checking for navigation
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to ProgramStack with the Detail screen and pass the program ID and data
    // @ts-ignore - Ignore type checking for navigation.navigate
    navigation.navigate('ProgramStack', {
      screen: 'Detail',
      params: {
        id: item.id,
        program: item,
      },
    });
  };

  return (
    <TouchableOpacity style={styles(theme).card} onPress={handlePress}>
      <View style={styles(theme).imageContainer}>
        <Image source={{ uri: item.image }} style={styles(theme).image} />
        {exclusive && (
          <View style={styles(theme).exclusiveTag}>
            <Text style={styles(theme).exclusiveText}>Exclusive</Text>
          </View>
        )}
      </View>
      <View style={styles(theme).info}>
        <Text style={styles(theme).title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles(theme).durationContainer}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          <Text style={styles(theme).durationText}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      width: 280,
      borderRadius: 12,
      backgroundColor: theme.cardBackground,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 160,
      resizeMode: 'cover',
    },
    exclusiveTag: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    exclusiveText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    info: {
      padding: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    durationText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
