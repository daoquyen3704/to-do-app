'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authFetch } from "@/lib/api/auth";
import ImportTask from "./ImportTask";

export default function Navbar() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportTaskOpen, setImportTaskOpen] = useState(false);
    const [isAllDay, setIsAllDay] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const handleNotify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        toast[type](message);
    };
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const initials = (() => {
        const name = session?.user?.name ?? session?.user?.email ?? '';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase() || '?';
    })();
    const mutation = useMutation({
        mutationFn: async (newTask) => {
            const token = session?.accessToken;
            if (!token) {
                throw new Error("You must be logged in to perform this action");
            }
            const res = await authFetch('/tasks/', token, {
                method: "POST",
                body: JSON.stringify(newTask),
            });

            if (!res.ok) {
                const errorData = await res.json();
                let errorMsg = 'An error occurred while adding task';
                if (errorData.detail) {
                    errorMsg = errorData.detail;
                } else if (typeof errorData === 'object') {
                    errorMsg = Object.values(errorData).map((e: any) => Array.isArray(e) ? e.join(' ') : e).join(', ');
                }
                throw new Error(errorMsg);
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsModalOpen(false);
            handleNotify("Task created successfully", "success");
        },
        onError: (error) => {
            handleNotify(error.message, "error"); 
        }
    });

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const day = (data.day as string) || getTodayDate();
        let startTime, endTime;
        if (isAllDay) {
            startTime = `${day}T00:00:00`;
            endTime = `${day}T23:59:59`;
        } else {
            const st = (data.start_time as string) || '00:00';
            const et = (data.end_time as string) || '23:59';
            startTime = `${day}T${st}${st.split(':').length === 2 ? ':00' : ''}`;
            endTime = `${day}T${et}${et.split(':').length === 2 ? ':00' : ''}`;
        }
        const payload = {
            title: data.title,
            description: data.description,
            day,
            start_time: startTime,
            end_time: endTime,
            priority: data.priority,
            status: data.status,
            color: data.color,
            is_all_day: isAllDay,
        };
        mutation.mutate(payload as any);
    }

    const handleExport = async () => {
        try {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in");

            const response = await authFetch("/tasks/export-tasks/", token, { method: "GET" });
            
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');


            a.href = url;
            a.download = `task_template.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            handleNotify("Download file template successfully", "success");

        } catch (error) {
            console.error("Error:", error);
            handleNotify("An error occurred while downloading the file", "error");
        }
    };

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
                <h2 className="text-xl font-bold">To Do App</h2>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></div>

                        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900">Create Task</h3>
                            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded-lg border border-gray-200 p-2.5"
                                        placeholder="Add title"
                                        name="title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-gray-200 p-2.5"
                                        placeholder="Add description"
                                        name="description"
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                                    <input
                                        id="is_all_day"
                                        type="checkbox"
                                        name="is_all_day"
                                        onChange={(e) => setIsAllDay(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                                    />
                                    <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        This is an all-day task
                                    </label>
                                </div>
                                <div className={`grid gap-4 ${isAllDay ? 'grid-cols-1' : 'grid-cols-3'}`}>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Select Date</label>
                                        <input
                                            type="date"
                                            name="day"
                                            defaultValue={getTodayDate()}
                                            className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 outline-none"
                                        />
                                    </div>

                                    {!isAllDay && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                                <input
                                                    type="time"
                                                    name="start_time"
                                                    className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                                <input
                                                    type="time"
                                                    name="end_time"
                                                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                                />
                                            </div>
                                        </>
                                    )}

                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                            name="priority"
                                            defaultValue="Low"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                            name="status"
                                            defaultValue="Pending"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Color</label>
                                        <input
                                            type="color"
                                            name="color"
                                            defaultValue="#000"
                                            className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-gray-200 p-1"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white     transition"
                                    >
                                        Create task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isImportTaskOpen && (
                    <ImportTask onClose={() => setImportTaskOpen(false)} />
                )}
                <div className="flex items-center space-x-4">
                    <button
                        className="rounded-lg bg-mist-600 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800"
                        onClick={() => handleExport()}
                    >
                        Download Template
                    </button>

                    <button
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        onClick={() => setImportTaskOpen(true)}
                    >
                        + Import CSV
                    </button>

                    <button
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add New
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className="flex h-8 w-8 text-white items-center justify-center rounded-full bg-black text-xs font-bold shadow-sm focus:outline-none focus:ring-2"
                        >
                            {initials}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg z-50">
                                {session?.user?.name && (
                                    <p className="px-4 py-1.5 text-xs text-gray-400 truncate border-b border-gray-100 mb-1">
                                        {session.user.name}
                                    </p>
                                )}
                                <div className="space-y-1">
                                    <Link
                                        href="/profile"
                                         onClick={() => setDropdownOpen(false)}
                                        className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button

                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="w-full text-left rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
