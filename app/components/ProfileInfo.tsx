import { Theme } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const ProfileInfo = () => {
  const { isAuthenticated, isLoading, userData, logout } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !userData) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).notLoggedInText}>
          Please log in to view your profile
        </Text>
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).title}>Profile Information</Text>

      <View style={styles(theme).infoContainer}>
        <Text style={styles(theme).label}>Name:</Text>
        <Text style={styles(theme).value}>
          {userData.name || 'Not provided'}
        </Text>
      </View>

      {userData.email && (
        <View style={styles(theme).infoContainer}>
          <Text style={styles(theme).label}>Email:</Text>
          <Text style={styles(theme).value}>{userData.email}</Text>
        </View>
      )}

      {userData.phone && (
        <View style={styles(theme).infoContainer}>
          <Text style={styles(theme).label}>Phone:</Text>
          <Text style={styles(theme).value}>{userData.phone}</Text>
        </View>
      )}

      <View style={styles(theme).infoContainer}>
        <Text style={styles(theme).label}>Auth Type:</Text>
        <Text style={styles(theme).value}>
          {userData.authType || 'Unknown'}
        </Text>
      </View>

      <TouchableOpacity style={styles(theme).logoutButton} onPress={logout}>
        <Text style={styles(theme).logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.surfaceLight,
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      padding: 20,
    },
    notLoggedInText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 16,
    },
    infoContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textSecondary,
      width: 100,
    },
    value: {
      fontSize: 16,
      color: theme.textPrimary,
      flex: 1,
    },
    logoutButton: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
    },
  });
