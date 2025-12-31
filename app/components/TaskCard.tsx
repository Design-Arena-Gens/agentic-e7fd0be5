'use client';

import { Task, Priority } from '../types';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Zap,
  Moon,
  Trash2,
  PlayCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  critical: {
    icon: Flame,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    label: '🔥 Critical'
  },
  high: {
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    label: '⚡ High'
  },
  medium: {
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    label: '⚡ Medium'
  },
  low: {
    icon: Moon,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    label: '💤 Low'
  }
};

const categoryEmoji: Record<string, string> = {
  work: '💼',
  personal: '🏠',
  study: '📚',
  health: '💪',
  custom: '📌'
};

export default function TaskCard({ task, onToggleStatus, onDelete }: TaskCardProps) {
  const config = priorityConfig[task.priority];
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  const handleStatusToggle = () => {
    onToggleStatus(task.id);
  };

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 mb-3 transition-all hover:shadow-md ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusToggle}
          className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : isInProgress ? (
            <PlayCircle className="w-6 h-6 text-blue-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-medium text-gray-800 dark:text-gray-200 ${
                isCompleted ? 'line-through' : ''
              }`}
            >
              {task.name}
            </h3>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            <span className={`${config.color} font-medium`}>
              {config.label}
            </span>

            <span className="text-gray-600 dark:text-gray-400">
              {categoryEmoji[task.category]} {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>

            {task.deadline && (
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {format(task.deadline, 'MMM d, h:mm a')}
              </span>
            )}

            {task.estimatedTime && (
              <span className="text-gray-600 dark:text-gray-400">
                ⏱️ {task.estimatedTime >= 60 ? `${Math.floor(task.estimatedTime / 60)}h` : `${task.estimatedTime}m`}
              </span>
            )}
          </div>

          <div className="mt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : isInProgress
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {isCompleted ? '✓ Completed' : isInProgress ? '▶ In Progress' : '○ Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
