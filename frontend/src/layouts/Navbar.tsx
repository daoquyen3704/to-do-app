'use client';

import { usePathname } from "next/navigation";
import ImportTask from "../components/ImportTask";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useTaskToolbar } from "@/hooks/useTaskToolbar";
import { useTaskSearch } from "@/hooks/useTaskSearch";
import TaskSearch from "@/components/TaskSearch";
import CreateTaskModal from "@/components/CreateTaskModal";
import NavbarActions from "@/components/NavbarActions";
import AccountMenu from "@/components/AccountMenu";

export default function Navbar() {
    const { searchTerm, handleSearchChange, handleClearSearch } = useTaskSearch();
    const createTask = useCreateTask();
    const toolbar = useTaskToolbar();
    const pathname = usePathname();
    const showTaskSearch = (pathname === "/");

    return (
        <>
            <header className="flex h-16 items-center gap-6 border-b border-gray-200 bg-white px-8">
                <h2 className="shrink-0 text-xl font-bold">To Do App</h2>

                {showTaskSearch && (
                    <TaskSearch 
                     value={searchTerm}
                     onChange={handleSearchChange}
                     onClear={handleClearSearch}
                    />
                )}

                {createTask.isModalOpen && (
                    <CreateTaskModal 
                     onClose={createTask.handleCloseCreateModal}
                     onSubmit={createTask.handleSubmit}
                     isAllDay={createTask.isAllDay}
                     defaultDay={createTask.defaultDay}
                     onToggleAllDay={createTask.handleToggleAllDay}
                    />
                )}

                {toolbar.isImportTaskOpen && (
                    <ImportTask onClose={toolbar.handleCloseImportTask} />
                )}
                <div className="ml-auto flex items-center space-x-4">
                    <NavbarActions 
                        onExport={toolbar.handleExport}
                        onOpenImportTask={toolbar.handleOpenImportTask}
                        onOpenCreateTask={createTask.handleOpenCreateModal}
                    />
                    <AccountMenu />
                </div>
            </header>
        </>
    );
}
