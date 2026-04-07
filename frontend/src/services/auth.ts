import { RegisterPayload } from "@/types/auth";
import { apiFetch } from "@/lib/api";

export async function registerApi(payload: RegisterPayload): Promise<void> {
  const res = await apiFetch('/auth/users/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = Object.values(data).flat()[0] || 'Failed to register';
    throw new Error(String(errorMsg));
  }
}
