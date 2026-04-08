import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createTask } from "@/services/task";
import { notify } from "@/utils/notify";
import type { TaskPriority, TaskStatus } from "@/types/task";

export type CreateTaskPayload = {
    title: string;
    description: string;
    day: string;
    start_time: string;
    end_time: string;
    priority: TaskPriority;
    status: TaskStatus;
    color: string;
    is_all_day: boolean;
    category_id: number | null;
};

export function useCreateTaskMutation() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (newTask: CreateTaskPayload) => {
            const token = session?.accessToken as string;
            if (!token) throw new Error("You must be logged in to perform this action");
            return createTask(newTask, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            notify("Task created successfully", "success");
        },
        onError: (error: Error) => {
            notify(error.message, "error");
        }
    });
}
