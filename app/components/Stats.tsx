'use client';

import { Task } from '../types';
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { calculateProductivityScore } from '../utils/prioritization';

interface StatsProps {
  tasks: Task[];
}

export default function Stats({ tasks }: StatsProps) {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status !== 'completed').length;
  const overdue = tasks.filter(t => {
    if (!t.deadline || t.status === 'completed') return false;
    return t.deadline < new Date();
  }).length;

  const productivityScore = calculateProductivityScore(completed, pending, overdue);

  const stats = [
    {
      label: 'Productivity Score',
      value: `${Math.round(productivityScore)}%`,
      icon: TrendingUp,
      color: productivityScore >= 70 ? 'text-green-500' : productivityScore >= 40 ? 'text-yellow-500' : 'text-red-500',
      bg: productivityScore >= 70 ? 'bg-green-50 dark:bg-green-900/20' : productivityScore >= 40 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
