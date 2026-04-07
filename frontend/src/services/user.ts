import { authFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { UpdateProfilePayload } from "@/types/auth";

export async function UpdateProfile(payload: UpdateProfilePayload, token: string){
    const res = await authFetch('/auth/users/me/', token, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    if(!res.ok) {
        const errorData = await res.json();
        throw errorData;
    }
    return res.json();
}

export function useMe(token: string | undefined) {
  return useQuery({
    queryKey: ['me'],
    queryFn: async() => {
        if(!token) return null;
        const res = await authFetch('/auth/users/me/', token);
        if (!res.ok) throw new Error("Unable to fetch user info");
        return res.json();
    },
    enabled: !!token,
  });
}
