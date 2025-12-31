'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (input: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3 items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tasks in natural language... (e.g., 'Submit assignment tomorrow, buy groceries, start gym')"
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 ml-4">
        💡 Try: "Urgent: finish report by Friday", "Call mom tomorrow", "Gym 3 times this week"
      </div>
    </form>
  );
}
