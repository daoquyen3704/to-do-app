import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { updateStatusTask } from "@/services/task";
import { notify } from "@/utils/notify";
import { getMonthDays, isSameDate, formatDateKey } from "@/utils/date";
import type { Task, TaskStatus } from "@/types/task";

type UseTaskCalendarProps = {
  currentMonth: Date;
  today: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
};

export function useTaskCalendar({ currentMonth, today, tasks, onDayClick }: UseTaskCalendarProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
  
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);
  const [selectedDayModal, setSelectedDayModal] = useState<string | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: TaskStatus }) => {
      return updateStatusTask(id, status, accessToken);
    },
    onSuccess: async (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['tasks', 'detail', String(updatedTask.id), accessToken], updatedTask);
    }
  });

  const handleCompleteTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (task.status === 'Completed') return;
    updateStatusMutation.mutate({ id: task.id, status: 'Completed' });
    notify("Completed", "success");
  };

  const openDayModal = (dateKey: string, day: Date) => {
    setSelectedDayModal(dateKey);
    setSelectedTaskDetails(null);
    onDayClick(day);
  };

  const closeDayModal = () => {
    setSelectedDayModal(null);
    setSelectedTaskDetails(null);
  };

  const getTasksForDate = (dateKey: string) => {
    return tasks.filter((task) => task.date === dateKey || task.day === dateKey);
  };

  const isCurrentMonthDay = (day: Date) => day.getMonth() === currentMonth.getMonth();
  const isTodayDay = (day: Date) => isSameDate(day, today);

  return {
    state: {
      monthLabel,
      monthDays,
      activeDateKey,
      selectedDayModal,
      selectedTaskDetails,
    },
    actions: {
      setActiveDateKey,
      setSelectedTaskDetails,
      handleCompleteTask,
      openDayModal,
      closeDayModal,
      getTasksForDate,
      isCurrentMonthDay,
      isTodayDay,
      formatDateKey,
    }
  };
}
