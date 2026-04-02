"use client";

import { useMemo, useState } from "react";
import { useTasks } from "@/hooks/queries/useTasks";
import type { Task } from "@/types/task";
import TaskCalendar from "@/components/TaskCalendar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  
  const { data: rawTasks, isLoading, isError } = useTasks();
  
  const tasks = useMemo<Task[]>(() => {
    if (!rawTasks) return [];
    return Array.isArray(rawTasks) ? rawTasks : (rawTasks.results || []);
  }, [rawTasks]);

  return (
    <section className="overflow-y-auto p-8 flex-1 bg-white">
      <div className="mx-auto max-w-5xl">
        <TaskCalendar
          today={today}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDate={selectedDate}
          onDayClick={(date: Date) => {
            setSelectedDate(date);
          }}
          onTaskClick={(task) => {
            router.push(`/tasks/${task.id}`);
          }}
          tasks={tasks}
        />
      </div>
    </section>
  );
}
