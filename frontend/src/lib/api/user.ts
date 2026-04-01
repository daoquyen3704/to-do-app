import { authFetch } from "./auth";
import { useQuery } from "@tanstack/react-query";
export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
};

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