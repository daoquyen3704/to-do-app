"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useAppSelector } from "@/utils/redux";
import { useSelector } from "react-redux";
import { useTasks } from "@/hooks/queries/useTasks";
import type { Task } from "@/types/task";
import TaskCalendar from "@/components/TaskCalendar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const searchTerm = useAppSelector((state) => state.filters.searchTerm);
  const searchInput = useDeferredValue(searchTerm);

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  
  const { data: rawTasks, isLoading, isError } = useTasks();
  
  const tasks = useMemo<Task[]>(() => {
    if (!rawTasks) return [];
    return rawTasks;
  }, [rawTasks]);

  const filteredTasks = useMemo<Task[]>(() => {
    const normalSearch = searchInput.trim().toLowerCase();

    if (!normalSearch) {
      return tasks;
    }
    return tasks.filter((task) => {
      const searchFields = [
        task.title,
      ];
      return searchFields.some((value) =>
        value?.toLowerCase().includes(normalSearch)
      );
    });
  }, [searchInput, tasks]);

  return (
    <section className="overflow-y-auto p-8 flex-1 bg-white">
      <div className="mx-auto max-w-5xl">
        {searchTerm && (
          <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {filteredTasks.length > 0
              ? `Showing ${filteredTasks.length} matching task${filteredTasks.length === 1 ? "" : "s"} for "${searchTerm}".`
              : `No tasks matched "${searchTerm}".`}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Loading tasks...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-600">
            Failed to load tasks.
          </div>
        ) : (
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
            tasks={filteredTasks}
          />
        )}
      </div>
    </section>
  );
}
