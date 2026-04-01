import { authFetch } from './auth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';


export type Category = {
    id: number;
    name: string;
    color_code: string;
}

export async function getCategories(accessToken: string): Promise<Category[]> {
    const res = await authFetch('/categories/', accessToken);
    if (!res.ok) throw new Error('Unable to list categories');
    return res.json();
}


export async function getCategoryDetail(accessToken: string, id: number): Promise<Category> {
    const res = await authFetch(`/categories/${id}/`, accessToken);
    if (!res.ok) throw new Error('Unable to fetch category details');
    return res.json();
}

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

export async function deleteCategory(id: number, accessToken: string){
  const res = await authFetch(`/categories/${id}/`, accessToken, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json"
    },
  });
  if(!res.ok){
    throw new Error("Fail to delete category");
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null; 
  }
  return res.json();
}