import { getAuthToken } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

export interface MutationOptions<TData = any, TVariables = any> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiresAuth?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

export function useMutation<TData = any, TVariables = any>(
  options: MutationOptions<TData, TVariables>
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const queryClient = useQueryClient();

  const mutate = async (variables?: TVariables) => {
    try {
      setIsPending(true);
      setError(null);

      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if required
      if (options.requiresAuth) {
        const token = await getAuthToken();
        console.log('Auth token for request:', token ? 'Present' : 'Missing');
        if (!token) {
          throw new Error('Authentication required');
        }
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${options.endpoint}`, {
        method: options.method || 'POST',
        headers,
        body: variables ? JSON.stringify(variables) : undefined,
      });

      console.log('Response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.message || 'Request failed');
      }

      options.onSuccess?.(data);

      // Invalidate queries if specified
      if (options.invalidateQueries && options.invalidateQueries.length > 0) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Mutation error:', error);
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    isPending,
    error,
  };
}
