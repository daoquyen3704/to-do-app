import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getTasks } from '@/services/task';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useTasks() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: ['tasks', accessToken],
    queryFn: () => getTasks(accessToken!),
    enabled: !!accessToken,
  });
}