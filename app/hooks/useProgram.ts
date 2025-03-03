import { Instruction } from '@/screens/Program/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useFetch } from './useFetch';
import { useMutation } from './useMutation';

export const PROGRAM_KEYS = {
  all: ['programs'] as const,
  profile: (profileId: number, programId: number) =>
    [`/profile_programs/data/${profileId}/${programId}`] as const,
  instructions: (programId: number) =>
    [`/instructions/program/${programId}`] as const,
};

interface ProfileProgram {
  id: number;
  profileId: number;
  programId: number;
  completedDays: number[];
  createdAt: string;
  updatedAt: string;
}

export function useProgram(programId: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileProgramKey = user?.profileId
    ? PROGRAM_KEYS.profile(Number(user.profileId), programId)
    : undefined;

  // Fetch profile program data
  const profileProgram = useFetch<ProfileProgram>({
    endpoint: profileProgramKey?.[0] || '',
    enabled: !!profileProgramKey,
    requiresAuth: true,
  });

  // Fetch instructions
  const instructions = useFetch<Instruction[]>({
    endpoint: PROGRAM_KEYS.instructions(programId)[0],
    enabled: !!programId,
  });

  // Follow program mutation
  const followProgram = useMutation<
    { success: boolean },
    { profileId: number; programId: number; completedDays: number[] }
  >({
    endpoint: '/profile_programs',
    method: 'POST',
    requiresAuth: true,
    onSuccess: () => {
      if (profileProgramKey) {
        queryClient.invalidateQueries({ queryKey: profileProgramKey });
      }
    },
  });

  // Complete day mutation
  const completeDay = useMutation<ProfileProgram, { dayNumber: number }>({
    endpoint: profileProgramKey
      ? `/profile_programs/${user?.profileId}/${programId}/complete-day`
      : '',
    method: 'PUT',
    requiresAuth: true,
    onSuccess: (data) => {
      if (profileProgramKey) {
        queryClient.setQueryData(profileProgramKey, data);
        queryClient.invalidateQueries({ queryKey: profileProgramKey });
      }
    },
  });

  // Leave program mutation
  const leaveProgram = useMutation<void>({
    endpoint: `/profile_programs/${programId}`,
    method: 'DELETE',
    requiresAuth: true,
    onSuccess: () => {
      if (profileProgramKey) {
        queryClient.removeQueries({ queryKey: profileProgramKey });
      }
    },
  });

  return {
    profileProgram,
    instructions,
    followProgram,
    completeDay,
    leaveProgram,
    queryKey: profileProgramKey,
  };
}
