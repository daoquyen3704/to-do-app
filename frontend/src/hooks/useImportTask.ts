import { useState } from "react";
import { notify } from "@/utils/notify";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importTasks } from "@/services/task";

export function useImportTask(onClose: () => void) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const token = session?.accessToken;
            if (!file) {
                notify("Please select a file", "error");
                throw new Error("No file selected");
            }
            if (!token) {
                throw new Error("You need to be logged in to perform this action");
            }
            
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                return await importTasks(formData, token);
            }
            catch(error) {
                notify("Error occurred while importing tasks", "error");
            }
            finally {
                setLoading(false);
            }
        }, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            notify("Import successfully", 'success');
            setFile(null);
            onClose();
        },
        onError: (error: Error) => {
            notify(error.message, 'error');
        }
    });

    const handleUpload = () => {
        mutation.mutate();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    return { loading, file, handleUpload, handleFileChange};
}
