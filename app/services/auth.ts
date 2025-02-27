// The ngrok URL needs to be updated whenever the tunnel is restarted
// You can set this via environment variable or update it directly here
// Make sure:
// 1. Your backend server is running (e.g. npm run dev)
// 2. Ngrok is tunneling to the correct port (e.g. ngrok http 3000)
// 3. This URL matches the one shown in your ngrok terminal
// 4. The /api prefix is included in the URL
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://c04f-2a09-bac1-34a0-18-00-da-e7.ngrok-free.app/api';

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
}

// Google Sign In
export const handleGoogleSignIn = async (
  email: string,
  fullName: string,
  referralCode?: string
): Promise<UserData> => {
  try {
    const response = await fetch(`${API_URL}/auth/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, fullName, referralCode }),
    });

    let data;
    try {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      throw new Error(
        data?.details || data?.error || 'Failed to sign in with Google'
      );
    }

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
    const response = await fetch(`${API_URL}/auth/login/phone/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    let data;
    try {
      const textResponse = await response.text();
      console.log('Raw response:', textResponse); // Debug log
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      throw new Error(data?.details || data?.error || 'Failed to send OTP');
    }
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
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code }),
    });

    let data;
    try {
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse response:', textResponse);
        throw new Error('Server returned invalid JSON response');
      }
    } catch (textError) {
      console.error('Failed to read response:', textError);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      throw new Error(data?.details || data?.error || 'Failed to verify OTP');
    }

    if (!data?.data?.tempUserId) {
      throw new Error('Invalid response format from server');
    }

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
    // Create request body, omitting referralCode if it's empty
    const requestBody = {
      phoneNumber,
      fullName,
      ...(referralCode ? { referralCode } : {}),
    };

    console.log('Request body:', requestBody);

    const response = await fetch(`${API_URL}/auth/complete-phone-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // First log the raw response for debugging
    const rawResponse = await response.text();
    console.log('Raw server response:', rawResponse);

    // Then parse it as JSON
    const data = JSON.parse(rawResponse);

    if (!response.ok) {
      throw new Error(data.details || 'Failed to complete profile');
    }

    return data.data;
  } catch (error) {
    console.error('Profile completion error:', error);
    throw error;
  }
};
