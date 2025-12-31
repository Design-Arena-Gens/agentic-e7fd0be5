'use client';

import { Task } from '../types';
import { Brain, Lightbulb, Target } from 'lucide-react';
import { getEisenhowerQuadrant } from '../utils/prioritization';

interface AIInsightsProps {
  tasks: Task[];
}

export default function AIInsights({ tasks }: AIInsightsProps) {
  const incompleteTasks = tasks.filter(t => t.status !== 'completed');

  // Generate insights
  const insights: string[] = [];
  const suggestions: string[] = [];

  // Check for overdue tasks
  const overdueTasks = incompleteTasks.filter(t => t.deadline && t.deadline < new Date());
  if (overdueTasks.length > 0) {
    insights.push(`⚠️ You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider rescheduling or breaking them into smaller steps.`);
  }

  // Check for urgent-important tasks
  const urgentImportant = incompleteTasks.filter(t => getEisenhowerQuadrant(t) === 'urgent-important');
  if (urgentImportant.length > 0) {
    insights.push(`🔥 ${urgentImportant.length} task${urgentImportant.length > 1 ? 's need' : ' needs'} immediate attention (urgent & important).`);
  }

  // Check for tasks without deadlines
  const noDeadline = incompleteTasks.filter(t => !t.deadline);
  if (noDeadline.length > 3) {
    suggestions.push(`📅 Add deadlines to ${noDeadline.length} tasks to stay organized`);
  }

  // Check for task overload
  if (incompleteTasks.length > 15) {
    suggestions.push(`🎯 You have ${incompleteTasks.length} pending tasks. Consider archiving or delegating some.`);
  }

  // Productivity tips based on patterns
  const highPriorityTasks = incompleteTasks.filter(t => t.priority === 'high' || t.priority === 'critical');
  if (highPriorityTasks.length > 5) {
    suggestions.push(`💡 Focus on 2-3 high-priority tasks at a time to avoid burnout`);
  }

  // Check completion rate
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  if (completionRate < 30 && tasks.length > 5) {
    suggestions.push(`🌟 Try breaking large tasks into smaller, manageable subtasks`);
  }

  // Motivational messages
  if (completionRate >= 70) {
    insights.push(`🎉 Great work! You've completed ${Math.round(completionRate)}% of your tasks.`);
  }

  // Time management
  const tasksToday = incompleteTasks.filter(t => {
    if (!t.deadline) return false;
    const today = new Date();
    return (
      t.deadline.getDate() === today.getDate() &&
      t.deadline.getMonth() === today.getMonth() &&
      t.deadline.getFullYear() === today.getFullYear()
    );
  });
  if (tasksToday.length > 0) {
    insights.push(`📌 ${tasksToday.length} task${tasksToday.length > 1 ? 's are' : ' is'} due today`);
  }

  if (insights.length === 0 && suggestions.length === 0) {
    insights.push('✨ All caught up! Add new tasks to stay productive.');
  }

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">AI Insights</h3>
          </div>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
