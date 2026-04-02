import { authFetch } from './auth';
import { Category } from '@/types/category';

export const createCategory = async (
  payload: { name: string; color_code: string },
  token: string
) => {
  const res = await authFetch('/categories/', token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Error adding category');
  }
  return res.json();
};

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


export async function deleteCategory(id: number, accessToken: string){
  const res = await authFetch(`/categories/${id}/`, accessToken, {
    method: "DELETE",
  });
  if(!res.ok){
    throw new Error("Fail to delete category");
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null; 
  }
  return res.json();
}