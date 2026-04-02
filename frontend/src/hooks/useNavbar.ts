import React, { useRef, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/utils/notify";
import { createTask, exportTasksTemplate } from "@/services/task";

export function useNavbar() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportTaskOpen, setImportTaskOpen] = useState(false);
    const [isAllDay, setIsAllDay] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

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
        mutationFn: async (newTask: any) => {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in to perform this action");
            return createTask(newTask, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsModalOpen(false);
            notify("Task created successfully", "success");
        },
        onError: (error: Error) => {
            notify(error.message, "error");
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
        mutation.mutate(payload);
    };

    const handleExport = async () => {
        try {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in");

            const blob = await exportTasksTemplate(token);
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `task_template.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            notify("Download file template successfully", "success");
        } catch (error) {
            notify("An error occurred while downloading the file", "error");
        }
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    };

    return {
        state: {
            session,
            isModalOpen,
            isImportTaskOpen,
            isAllDay,
            dropdownOpen,
            initials,
            dropdownRef,
            getTodayDate
        },
        actions: {
            setIsModalOpen,
            setImportTaskOpen,
            setIsAllDay,
            setDropdownOpen,
            handleSubmit,
            handleExport,
            handleSignOut
        }
    };
}
