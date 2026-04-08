import { authApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { UpdateProfilePayload } from "@/types/auth";

export async function UpdateProfile(payload: UpdateProfilePayload, token: string){
    try {
        const res = await authApi(token).patch('/auth/users/me/', payload);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export function useMe(token: string | undefined) {
  return useQuery({
    queryKey: ['me'],
    queryFn: async() => {
        if(!token) return null;
        try {
            const res = await authApi(token).get('/auth/users/me/');
            return res.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || "Unable to fetch user info");
        }
    },
    enabled: !!token,
  });
}
