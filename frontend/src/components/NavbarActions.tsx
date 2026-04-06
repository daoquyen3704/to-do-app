type NavbarActionsProps = {
    onExport: () => void;
    onOpenImportTask: () => void;
    onOpenCreateTask: () => void;
}

export default function NavbarActions({ onExport, onOpenImportTask, onOpenCreateTask }: NavbarActionsProps) {
    return (
        <>
            <button
                className="rounded-lg bg-mist-600 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800"
                onClick={onExport}
            >
                Download Template
            </button>

            <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={onOpenImportTask}
            >
                + Import CSV
            </button>

            <button
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                onClick={onOpenCreateTask}
            >
                + Add New
            </button>
        </>
    )
}
