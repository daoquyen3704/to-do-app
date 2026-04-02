export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

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
  category?: string | null;
  status?: TaskStatus;
  color?: string;
  priority?: TaskPriority;
};



