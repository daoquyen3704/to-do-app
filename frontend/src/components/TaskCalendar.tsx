'use client';
import React, { useMemo, useState } from "react";
import { weekDays, formatDateKey, isSameDate, getMonthDays } from "@/lib/utils/date";
import type { Task } from "@/lib/api/task";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateStatusTask, updateTask } from "@/lib/api/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTask } from "@/lib/api/task";
import { toast } from "sonner";
import { TaskDetailModal } from "./TaskDetailModal";


type Props = {
  today: Date;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  selectedDate: Date;
  onDayClick: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
  tasks: Task[];
};

export default function TaskCalendar({
  today,
  currentMonth,
  setCurrentMonth,
  selectedDate,
  onDayClick,
  onTaskClick,
  tasks,
}: Props) {
  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);

  const [selectedDayModal, setSelectedDayModal] = useState<string | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
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
  }

  const handleNotify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    toast[type](message);
  };
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div >
          <h3 className="font-bold text-xl">{monthLabel}</h3>
          <p>Task List</p>
        </div>

        <div className="flex justify-between gap-3">
          <button className="border rounded-2xl p-1 bg-gray-200"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Previous
          </button>

          <button
            className="border rounded-2xl p-1 bg-gray-200"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            className="text-left font-bold text-gray-500 uppercase"
            key={day}>
            {day}
          </div>
        ))}
      </div>

      <div className={"grid grid-cols-7 p-3 font-medium gap-2"}>
        {monthDays.map((day) => {
          const dateKey = formatDateKey(day);
          const tasksForDate = tasks.filter(
            (task) => task.date === dateKey || task.day === dateKey
          );
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = isSameDate(day, today);
          const isOpened = activeDateKey === dateKey;


          return (
            <div className={["group relative border-none min-h-[120px] rounded-md hover:bg-gray-100 p-2 cursor-pointer",
              !isCurrentMonth ? "bg-gray-200" : ""
            ].join(" ")}
              key={dateKey}
              onClick={() => { setSelectedDayModal(dateKey); setSelectedTaskDetails(null); onDayClick(day); }}
            >

              {isOpened && tasksForDate.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={(e) => { e.stopPropagation(); setActiveDateKey(null); }}
                  />
                  <div className="absolute top-full left-0 mt-1 z-50 w-max min-w-[150px]">
                    <div className="max-h-60 overflow-y-auto bg-gray-100 text-black text-xs rounded-md shadow-xl border border-gray-700 cursor-default">
                      {tasksForDate.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                          <thead className=" bg-gray-700/50 sticky top-0">
                            <tr>
                              <th className="py-1.5 px-2 font-medium  text-black">Task</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className=" divide-gray-100">
                            {tasksForDate.map((task) => (
                              <tr key={task.id} className="hover:bg-gray-200 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setActiveDateKey(null); setSelectedDayModal(dateKey); setSelectedTaskDetails(task); }}>
                                <td className={task.status === "Completed" ? "py-1.5 px-2 max-w-[150px] truncate line-through" : "py-1.5 px-2 max-w-[150px] truncate"}
                                  title={task.title}>
                                  {task.title}
                                </td>
                                <td><FontAwesomeIcon icon={faCheck} color={task.status === "Completed" ? '#10b981' : '#d1d5db'}
                                  onClick={(e) => { handleCompleteTask(e, task); handleNotify("Completed", "success") }}

                                /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-gray-400 p-3">No tasks</p>
                      )}
                    </div>
                  </div>
                </>
              )}


              <div className="flex justify-between">
                <span className={[
                  "font-bold flex h-7 w-7 items-center justify-center rounded-full",
                  isToday ? "bg-blue-500 text-white" : ""
                ].join(" ")}>
                  {day.getDate()}
                </span>

                {tasksForDate.length > 0 && (
                  <span className="rounded-full text-black bg-gray-300 px-2 py-0">
                    {tasksForDate.length}
                  </span>
                )}
              </div>
              <div className="border-b"></div>

              <div>
                {tasksForDate.slice(0, 2).map((task) => (
                  <div key={task.id}
                    className={task.status === "Completed" ? "flex justify-between bg-gray-100 mt-1 rounded-md hover:bg-gray-200 cursor-pointer line-through" : "flex justify-between bg-gray-100 mt-1 rounded-md hover:bg-gray-200 cursor-pointer"}
                    onClick={(e) => { e.stopPropagation(); setSelectedDayModal(dateKey); setSelectedTaskDetails(task); }}
                  >
                    <p className="text-sm text-gray-500">{task.title}</p>
                    <FontAwesomeIcon icon={faCheck} color={task.status === "Completed" ? '#10b981' : '#d1d5db'} onClick={(e) => { handleCompleteTask(e, task), handleNotify("Completed", "success") }} />

                  </div>
                ))}

                {tasksForDate.length > 2 && (
                  <button
                    className="text-xs font-bold text-gray-600 mt-1 hover:underline "
                  >
                    +{tasksForDate.length - 2} more...
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => { setSelectedDayModal(null); setSelectedTaskDetails(null); }}>
          {!selectedTaskDetails ? (
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => { setSelectedDayModal(null); setSelectedTaskDetails(null); }}
                className="absolute top-4 right-5 text-gray-400 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Tasks - {selectedDayModal}</h3>

              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {(() => {
                  const tasksForSelectedDay = tasks.filter(t => t.date === selectedDayModal || t.day === selectedDayModal);
                  return tasksForSelectedDay.length > 0 ? tasksForSelectedDay.map(task => (
                    <div key={task.id}
                      onClick={() => setSelectedTaskDetails(task)}
                      className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition shadow-sm"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className={`font-semibold text-gray-800 truncate ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}>{task.title}</p>
                        {task.start_time && !task.is_all_day && (
                          <p className="text-xs text-gray-500 mt-1">{task.start_time.substring(0, 5)} - {task.end_time?.substring(0, 5)}</p>
                        )}
                      </div>
                      <FontAwesomeIcon
                        icon={faCheck}
                        color={task.status === "Completed" ? '#10b981' : '#d1d5db'}
                        className="text-lg hover:scale-110 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTask(e, task);
                          handleNotify("Completed", "success");
                        }}
                      />
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <p>No tasks</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl relative">
              <button
                onClick={() => setSelectedTaskDetails(null)}
                className="absolute -top-10 left-0 text-white hover:text-gray-200 transition flex items-center gap-2 mb-2 z-10"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to list
              </button>
              <TaskDetailModal
                task={selectedTaskDetails}
                onClose={() => { setSelectedDayModal(null); setSelectedTaskDetails(null); }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}


