export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'pending' | 'in-progress' | 'completed';
export type Category = 'work' | 'personal' | 'study' | 'health' | 'custom';

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  status: Status;
  category: Category;
  customCategory?: string;
  deadline?: Date;
  estimatedTime?: number;
  createdAt: Date;
  completedAt?: Date;
  subtasks?: Task[];
}

export interface DailyPlan {
  date: Date;
  tasks: Task[];
  availableTime: number;
  energyLevel: 'high' | 'medium' | 'low';
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  tasksCompleted: number;
  tasksPending: number;
  productivityScore: number;
  completionRate: number;
  bottlenecks: string[];
  suggestions: string[];
}
