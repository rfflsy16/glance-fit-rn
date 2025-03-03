import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserData,
  getProfileId,
  getUserData,
  getUserId,
} from '../hooks/useAuth';
import { logout } from '../services/auth';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  profileId: string | null;
  userData: UserData | null;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  profileId: null,
  userData: null,
  logout: async () => {},
  refreshUserData: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Function to refresh user data from secure storage
  const refreshUserData = async () => {
    try {
      setIsLoading(true);

      // Get user data from secure storage
      const storedUserData = await getUserData();
      const storedUserId = await getUserId();
      const storedProfileId = await getProfileId();

      // Update state
      setUserData(storedUserData);
      setUserId(storedUserId);
      setProfileId(storedProfileId);
      setIsAuthenticated(!!storedUserId && !!storedProfileId);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserId(null);
      setProfileId(null);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    refreshUserData();
  }, []);

  // Value object that will be passed to consumers
  const value = {
    isAuthenticated,
    isLoading,
    userId,
    profileId,
    userData,
    logout: handleLogout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
