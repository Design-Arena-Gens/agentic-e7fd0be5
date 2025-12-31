import { Task, Priority } from '../types';
import { isToday, isBefore, startOfDay } from 'date-fns';

export type EisenhowerQuadrant =
  | 'urgent-important'
  | 'important-not-urgent'
  | 'urgent-not-important'
  | 'neither';

export function getEisenhowerQuadrant(task: Task): EisenhowerQuadrant {
  const isUrgent = isTaskUrgent(task);
  const isImportant = isTaskImportant(task);

  if (isUrgent && isImportant) return 'urgent-important';
  if (!isUrgent && isImportant) return 'important-not-urgent';
  if (isUrgent && !isImportant) return 'urgent-not-important';
  return 'neither';
}

function isTaskUrgent(task: Task): boolean {
  if (!task.deadline) return false;

  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Overdue or due today
  if (isBefore(task.deadline, tomorrow) || isToday(task.deadline)) {
    return true;
  }

  // Due tomorrow and high/critical priority
  if (task.deadline < dayAfterTomorrow && (task.priority === 'high' || task.priority === 'critical')) {
    return true;
  }

  return false;
}

function isTaskImportant(task: Task): boolean {
  return task.priority === 'high' || task.priority === 'critical';
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityWeight: Record<Priority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  return [...tasks].sort((a, b) => {
    // First, sort by Eisenhower quadrant
    const quadrantA = getEisenhowerQuadrant(a);
    const quadrantB = getEisenhowerQuadrant(b);

    const quadrantWeight = {
      'urgent-important': 4,
      'important-not-urgent': 3,
      'urgent-not-important': 2,
      'neither': 1
    };

    if (quadrantWeight[quadrantA] !== quadrantWeight[quadrantB]) {
      return quadrantWeight[quadrantB] - quadrantWeight[quadrantA];
    }

    // Then by deadline (earlier first)
    if (a.deadline && b.deadline) {
      const deadlineDiff = a.deadline.getTime() - b.deadline.getTime();
      if (deadlineDiff !== 0) return deadlineDiff;
    } else if (a.deadline) {
      return -1;
    } else if (b.deadline) {
      return 1;
    }

    // Then by priority
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}

export function generateDailyPlan(
  tasks: Task[],
  availableTime: number = 480, // 8 hours in minutes
  energyLevel: 'high' | 'medium' | 'low' = 'medium'
): Task[] {
  const incompleteTasks = tasks.filter(t => t.status !== 'completed');
  const sortedTasks = sortTasksByPriority(incompleteTasks);

  const plan: Task[] = [];
  let timeAllocated = 0;

  // Adjust available time based on energy level
  const energyMultiplier = {
    high: 1.0,
    medium: 0.8,
    low: 0.6
  };
  const effectiveTime = availableTime * energyMultiplier[energyLevel];

  for (const task of sortedTasks) {
    const estimatedTime = task.estimatedTime || 60; // Default 1 hour

    // Prioritize high-energy tasks when user has high energy
    if (energyLevel === 'high' && task.priority === 'critical') {
      plan.unshift(task);
      timeAllocated += estimatedTime;
      continue;
    }

    if (timeAllocated + estimatedTime <= effectiveTime) {
      plan.push(task);
      timeAllocated += estimatedTime;
    }

    // Stop if we've allocated enough tasks
    if (timeAllocated >= effectiveTime * 0.9) break; // Leave 10% buffer
  }

  return plan;
}

export function calculateProductivityScore(
  tasksCompleted: number,
  tasksPending: number,
  overdueCount: number
): number {
  const total = tasksCompleted + tasksPending;
  if (total === 0) return 100;

  const completionRate = (tasksCompleted / total) * 100;
  const overduePenalty = overdueCount * 5;

  return Math.max(0, Math.min(100, completionRate - overduePenalty));
}
