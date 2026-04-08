import { useState } from "react";
import { useCreateTaskMutation, CreateTaskPayload } from "@/hooks/mutations/useCreateTaskMutation";
import type { TaskPriority, TaskStatus } from "@/types/task";
import { useCategories } from "@/hooks/queries/useCategories";


type CreateTaskModalProps = {
    onClose: () => void;
}

export default function CreateTaskModal({ onClose }: CreateTaskModalProps) {
    const [isAllDay, setIsAllDay] = useState(false);
    const { mutate, isPending,  } = useCreateTaskMutation();
    const { data: categories = [] } = useCategories();
    

    const getTodayDate = () => {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
        return new Date(today.getTime() - timezoneOffset).toISOString().split('T')[0];
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const getTextField = (name: string) => {
            const value = formData.get(name);
            return typeof value === "string" ? value : "";
        };

        const day = getTextField("day") || getTodayDate();
        let startTime: string;
        let endTime: string;

        if (isAllDay) {
            startTime = `${day}T00:00:00`;
            endTime = `${day}T23:59:59`;
        } else {
            const start = getTextField("start_time") || "00:00";
            const end = getTextField("end_time") || "23:59";
            startTime = `${day}T${start}${start.split(":").length === 2 ? ":00" : ""}`;
            endTime = `${day}T${end}${end.split(":").length === 2 ? ":00" : ""}`;
        }

        const payload: CreateTaskPayload = {
            title: getTextField("title"),
            description: getTextField("description"),
            day,
            start_time: startTime,
            end_time: endTime,
            priority: (getTextField("priority") || "Low") as TaskPriority,
            status: (getTextField("status") || "Pending") as TaskStatus,
            color: getTextField("color") || "#000000",
            is_all_day: isAllDay,
            category_id: getTextField("category_id") ? Number(getTextField("category_id")) : null,
        };

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900">Create Task</h3>
                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5"
                            placeholder="Add title"
                            name="title"
                            required
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
                            checked={isAllDay}
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

                    <div className="grid grid-cols-4 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-indigo-500"
                                name="category_id"
                                defaultValue={""}
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
                                defaultValue="#000"
                                className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-gray-200 p-1"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating...' : 'Create task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
