import { useState } from "react";
import { useSession } from "next-auth/react";
import { notify } from "@/utils/notify";
import { exportTasksTemplate } from "@/services/task";
import CreateTaskModal from "@/components/CreateTaskModal";
import ImportTask from "@/components/ImportTask";

export default function NavbarActions() {
    const { data: session } = useSession();
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isImportTaskOpen, setIsImportTaskOpen] = useState(false);

    const handleExport = async () => {
        try {
            const token = session?.accessToken as string;
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

    return (
        <>
            <button
                className="rounded-lg bg-mist-600 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800"
                onClick={handleExport}
            >
                Download Template
            </button>

            <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={() => setIsImportTaskOpen(true)}
            >
                + Import CSV
            </button>

            <button
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                onClick={() => setIsCreateTaskOpen(true)}
            >
                + Add New
            </button>

            {isCreateTaskOpen && (
                <CreateTaskModal onClose={() => setIsCreateTaskOpen(false)} />
            )}

            {isImportTaskOpen && (
                <ImportTask onClose={() => setIsImportTaskOpen(false)} />
            )}
        </>
    )
}
