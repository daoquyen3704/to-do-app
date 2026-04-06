import { useState } from "react";
import { useSession } from "next-auth/react";
import { notify } from "@/utils/notify";
import { exportTasksTemplate } from "@/services/task";

export function useTaskToolbar() {
    const { data: session } = useSession();
    const [isImportTaskOpen, setIsImportTaskOpen] = useState(false);

    const handleOpenImportTask = () => {
        setIsImportTaskOpen(true);
    };

    const handleCloseImportTask = () => {
        setIsImportTaskOpen(false);
    };

    const handleExport = async () => {
        try {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in");

            const blob = await exportTasksTemplate(token);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "task_template.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            notify("Download file template successfully", "success");
        } catch {
            notify("An error occurred while downloading the file", "error");
        }
    };

    return {
        isImportTaskOpen,
        handleOpenImportTask,
        handleCloseImportTask,
        handleExport,
    };
}
