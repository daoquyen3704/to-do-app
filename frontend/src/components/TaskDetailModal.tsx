'use client';
import { useState, useEffect } from "react";
import { Task, updateTask, deleteTask } from "@/lib/api/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void; }) {
    const isAllDayValue = task.is_all_day === true || String(task.is_all_day).toLowerCase() === 'true';
    const [isAllDay, setIsAllDay] = useState(isAllDayValue);

    useEffect(() => {
        setIsAllDay(task.is_all_day === true || String(task.is_all_day).toLowerCase() === 'true');
    }, [task.is_all_day]);
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string;

    const updateTaskMutation = useMutation({
        mutationFn: async (data: FormData) => {
            return updateTask(task.id, data, accessToken);
        },
        onSuccess: (updatedTask) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.setQueryData(
                ["tasks", "detail", String(updatedTask.id), accessToken],
                updatedTask
            );
            toast.success("Task updated successfully");
            onClose();
        },
        onError: () => {
            toast.error("Failed to update task");
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async () => {
            return deleteTask(task.id, accessToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Task deleted successfully");
            onClose();
        },
        onError: () => {
            toast.error("Failed to delete task");
        }
    });

    const formatTimeForInput = (timeStr?: string) => {
        if (!timeStr) return "";
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) return timeStr.substring(0, 5);
        try {
            const d = new Date(timeStr);
            if (isNaN(d.getTime())) return timeStr;
            return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return timeStr;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        let startTime, endTime;
        const formDay = formData.get('day') as string || task.day;
        
        if (isAllDay) {
            const dStart = new Date(`${formDay}T00:00:00`);
            const dEnd = new Date(`${formDay}T23:59:59`);
            startTime = !isNaN(dStart.getTime()) ? dStart.toISOString() : `${formDay}T00:00:00`;
            endTime = !isNaN(dEnd.getTime()) ? dEnd.toISOString() : `${formDay}T23:59:59`;
        } else {
            const formStartTime = formData.get('start_time') as string || formatTimeForInput(task.start_time) || '00:00';
            const formEndTime = formData.get('end_time') as string || formatTimeForInput(task.end_time) || '23:59';
            
            const timeStrStart = formStartTime.split(':').length === 2 ? `${formStartTime}:00` : formStartTime;
            const timeStrEnd = formEndTime.split(':').length === 2 ? `${formEndTime}:00` : formEndTime;
            
            const localStart = new Date(`${formDay}T${timeStrStart}`);
            const localEnd = new Date(`${formDay}T${timeStrEnd}`);
            
            startTime = !isNaN(localStart.getTime()) ? localStart.toISOString() : `${formDay}T${timeStrStart}`;
            endTime = !isNaN(localEnd.getTime()) ? localEnd.toISOString() : `${formDay}T${timeStrEnd}`;
        }
        
        formData.set('start_time', startTime);
        formData.set('end_time', endTime);
        formData.set('is_all_day', String(isAllDay));

        updateTaskMutation.mutate(formData);
    };
    return (
        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        defaultValue={task.title}
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add a title"
                        name="title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add a description"
                        defaultValue={task.description}
                        name="description"
                    />
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <input
                        id="is_all_day"
                        type="checkbox"
                        name="is_all_day"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        This is an all-day event
                    </label>
                </div>
                <div className={`grid gap-4 ${isAllDay ? 'grid-cols-1' : 'grid-cols-3'}`}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Date</label>
                        <input
                            type="date"
                            name="day"
                            defaultValue={task.day}
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {!isAllDay && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    defaultValue={formatTimeForInput(task.start_time)}
                                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    defaultValue={formatTimeForInput(task.end_time)}
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
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-indigo-500"
                            name="priority"
                            defaultValue={task.priority}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-indigo-500"
                            name="status"
                            defaultValue={task.status}
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
                            defaultValue={task.color}
                            className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-gray-200 p-1"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this task?")) {
                                deleteTaskMutation.mutate();
                            }
                        }}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
