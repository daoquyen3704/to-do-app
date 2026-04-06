import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/services/task";
import { notify } from "@/utils/notify";
import type { TaskPriority, TaskStatus } from "@/types/task";

type CreateTaskPayload = {
    title: string;
    description: string;
    day: string;
    start_time: string;
    end_time: string;
    priority: TaskPriority;
    status: TaskStatus;
    color: string;
    is_all_day: boolean;
};

export function useCreateTask() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const [isAllDay, setIsAllDay] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: async (newTask: CreateTaskPayload) => {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in to perform this action");
            return createTask(newTask, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsModalOpen(false);
            setIsAllDay(false);
            notify("Task created successfully", "success");
        },
        onError: (error: Error) => {
            notify(error.message, "error");
        }
    });

    const getTodayDate = () => {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;
        return new Date(today.getTime() - timezoneOffset).toISOString().split('T')[0];
    };

    const handleOpenCreateModal = () => {
        setIsModalOpen(true);
    };

    const handleToggleAllDay = (checked: boolean) => {
        setIsAllDay(checked);
    };

    const handleCloseCreateModal = () => {
        setIsModalOpen(false);
        setIsAllDay(false);
    };

    const handleSubmit = (formData: FormData) => {
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
        };

        mutation.mutate(payload);
    };

    return {
        isModalOpen,
        isAllDay,
        defaultDay: getTodayDate(),
        isCreating: mutation.isPending,
        handleOpenCreateModal,
        handleToggleAllDay,
        handleCloseCreateModal,
        handleSubmit,
    };
}
