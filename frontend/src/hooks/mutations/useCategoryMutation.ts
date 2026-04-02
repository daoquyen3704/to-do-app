import { createCategory, deleteCategory } from '@/services/category';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { notify } from '@/utils/notify';

export function useCategoryMutations(accessToken: string | undefined) {
    const queryClient = useQueryClient();
    const addMutation = useMutation({
        mutationFn: (payload: { name: string; color_code: string }) => createCategory(payload, accessToken!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            notify("Category added successfully", "success");
        },
        onError: (error: any) => {
            notify(error.message || "Failed to add category", "error");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCategory(id, accessToken!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            notify("Category deleted successfully", "success");
        },
        onError: (error: any) => {
            notify(error.message || "Failed to delete category", "error");
        },
    });

    return { addMutation, deleteMutation };
}