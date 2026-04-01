"use client";
import { useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api/auth";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ImportTaskProps {
    onClose: () => void;
}

export default function ImportTask({ onClose }: ImportTaskProps) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const handleNotify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        toast[type](message);
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const token = session?.accessToken;
            if (!file) return handleNotify("Please select a file", "error");
            if (!token) {
                throw new Error("You need to be logged in to perform this action");
            }
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            setLoading(true);
            
            const res = await authFetch('/tasks/import-tasks/', token, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "An error occurred while importing");
            }
            return data;
        }, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            handleNotify("Import successfully", 'success');
            setFile(null);
        },
        onError: (error) => {
            handleNotify(error.message, 'error');
        }
    })
    const handleUpload = () => {
        mutation.mutate()
    };

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
                        onChange={(e: any) => setFile(e.target.files[0])}
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
                    >
                        {loading ? "Loading..." : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
