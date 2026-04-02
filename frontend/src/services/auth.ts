const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { RegisterPayload } from "@/types/auth";

export async function registerApi(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const firstError = Object.values(data)?.[0];
    const msg = Array.isArray(firstError) ? firstError[0] : 'Registration failed';
    throw new Error(msg as string);
  }
}

export async function authFetch(
  path: string,
  token: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `JWT ${token}`,
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
}