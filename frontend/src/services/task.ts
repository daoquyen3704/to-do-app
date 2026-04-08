import { authApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export async function getTasks(accessToken: string) {
  try {
    const res = await authApi(accessToken).get('/tasks/');
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
}


export async function getTaskById(accessToken: string, id: string | number) {
  try {
    const res = await authApi(accessToken).get(`/tasks/${id}/`);
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch task');
  }
}

export function useTask(id: string | number | undefined) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: ['task', 'detail', id, accessToken],
    queryFn: () => getTaskById(accessToken!, id!),
    enabled: !!accessToken && !!id,
  });
}

export async function updateTask(id: number, data: Record<string, unknown>, accessToken: string) {
  try {
    const res = await authApi(accessToken).put(`/tasks/${id}/`, data);
    return res.data;
  } catch (error: unknown) {
    const errorData = (error as any).response?.data;
    let errorMsg = 'Failed to update task';
    if (errorData?.detail) errorMsg = errorData.detail;
    throw new Error(errorMsg);
  }
}

export async function updateStatusTask(id: number, status: string, accessToken: string) {
  try {
    const res = await authApi(accessToken).patch(`/tasks/${id}/`, { status: status });
    return res.data;
  } catch (error: unknown) {
    throw new Error('Failed to update status task');
  }
}

export async function deleteTask(id: number, accessToken: string) {
  try {
    const res = await authApi(accessToken).delete(`/tasks/${id}/`);
    if (res.status === 204 || res.headers['content-length'] === "0") {
      return null;
    }
    return res.data;
  } catch (error) {
    throw new Error("Fail to delete task");
  }
}

export async function createTask(payload: any, accessToken: string) {
  try {
    const res = await authApi(accessToken).post('/tasks/', payload);
    return res.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    let errorMsg = 'An error occurred while adding task';
    if (errorData?.detail) errorMsg = errorData.detail;
    else if (typeof errorData === 'object') {
        errorMsg = Object.values(errorData).map((e: any) => Array.isArray(e) ? e.join(' ') : e).join(', ');
    }
    throw new Error(errorMsg);
  }
}

export async function importTasks(formData: FormData, accessToken: string) {
  try {
    const res = await authApi(accessToken).post('/tasks/import-tasks/', formData);
    return res.data;
  } catch (error: any) {
    const data = error.response?.data || {};
    throw new Error(data.error || data.message || "An error occurred while importing");
  }
}

export async function exportTasksTemplate(accessToken: string) {
  try {
    const res = await authApi(accessToken).get('/tasks/export-tasks/', {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    throw new Error('Download failed');
  }
}
