import { getAuthToken } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3000/api';

interface FetchOptions {
  endpoint: string;
  queryParams?: Record<string, string>;
  requiresAuth?: boolean;
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
}

export const useFetch = <TData>(options: FetchOptions) => {
  const {
    endpoint,
    queryParams,
    requiresAuth = false,
    enabled = true,
    refetchInterval,
    staleTime,
  } = options;

  return useQuery<TData>({
    queryKey: [endpoint, queryParams],
    queryFn: async () => {
      let url = `${API_BASE_URL}${endpoint}`;

      // Add query parameters if they exist
      if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          params.append(key, value);
        });
        url += `?${params.toString()}`;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth token if required
      if (requiresAuth) {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.data;
    },
    enabled,
    refetchInterval,
    staleTime,
  });
};
