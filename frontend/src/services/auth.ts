import { RegisterPayload } from "@/types/auth";
import { api } from "@/lib/api";

export async function registerApi(payload: RegisterPayload): Promise<void> {
  try {
    await api.post('/auth/users/', payload);
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMsg = errorData ? Object.values(errorData).flat()[0] : 'Failed to register';
    throw new Error(String(errorMsg));
  }
}
