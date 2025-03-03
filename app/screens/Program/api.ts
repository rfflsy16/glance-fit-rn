import * as authService from '../../services/authService';
import { Profile_Programs, Program } from './types';

const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your actual API URL
const OPENROUTER_API_KEY =
  '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';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
};

const handleApiError = (error: unknown): ApiResponse<any> => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error instanceof Error ? error.message : 'An error occurred',
    error,
  };
};

export const fetchAllPrograms = async (): Promise<Program[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/programs`);
    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
};

export const fetchProgramsByCategory = async (
  categoryId: number
): Promise<Program[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/programs/category/${categoryId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch programs by category');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching programs by category:', error);
    return [];
  }
};

export const fetchExclusivePrograms = async (): Promise<Program[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/programs/exclusive`);
    if (!response.ok) {
      throw new Error('Failed to fetch exclusive programs');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching exclusive programs:', error);
    return [];
  }
};

export const getAIRecommendations = async (
  programs: Program[]
): Promise<Program[]> => {
  try {
    // Create a prompt that describes the available programs
    const programDescriptions = programs
      .map(
        (p) => `ID: ${p.id}, Title: ${p.title}, Description: ${p.description}`
      )
      .join('\n');

    const prompt = `Based on these fitness programs:\n${programDescriptions}\n\nRecommend the top 3 programs by their IDs that would be most beneficial for a general user looking to improve their fitness. Just return the IDs as a JSON array, for example: [1, 3, 5]`;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-1b-instruct:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI recommendations');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';

    // Try to extract JSON array from the response
    let recommendedIds: number[] = [];
    try {
      // Look for array pattern in the response
      const match = content.match(/\[.*?\]/);
      if (match) {
        recommendedIds = JSON.parse(match[0]);
      } else {
        // Fallback: try to parse the entire content as JSON
        recommendedIds = JSON.parse(content);
      }
    } catch (e) {
      console.error('Error parsing AI response:', e);
      // If parsing fails, return first 3 programs as fallback
      return programs.slice(0, 3);
    }

    // Filter programs by the recommended IDs
    const recommendedPrograms = programs.filter((p) =>
      recommendedIds.includes(p.id)
    );

    // If we got fewer recommendations than expected, add some programs to fill the gap
    if (recommendedPrograms.length < 3) {
      const remainingPrograms = programs.filter(
        (p) => !recommendedIds.includes(p.id)
      );
      return [...recommendedPrograms, ...remainingPrograms].slice(0, 3);
    }

    return recommendedPrograms;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Return first 3 programs as fallback
    return programs.slice(0, 3);
  }
};

// New function to fetch instructions for a specific program
export const fetchInstructionsByProgramId = async (programId: number) => {
  try {
    const url = `${API_BASE_URL}/instructions/program/${programId}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch instructions: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error('Error fetching instructions:', error);
    return [];
  }
};

// Check if a program is already followed by the user
export const checkIfProgramFollowed = async (programId: number) => {
  try {
    console.log(`checkIfProgramFollowed called with programId: ${programId}`);

    // Get the current user's profile ID from secure storage
    const profileId = await getProfileId();

    if (!profileId) {
      console.log('No profile ID found in secure storage, returning false');
      return false; // Not logged in or no profile
    }

    console.log(`Retrieved profileId: ${profileId} from secure storage`);

    // Ensure both IDs are numbers
    const numericProfileId = Number(profileId);
    const numericProgramId = Number(programId);

    console.log(
      `Converted to numbers: profileId=${numericProfileId}, programId=${numericProgramId}`
    );

    if (isNaN(numericProfileId) || isNaN(numericProgramId)) {
      console.error(
        `Invalid IDs: profileId=${profileId}, programId=${programId}`
      );
      return false;
    }

    // Use the new endpoint format with route parameters
    const url = `${API_BASE_URL}/profile_programs/check/${numericProfileId}/${numericProgramId}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${errorText}`);
      return false;
    }

    // First get the response as text to safely handle potential circular references
    const responseText = await response.text();

    // Then parse it safely
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return false;
    }

    // Extract the isFollowed boolean value from the response
    const isFollowed = data?.data?.isFollowed?.data === true;

    return isFollowed;
  } catch (error) {
    console.error('Error checking if program is followed:', error);
    return false;
  }
};

// Follow a program
export const followProgram = async (programId: number) => {
  try {
    // Get the current user's profile ID from secure storage
    const profileId = await getProfileId();

    if (!profileId) {
      return {
        success: false,
        message: 'User not logged in or no profile found',
      };
    }

    // Ensure both IDs are numbers
    const numericProfileId = Number(profileId);
    const numericProgramId = Number(programId);
    if (isNaN(numericProfileId) || isNaN(numericProgramId)) {
      console.error(
        `Invalid IDs: profileId=${profileId}, programId=${programId}`
      );
      return {
        success: false,
        message: 'Invalid profile or program ID',
      };
    }

    // First check if the program is already followed
    const isAlreadyFollowed = await checkIfProgramFollowed(numericProgramId);

    if (isAlreadyFollowed) {
      return {
        success: true,
        message: 'Program is already followed',
      };
    }

    const response = await fetch(`${API_BASE_URL}/profile_programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: numericProfileId,
        programId: numericProgramId,
        completedDays: [], // Explicitly include empty completedDays array
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${errorText}`);
      return {
        success: false,
        message: `Failed to follow program: ${response.status} ${errorText}`,
      };
    }

    // First get the response as text to safely handle potential circular references
    const responseText = await response.text();

    // Then parse it safely
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return {
        success: false,
        message: 'Failed to parse server response',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Program followed successfully',
    };
  } catch (error) {
    console.error('Error following program:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to follow program',
    };
  }
};

// Helper function to get the current user's profile ID
const getProfileId = async (): Promise<number | null> => {
  try {
    // First try to get from authService directly
    const profileId = await authService.getProfileId();

    if (!profileId) {
      console.log('No profile ID found in secure storage');
      return null;
    }

    return Number(profileId);
  } catch (error) {
    console.error('Error getting profile ID:', error);
    return null;
  }
};

export const leaveProgram = async (programId: number) => {
  try {
    // Get the current user's profile ID
    const profileId = await getProfileId();

    if (!profileId) {
      return {
        success: false,
        message: 'User not logged in or no profile found',
      };
    }

    // Ensure both IDs are numbers
    const numericProfileId = Number(profileId);
    const numericProgramId = Number(programId);

    if (isNaN(numericProfileId) || isNaN(numericProgramId)) {
      return {
        success: false,
        message: 'Invalid profile or program ID',
      };
    }

    // Use the correct endpoint that takes both profileId and programId
    const response = await fetch(
      `${API_BASE_URL}/profile_programs/${numericProfileId}/${numericProgramId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to leave program: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: null,
      message: data.message || 'Successfully left program',
    };
  } catch (error) {
    console.error('Error leaving program:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to leave program',
    };
  }
};

// Get completed days for a program
export const fetchCompletedDays = async (
  profileId: number,
  programId: number
): Promise<ApiResponse<Profile_Programs>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/profile_programs/${profileId}/${programId}/completed-days`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch completed days');
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Update completed day for a program
export const updateCompletedDay = async (
  profileId: number,
  programId: number,
  dayNumber: number
): Promise<ApiResponse<Profile_Programs>> => {
  try {
    // First update the completed day
    const response = await fetch(
      `${API_BASE_URL}/profile_programs/${profileId}/${programId}/complete-day`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dayNumber }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update completed day');
    }

    // Get the updated data
    const data = await response.json();

    if (!data?.data?.completedDays) {
      throw new Error('Invalid response format');
    }

    return {
      success: true,
      data: data.data,
      message: 'Day completed successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProgramProgress = async (
  programId: number,
  progress: number
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/profile_programs/${programId}/progress`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update program progress');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating program progress:', error);
    throw error;
  }
};

// Get profile program data (includes follow status and completed days)
export const fetchProfileProgramData = async (
  programId: number
): Promise<{
  isFollowed: boolean;
  completedDays: number[];
}> => {
  try {
    console.log(`fetchProfileProgramData called with programId: ${programId}`);

    // Get the current user's profile ID
    const profileId = await getProfileId();
    console.log('Retrieved profileId:', profileId);

    if (!profileId) {
      console.log('No profile ID found, user not logged in');
      return { isFollowed: false, completedDays: [] };
    }

    // Ensure both IDs are numbers
    const numericProfileId = Number(profileId);
    const numericProgramId = Number(programId);
    console.log('Converted IDs:', { numericProfileId, numericProgramId });

    if (isNaN(numericProfileId) || isNaN(numericProgramId)) {
      console.error(
        `Invalid IDs: profileId=${profileId}, programId=${programId}`
      );
      return { isFollowed: false, completedDays: [] };
    }

    const url = `${API_BASE_URL}/profile_programs/data/${numericProfileId}/${numericProgramId}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      // If 404, it means the program is not followed
      if (response.status === 404) {
        console.log('Program is not followed (404 response)');
        return { isFollowed: false, completedDays: [] };
      }

      const errorText = await response.text();
      console.error(`API error: ${response.status} ${errorText}`);
      return { isFollowed: false, completedDays: [] };
    }

    // Get the raw response text first
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return { isFollowed: false, completedDays: [] };
    }

    // Check if we have valid data
    if (data?.success && data?.data) {
      const completedDays = Array.isArray(data.data.completedDays)
        ? data.data.completedDays
        : [];

      console.log('Returning completed days:', completedDays);

      return {
        isFollowed: true,
        completedDays,
      };
    }

    console.log('No valid data found in response');
    return { isFollowed: false, completedDays: [] };
  } catch (error) {
    console.error('Error fetching profile program data:', error);
    return { isFollowed: false, completedDays: [] };
  }
};
