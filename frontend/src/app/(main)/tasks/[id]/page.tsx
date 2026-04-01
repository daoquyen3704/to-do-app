"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTask, updateTask, deleteTask } from "@/lib/api/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSession } from "next-auth/react";
import { Task } from "@/lib/api/task";
import { toast } from "sonner";

export default function TaskDetailPage() {
  const params = useParams(); 
  // console.log(params);
  const router = useRouter();
  const idStr = params.id as string;
  const id = parseInt(idStr, 10);

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const { data: task, isLoading, isError } = useTask(idStr);
  const [isAllDay, setIsAllDay] = useState(false);
  const handleNotify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        toast[type](message);
    };

  useEffect(() => {
    if (task) {
      setIsAllDay(task.is_all_day || false);
    }
  }, [task]);

  const updateTaskMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      
       return updateTask(id, formData, accessToken);
    },
    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(['task', idStr, accessToken], updatedTask);
      queryClient.setQueryData(['tasks', accessToken], (oldData: any) => {
        if (!oldData) return oldData;
        
        const isArray = Array.isArray(oldData);
        const tasksList = isArray ? oldData : (oldData.results || []);
        
        const newTasks = tasksList.map((t: Task) => t.id === updatedTask.id ? updatedTask : t);
        
        return isArray ? newTasks : { ...oldData, results: newTasks };
      });

      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      router.refresh();
      router.back();
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
        return deleteTask(id, accessToken);
    },
    onSuccess: (_, deleteId) => {
        queryClient.setQueryData(['tasks', accessToken], (oldData: any) => {
            if (!oldData) return oldData;

            const isArray = Array.isArray(oldData);
            const tasksList = isArray ? oldData : (oldData.results || []);
            const newTasks = tasksList.filter((t: any) => t.id !== deleteId);

            return isArray ? newTasks : { ...oldData, results: newTasks };
        });
        queryClient.removeQueries({ queryKey: ['task', String(deleteId), accessToken] });
        queryClient.invalidateQueries({queryKey: ['tasks']});
        handleNotify("Task deleted successfully", "success");
        router.back();
    }
  })

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
      if (!task) return;
      
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

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (isError || !task) return <div className="p-8 text-center text-red-500">Task not found or an error occurred.</div>;

  return (
    <section className="p-8 flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-2xl">
        <button 
          className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors" 
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to calendar
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Task Details</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        defaultValue={task.title}
                        className="w-full rounded-lg border border-gray-200 p-3 focus:border-black focus:ring-black outline-none transition"
                        placeholder="Add a title"
                        name="title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 p-3 focus:border-black focus:ring-black outline-none transition"
                        placeholder="Add a description"
                        defaultValue={task.description}
                        name="description"
                    />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <input
                        id="is_all_day"
                        type="checkbox"
                        name="is_all_day"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        This is an all-day event
                    </label>
                </div>

                <div className={`grid gap-5 ${isAllDay ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <input
                            type="date"
                            name="day"
                            defaultValue={task.day || task.date}
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:ring-black outline-none transition"
                        />
                    </div>

                    {!isAllDay && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    defaultValue={formatTimeForInput(task.start_time)}
                                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:ring-black outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    defaultValue={formatTimeForInput(task.end_time)}
                                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:ring-black outline-none transition"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:ring-black outline-none transition"
                            name="priority"
                            defaultValue={task.priority}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black focus:ring-black outline-none transition"
                            name="status"
                            defaultValue={task.status || (task.completed ? "Completed" : "Pending")}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <div className="relative">
                          <input
                              type="color"
                              name="color"
                              defaultValue={task.color || "#3b82f6"}
                              className="h-[46px] w-full cursor-pointer rounded-lg border border-gray-200 p-1 bg-white"
                          />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={updateTaskMutation.isPending}
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="rounded-lg bg-red-700 px-2 py-2.5 text-sm font-medium text-white hover:bg-red-800 transition-colors flex items-center"
                            disabled={deleteTaskMutation.isPending}
                            onClick={() => {
                                    if(window.confirm("Are you sure you want to delete this task?")){
                                        deleteTaskMutation.mutate(id);
                                    }
                                }
                            }
                        >
                            {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-2 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors flex items-center"
                            disabled={updateTaskMutation.isPending}
                        >
                            {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    
                </div>
            </form>
        </div>
      </div>
    </section>
  );
}
