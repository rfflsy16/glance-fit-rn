import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LeaveProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LeaveProgramModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
}: LeaveProgramModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles(theme).overlay}>
        <View style={styles(theme).modalContainer}>
          <Text style={styles(theme).title}>
            Yakin ingin meninggalkan program ini?
          </Text>

          <View style={styles(theme).buttonContainer}>
            <TouchableOpacity
              style={[styles(theme).button, styles(theme).cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text
                style={[styles(theme).buttonText, styles(theme).cancelText]}
              >
                Batal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles(theme).button, styles(theme).confirmButton]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text
                style={[styles(theme).buttonText, styles(theme).confirmText]}
              >
                {loading ? 'Loading...' : 'Tinggalkan'}
              </Text>
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
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 24,
      width: '80%',
      maxWidth: 400,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    confirmButton: {
      backgroundColor: '#EF4444',
    },
    cancelText: {
      color: theme.textPrimary,
    },
    confirmText: {
      color: '#FFFFFF',
    },
  });
