// The ngrok URL needs to be updated whenever the tunnel is restarted
// You can set this via environment variable or update it directly here
// Make sure:
// 1. Your backend server is running (e.g. npm run dev)
// 2. Ngrok is tunneling to the correct port (e.g. ngrok http 3000)
// 3. This URL matches the one shown in your ngrok terminal
// 4. The /api prefix is included in the URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Import from useAuth hook
import {
  useLogout as clearAuth,
  saveAuthToken,
  saveUserData,
} from '../hooks/useAuth';

// Validate API URL
if (!API_URL) {
  console.error('API_URL is not configured!');
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  authType: 'GOOGLE' | 'PHONE';
  referralCode: string;
  referredBy?: string;
  profileId?: number;
}

// Google Sign In
export const handleGoogleSignIn = async (
  email: string,
  fullName: string,
  referralCode?: string
): Promise<UserData> => {
  try {
    console.log('=== Starting Google Sign In ===');
    console.log('Email:', email);
    console.log('Full Name:', fullName);
    console.log('Referral Code:', referralCode || 'None provided');
    console.log('API URL:', API_URL);

    const requestBody = { email, fullName, referralCode };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    console.log('Sending request to:', `${API_URL}/auth/login/google`);
    const response = await fetch(`${API_URL}/auth/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    let data;
    let textResponse;
    try {
      textResponse = await response.text();
      console.log('Raw response:', textResponse);

      try {
        data = JSON.parse(textResponse);
        console.log('Parsed response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        console.error('Parse error:', parseError);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      throw new Error(
        data?.details || data?.error || 'Failed to sign in with Google'
      );
    }

    // Store user data in secure storage
    const userData = data.data;
    if (userData && userData.id) {
      console.log(
        'Saving user data to secure storage:',
        JSON.stringify(
          {
            userId: userData.id,
            profileId: userData.profileId || userData.id,
            email: userData.email,
            name: userData.fullName,
            authType: 'GOOGLE',
          },
          null,
          2
        )
      );

      await saveUserData({
        userId: userData.id,
        profileId: userData.profileId || userData.id,
        email: userData.email,
        name: userData.fullName,
        authType: 'GOOGLE',
      });
      console.log('User data saved to secure storage after Google login');
    } else {
      console.warn('Warning: Invalid user data received from server');
      console.warn('User data:', userData);
    }

    console.log('=== Google Sign In Completed ===');
    return data.data;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Initiate Phone Login
export const initiatePhoneLogin = async (
  phoneNumber: string
): Promise<void> => {
  try {
    console.log('=== Starting Phone Login Initiation ===');
    console.log('Phone Number:', phoneNumber);
    console.log('API URL:', API_URL);

    const requestBody = { phoneNumber };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    console.log('Sending request to:', `${API_URL}/auth/login/phone/initiate`);
    const response = await fetch(`${API_URL}/auth/login/phone/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    let data;
    let textResponse;
    try {
      textResponse = await response.text();
      console.log('Raw response:', textResponse);

      try {
        data = JSON.parse(textResponse);
        console.log('Parsed response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        console.error('Parse error:', parseError);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      throw new Error(data?.details || data?.error || 'Failed to send OTP');
    }

    console.log('=== Phone Login Initiation Completed ===');
  } catch (error) {
    console.error('Phone login initiation error:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (
  phoneNumber: string,
  code: string
): Promise<{ tempUserId: string }> => {
  try {
    console.log('=== Starting OTP Verification ===');
    console.log('Phone Number:', phoneNumber);
    console.log('OTP Code:', code);
    console.log('API URL:', API_URL);

    const requestBody = { phoneNumber, code };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    console.log('Sending request to:', `${API_URL}/auth/verify-otp`);
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    let data;
    let textResponse;
    try {
      textResponse = await response.text();
      console.log('Raw response:', textResponse);

      try {
        data = JSON.parse(textResponse);
        console.log('Parsed response data:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        console.error('Parse error:', parseError);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      throw new Error(data?.details || data?.error || 'Failed to verify OTP');
    }

    if (!data?.data?.tempUserId) {
      console.error('Invalid response format from server');
      console.error('Response data:', data);
      throw new Error('Invalid response format from server');
    }

    console.log('=== OTP Verification Completed ===');
    return data.data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

// Complete Phone Profile
export const completePhoneProfile = async (
  phoneNumber: string,
  fullName: string,
  referralCode?: string
): Promise<UserData> => {
  try {
    console.log('=== Starting Phone Profile Completion ===');
    console.log('Phone Number:', phoneNumber);
    console.log('Full Name:', fullName);
    console.log('Referral Code:', referralCode || 'None provided');
    console.log('API URL:', API_URL);

    // Create request body, omitting referralCode if it's empty
    const requestBody = {
      phoneNumber,
      fullName,
      ...(referralCode ? { referralCode } : {}),
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    console.log(
      'Sending request to:',
      `${API_URL}/auth/complete-phone-profile`
    );
    const response = await fetch(`${API_URL}/auth/complete-phone-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    // First log the raw response for debugging
    const rawResponse = await response.text();
    console.log('Raw server response:', rawResponse);

    // Then parse it as JSON
    let data;
    try {
      data = JSON.parse(rawResponse);
      console.log('Parsed response data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse response:', rawResponse);
      console.error('Parse error:', parseError);
      throw new Error('Server returned invalid JSON response');
    }

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      throw new Error(data.details || 'Failed to complete profile');
    }

    // Store user data in secure storage
    const userData = data.data;
    if (userData && userData.id) {
      console.log(
        'Saving user data to secure storage:',
        JSON.stringify(
          {
            userId: userData.id,
            profileId: userData.profileId || userData.id,
            phone: userData.phoneNumber,
            name: userData.fullName,
            authType: 'PHONE',
          },
          null,
          2
        )
      );

      // Save auth token if it exists in the response
      if (data.token) {
        console.log('Saving auth token to secure storage');
        await saveAuthToken(data.token);
      } else {
        console.warn('Warning: No auth token received from server');
      }

      await saveUserData({
        userId: userData.id,
        profileId: userData.profileId || userData.id,
        phone: userData.phoneNumber,
        name: userData.fullName,
        authType: 'PHONE',
      });
      console.log('User data saved to secure storage after phone login');
    } else {
      console.warn('Warning: Invalid user data received from server');
      console.warn('User data:', userData);
    }

    console.log('=== Phone Profile Completion Completed ===');
    return data.data;
  } catch (error) {
    console.error('Profile completion error:', error);
    throw error;
  }
};

// Add a logout function
export const logout = async (): Promise<void> => {
  try {
    console.log('=== Starting Logout ===');
    await clearAuth();
    console.log('User logged out successfully');
    console.log('=== Logout Completed ===');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
