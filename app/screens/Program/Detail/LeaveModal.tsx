import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 375;

interface LeaveModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LeaveProgramModal({
  visible,
  onClose,
  onConfirm,
  loading,
}: LeaveModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles(theme).overlay}>
        <View style={styles(theme).modalContainer}>
          <Text style={styles(theme).title}>
            Yakin ingin meninggalkan program ini?
          </Text>

          <View style={styles(theme).buttonContainer}>
            <TouchableOpacity
              style={styles(theme).cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles(theme).cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(theme).confirmButton}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.textPrimary} />
              ) : (
                <Text style={styles(theme).confirmButtonText}>Tinggalkan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      backgroundColor: theme.background,
      borderRadius: 16 * SCALE,
      padding: 24 * SCALE,
    },
    title: {
      fontSize: 20 * SCALE,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 24 * SCALE,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12 * SCALE,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 14 * SCALE,
      borderRadius: 8 * SCALE,
      backgroundColor: theme.background,
      alignItems: 'center',
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 14 * SCALE,
      borderRadius: 8 * SCALE,
      backgroundColor: theme.background,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16 * SCALE,
      fontWeight: '500',
      color: '#FF0000',
    },
    confirmButtonText: {
      fontSize: 16 * SCALE,
      fontWeight: '500',
      color: theme.textPrimary,
    },
  });
