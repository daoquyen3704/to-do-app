import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { updateStatusTask } from "@/services/task";
import type { TaskStatus } from "@/types/task";

export function useUpdateTaskStatusMutation() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number, status: TaskStatus }) => {
            const token = session?.accessToken as string;
            if (!token) throw new Error("Unauthorized");
            return updateStatusTask(id, status, token);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });
}
