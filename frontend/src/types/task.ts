export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
import type { Category } from "@/types/category";

export type Task = {
  id: number;
  title: string;
  description?: string;
  date?: string; 
  day?: string;  
  time?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  completed?: boolean;
  category_id?: number | null;
  category?: Category | null;
  status?: TaskStatus;
  color?: string;
  priority?: TaskPriority;
};



