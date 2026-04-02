'use client';

import { weekDays } from "@/utils/date";
import type { Task } from "@/types/task";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskDetailModal } from "./TaskDetailModal";
import { useTaskCalendar } from "@/hooks/useTaskCalendar";

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
  const { state, actions } = useTaskCalendar({
    currentMonth,
    today,
    tasks,
    onDayClick,
  });

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl">{state.monthLabel}</h3>
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
        {state.monthDays.map((day) => {
          const dateKey = actions.formatDateKey(day);
          const tasksForDate = actions.getTasksForDate(dateKey);
          const isCurrentMonth = actions.isCurrentMonthDay(day);
          const isToday = actions.isTodayDay(day);
          const isOpened = state.activeDateKey === dateKey;

          return (
            <div className={["group relative border-none min-h-[120px] rounded-md hover:bg-gray-100 p-2 cursor-pointer",
              !isCurrentMonth ? "bg-gray-200" : ""
            ].join(" ")}
              key={dateKey}
              onClick={() => actions.openDayModal(dateKey, day)}
            >

              {isOpened && tasksForDate.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={(e) => { e.stopPropagation(); actions.setActiveDateKey(null); }}
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
                              <tr key={task.id} className="hover:bg-gray-200 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); actions.setActiveDateKey(null); actions.openDayModal(dateKey, day); actions.setSelectedTaskDetails(task); }}>
                                <td className={task.status === "Completed" ? "py-1.5 px-2 max-w-[150px] truncate line-through" : "py-1.5 px-2 max-w-[150px] truncate"}
                                  title={task.title}>
                                  {task.title}
                                </td>
                                <td><FontAwesomeIcon icon={faCheck} color={task.status === "Completed" ? '#10b981' : '#d1d5db'}
                                  onClick={(e) => actions.handleCompleteTask(e, task)}
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
                    onClick={(e) => { e.stopPropagation(); actions.openDayModal(dateKey, day); actions.setSelectedTaskDetails(task); }}
                  >
                    <p className="text-sm text-gray-500">{task.title}</p>
                    <FontAwesomeIcon icon={faCheck} color={task.status === "Completed" ? '#10b981' : '#d1d5db'} onClick={(e) => actions.handleCompleteTask(e, task)} />

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

      {state.selectedDayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={actions.closeDayModal}>
          {!state.selectedTaskDetails ? (
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={actions.closeDayModal}
                className="absolute top-4 right-5 text-gray-400 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Tasks - {state.selectedDayModal}</h3>

              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {(() => {
                  const tasksForSelectedDay = actions.getTasksForDate(state.selectedDayModal!);
                  return tasksForSelectedDay.length > 0 ? tasksForSelectedDay.map(task => (
                    <div key={task.id}
                      onClick={() => actions.setSelectedTaskDetails(task)}
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
                        onClick={(e) => actions.handleCompleteTask(e, task)}
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
                onClick={() => actions.setSelectedTaskDetails(null)}
                className="absolute -top-10 left-0 text-white hover:text-gray-200 transition flex items-center gap-2 mb-2 z-10"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to list
              </button>
              <TaskDetailModal
                task={state.selectedTaskDetails}
                onClose={actions.closeDayModal}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}


