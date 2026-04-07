import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { updateTask, deleteTask } from '@/services/task';
import { notify } from '@/utils/notify';
import { Task } from '@/types/task';

export function useTaskDetail(task: Task, onClose: () => void) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string;
    const tasksQueryKey = ["tasks", accessToken];

    const updateTaskMutation = useMutation({
        mutationFn: async (data: FormData) => {
            return updateTask(task.id, data, accessToken);   
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: tasksQueryKey});
            notify("Task updated successfully", "success");
            onClose();
        },
        onError: () => {
            notify("Failed to update task", "error");
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async () => {
            return deleteTask(task.id, accessToken);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: tasksQueryKey});
            notify("Task deleted successfully", "success");
            onClose();
        },
        onError: () => {
            notify("Failed to delete task", "error");
        }
    });

    return { updateTaskMutation, deleteTaskMutation };
}
