'use client';

import { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskSectionProps {
  title: string;
  icon: string;
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export default function TaskSection({
  title,
  icon,
  tasks,
  onToggleStatus,
  onDelete,
  emptyMessage = 'No tasks here'
}: TaskSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
        <span className="text-sm font-normal text-gray-500 ml-2">({tasks.length})</span>
      </h2>
      <div>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
