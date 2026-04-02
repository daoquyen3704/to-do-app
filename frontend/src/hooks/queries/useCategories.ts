import { useSession } from 'next-auth/react';
import { getCategories, getCategoryDetail } from '@/services/category';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string | undefined;

    return useQuery({
        queryKey: ['categories', accessToken],
        queryFn: () => getCategories(accessToken!),
        enabled: !!accessToken,
    });
}

export function useCategoryDetail(id: number) {
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string | undefined;

    return useQuery({
        queryKey: ['categories', id, accessToken],
        queryFn: () => getCategoryDetail(accessToken!, id),
        enabled: !!accessToken && !!id,
    });
}