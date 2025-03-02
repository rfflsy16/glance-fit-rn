import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface JoinProgramSuccessProps {
  visible: boolean;
  onClose: () => void;
}

export default function JoinProgramSuccess({
  visible,
  onClose,
}: JoinProgramSuccessProps) {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles(theme).overlay}>
        <View style={styles(theme).container}>
          <Text style={styles(theme).text}>
            Berhasil bergabung kedalam Program
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      backgroundColor: '#E8FFF1',
      paddingVertical: 16 * SCALE,
      paddingHorizontal: 24 * SCALE,
      borderRadius: 100,
      marginHorizontal: 16 * SCALE,
    },
    text: {
      color: '#15803D',
      fontSize: 14 * SCALE,
      fontWeight: '500',
      textAlign: 'center',
    },
  });
