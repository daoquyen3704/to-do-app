"use client";

import { useImportTask } from "@/hooks/useImportTask";

export default function ImportTask({ onClose }: { onClose: () => void }) {
    const { loading, file, handleUpload, handleFileChange } = useImportTask(onClose);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900">Import CSV</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Please select a CSV or Excel file
                </p>

                <div className="mt-6">
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        className=" block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibol file:bg-blue-50 
                                   hover:file:bg-blue-100 cursor-pointer"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white  transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
