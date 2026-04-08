'use client';
import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { UpdateTaskPayload, useTaskDetail } from "@/hooks/mutations/useTaskDetailActions";
import { buildTaskDateTime, formatTimeForInput } from "@/utils/date";
import { useCategories } from "@/hooks/queries/useCategories";

export function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void; }) {
    const [isAllDay, setIsAllDay] = useState(task.is_all_day === true);

    const { data: categories = [] } = useCategories();

    const { updateTaskMutation, deleteTaskMutation } = useTaskDetail(task, onClose);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const getTextField = (name: string) => {
            const value = formData.get(name);
            return typeof value === "string" ? value : "";
        };

        const day = getTextField("day") || task.day || "";
        const start = getTextField("start_time") || formatTimeForInput(task.start_time);
        const end = getTextField("end_time") || formatTimeForInput(task.end_time);

        const payload: UpdateTaskPayload = {
            title: getTextField("title") || task.title,
            description: getTextField("description"),
            day,
            start_time: isAllDay ? `${day}T00:00:00` : buildTaskDateTime(day, start),
            end_time: isAllDay ? `${day}T23:59:59` : buildTaskDateTime(day, end),
            priority: (getTextField("priority") || task.priority || "Low") as TaskPriority,
            status: (getTextField("status") || task.status || "Pending") as TaskStatus,
            color: getTextField("color") || task.color || "#000000",
            is_all_day: isAllDay,
            category_id: getTextField("category_id") ? Number(getTextField("category_id")) : null,
        };

        updateTaskMutation.mutate(payload);
    };
    return (
        <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
            <form key={task.id} className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        defaultValue={task.title || ""}
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
                        defaultValue={task.description || ""}
                        name="description"
                    />
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <input
                        id="is_all_day"
                        type="checkbox"
                        name="is_all_day"
                        checked= {isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700 cursor-pointer">
                        This is an all-day event
                    </label>
                </div>
                <div className={`grid gap-4 ${isAllDay ? 'grid-cols-1' : 'grid-cols-3'}`}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Date</label>
                        <input
                            type="date"
                            name="day"
                            defaultValue={task.day || task.date || ""}
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {!isAllDay && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start</label>
                                <input
                                    type="time"
                                    defaultValue={formatTimeForInput(task.start_time)}
                                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                    name="start_time"
                                    step={60}
                                />  
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End</label>
                                <input
                                    type="time"
                                    defaultValue={formatTimeForInput(task.end_time)}
                                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                    name="end_time"
                                    step={60}
                                />
                            </div>
                        </>
                    )}

                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-indigo-500"
                            name="priority"
                            defaultValue={task.priority || "Low"}
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
                            defaultValue={task.status || "Pending"}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-indigo-500"
                            name="category_id"
                            defaultValue={task.category_id ?? task.category?.id ?? ""}
                            >
                            <option value="">None</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                {category.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <input
                            type="color"
                            name="color"
                            defaultValue={task.color || "#000000"}
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
