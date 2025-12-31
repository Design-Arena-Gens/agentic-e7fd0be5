'use client';

import { useState, useEffect } from 'react';
import { Task } from './types';
import { parseNaturalLanguageTask, categorizeTasks } from './utils/taskParser';
import { sortTasksByPriority } from './utils/prioritization';
import TaskInput from './components/TaskInput';
import TaskSection from './components/TaskSection';
import Stats from './components/Stats';
import AIInsights from './components/AIInsights';
import { ListTodo, Sparkles } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('smart-todo-tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      const tasksWithDates = parsed.map((task: any) => ({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      }));
      setTasks(tasksWithDates);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('smart-todo-tasks', JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const handleAddTask = (input: string) => {
    const parsedTasks = parseNaturalLanguageTask(input);

    const newTasks: Task[] = parsedTasks.map(parsed => ({
      id: Math.random().toString(36).substr(2, 9),
      name: parsed.name || 'Untitled task',
      priority: parsed.priority || 'medium',
      status: parsed.status || 'pending',
      category: parsed.category || 'personal',
      deadline: parsed.deadline,
      estimatedTime: parsed.estimatedTime,
      createdAt: new Date()
    }));

    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          let newStatus: Task['status'];
          if (task.status === 'pending') {
            newStatus = 'in-progress';
          } else if (task.status === 'in-progress') {
            newStatus = 'completed';
          } else {
            newStatus = 'pending';
          }

          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined
          };
        }
        return task;
      })
    );
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const categorized = categorizeTasks(tasks);
  const sortedOverdue = sortTasksByPriority(categorized.overdue);
  const sortedToday = sortTasksByPriority(categorized.today);
  const sortedUpcoming = sortTasksByPriority(categorized.upcoming);
  const sortedNoDeadline = sortTasksByPriority(categorized.noDeadline);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ListTodo className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              Smart To-Do AI
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered task management that helps you stay organized and productive
          </p>
        </div>

        {/* Task Input */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Stats */}
        {tasks.length > 0 && <Stats tasks={tasks} />}

        {/* AI Insights */}
        {tasks.length > 0 && <AIInsights tasks={tasks} />}

        {/* Task Lists */}
        <div className="space-y-6">
          <TaskSection
            title="Overdue"
            icon="🚨"
            tasks={sortedOverdue}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />

          <TaskSection
            title="Today"
            icon="📅"
            tasks={sortedToday}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />

          <TaskSection
            title="Upcoming"
            icon="📆"
            tasks={sortedUpcoming}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />

          <TaskSection
            title="No Deadline"
            icon="📋"
            tasks={sortedNoDeadline}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />

          <TaskSection
            title="Completed"
            icon="✅"
            tasks={categorized.completed}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <ListTodo className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 dark:text-gray-500 mb-2">
              No tasks yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Add your first task above to get started! Try natural language like:
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 italic">
              "Submit assignment tomorrow, buy groceries, and start gym"
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>✨ Powered by AI • Built with Next.js & React</p>
        </div>
      </div>
    </main>
  );
}
