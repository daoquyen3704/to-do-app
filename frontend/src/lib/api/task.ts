import { authFetch } from './auth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export type Task = {
  id: number;
  title: string;
  description?: string;
  date?: string; 
  day?: string;  
  time?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  completed?: boolean;
  category?: string | null;
  status?: string;
  color?: string;
  priority?: string;
};

export async function getTasks(accessToken: string) {
  const res = await authFetch('/tasks/', accessToken);
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return res.json();
}

export async function getTaskByDay(accessToken: string, day: string) {
  const res = await authFetch(`/tasks/date/${day}/`, accessToken);
  if (!res.ok) {
    throw new Error('Failed to fetch task');
  }
  return res.json();
}

export function useTasks() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: ['tasks', accessToken],
    queryFn: () => getTasks(accessToken!),
    enabled: !!accessToken,
  });
  
}

export function useTaskDetail(day: string | number | undefined) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: ['tasks', 'detail' , day, accessToken],
    queryFn: () => getTaskByDay(accessToken!, String(day)),
    enabled: !!accessToken && !!day,
  });
}

export async function getTaskById(accessToken: string, id: string | number) {
  const res = await authFetch(`/tasks/${id}/`, accessToken);
  if (!res.ok) {
    throw new Error('Failed to fetch task');
  }
  return res.json();
}

export function useTask(id: string | number | undefined) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: ['task','detail', id, accessToken],
    queryFn: () => getTaskById(accessToken!, id!),
    enabled: !!accessToken && !!id,
  });
}

export async function updateTask(id: number, data: FormData, accessToken: string){
  const bodyData = Object.fromEntries(data);
  const res = await authFetch(`/tasks/${id}/`, accessToken, {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(bodyData)
  });
  if (!res.ok) {
    throw new Error('Failed to update task');
  }
  return res.json();
}

export async function updateStatusTask(id: number,status: string, accessToken: string){
  const res = await authFetch(`/tasks/${id}/`, accessToken, {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({status:status})
  });
  if (!res.ok) {
    throw new Error('Failed to update status task');
  }
  return res.json();
}

export async function deleteTask(id: number, accessToken: string){
  const res = await authFetch(`/tasks/${id}/`, accessToken, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json"
    },
  });
  if(!res.ok){
    throw new Error("Fail to delete task");
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null; 
  }
  return res.json();
}
