import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { updateTask, deleteTask } from '@/services/task';
import { notify } from '@/utils/notify';
import { Task, TaskPriority, TaskStatus } from '@/types/task';

export type UpdateTaskPayload = {
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

export function useTaskDetail(task: Task, onClose: () => void) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string;
    const tasksQueryKey = ["tasks", accessToken];

    const taskDetailQueryKey = ["task", task.id, accessToken];

    const updateTaskMutation = useMutation({
        mutationFn: (data: UpdateTaskPayload) => {
            return updateTask(task.id, data, accessToken);
        },
        onSuccess: async() => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
                queryClient.invalidateQueries({ queryKey: taskDetailQueryKey }),
            ]);
            notify("Task updated successfully", "success");
            onClose();
        },
        onError: (error: Error) => {
            notify(error.message, "error");
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async () => {
            return deleteTask(task.id, accessToken);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: tasksQueryKey});
            queryClient.removeQueries({ queryKey: taskDetailQueryKey });
            notify("Task deleted successfully", "success");
            onClose();
        },
        onError: () => {
            notify("Failed to delete task", "error");
        }
    });

    return { updateTaskMutation, deleteTaskMutation };
}
