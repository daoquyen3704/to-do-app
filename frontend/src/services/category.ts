import { authApi } from '@/lib/api';
import { Category } from '@/types/category';

export const createCategory = async (
  payload: { name: string; color_code: string },
  token: string
) => {
  try {
    const res = await authApi(token).post('/categories/', payload);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || 'Error adding category');
  }
};

export async function getCategories(accessToken: string): Promise<Category[]> {
    try {
        const res = await authApi(accessToken).get('/categories/');
        return res.data;
    } catch (error) {
        throw new Error('Unable to list categories');
    }
}

export async function getCategoryDetail(accessToken: string, id: number): Promise<Category> {
    try {
        const res = await authApi(accessToken).get(`/categories/${id}/`);
        return res.data;
    } catch (error) {
        throw new Error('Unable to fetch category details');
    }
}

export async function deleteCategory(id: number, accessToken: string){
  try {
    const res = await authApi(accessToken).delete(`/categories/${id}/`);
    if (res.status === 204 || res.headers['content-length'] === "0") {
      return null;
    }
    return res.data;
  } catch (error) {
    throw new Error("Fail to delete category");
  }
}
