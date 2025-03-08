import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface OptionsDropdownProps {
  visible: boolean;
  onClose: () => void;
  onLeavePress: () => void;
  top: number;
  right: number;
}

export default function OptionsDropdown({
  visible,
  onClose,
  onLeavePress,
  top,
  right,
}: OptionsDropdownProps) {
  const { theme } = useTheme();

  const handleLeavePress = () => {
    onLeavePress();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles(theme).overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={[
            styles(theme).container,
            {
              top,
              right,
            },
          ]}
        >
          <TouchableOpacity
            style={styles(theme).option}
            onPress={handleLeavePress}
          >
            <Text style={styles(theme).optionText}>Tinggalkan tantangan</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    container: {
      position: 'absolute',
      backgroundColor: theme.background,
      borderRadius: 8 * SCALE,
      paddingVertical: 8 * SCALE,
      minWidth: 180 * SCALE,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    option: {
      paddingVertical: 12 * SCALE,
      paddingHorizontal: 16 * SCALE,
    },
    optionText: {
      fontSize: 16 * SCALE,
      color: theme.textPrimary,
    },
  });
