import * as SecureStore from 'expo-secure-store';

// Keys for storing different pieces of auth data
const KEYS = {
  USER_ID: 'user_id',
  PROFILE_ID: 'profile_id',
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

// Type for user data that will be stored
export interface UserData {
  userId: string | number;
  profileId: string | number;
  email?: string;
  name?: string;
  phone?: string;
  authType?: 'GOOGLE' | 'PHONE';
}

/**
 * Save user ID to secure storage
 */
export const saveUserId = async (userId: string | number): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.USER_ID, String(userId));
    console.log('User ID saved successfully');
  } catch (error) {
    console.error('Error saving user ID:', error);
    throw error;
  }
};

/**
 * Get user ID from secure storage
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.USER_ID);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Save profile ID to secure storage
 */
export const saveProfileId = async (
  profileId: string | number
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.PROFILE_ID, String(profileId));
    console.log('Profile ID saved successfully');
  } catch (error) {
    console.error('Error saving profile ID:', error);
    throw error;
  }
};

/**
 * Get profile ID from secure storage
 */
export const getProfileId = async (): Promise<string | null> => {
  try {
    const profileId = await SecureStore.getItemAsync(KEYS.PROFILE_ID);
    return profileId;
  } catch (error) {
    console.error('Error getting profile ID:', error);
    return null;
  }
};

/**
 * Save authentication token to secure storage
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
    console.log('Auth token saved successfully');
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get authentication token from secure storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save complete user data object to secure storage
 */
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    // Save individual items for easy access
    if (userData.userId) await saveUserId(userData.userId);
    if (userData.profileId) await saveProfileId(userData.profileId);

    // Save the complete user data object as JSON
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(userData));
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get complete user data object from secure storage
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await SecureStore.getItemAsync(KEYS.USER_DATA);
    if (!userDataString) return null;

    return JSON.parse(userDataString) as UserData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const userId = await getUserId();
    const profileId = await getProfileId();
    return !!userId && !!profileId;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Clear all authentication data (logout)
 */
export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(KEYS.USER_ID);
    await SecureStore.deleteItemAsync(KEYS.PROFILE_ID);
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
    console.log('Logout successful - all auth data cleared');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
