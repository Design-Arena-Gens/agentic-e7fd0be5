import { Task, Priority, Category } from '../types';

const priorityKeywords = {
  critical: ['critical', 'asap', 'emergency', 'urgent!', 'immediately'],
  high: ['urgent', 'important', 'high priority', 'must', 'deadline'],
  medium: ['soon', 'medium', 'should', 'need to'],
  low: ['later', 'low priority', 'sometime', 'eventually', 'maybe']
};

const categoryKeywords = {
  work: ['work', 'job', 'meeting', 'project', 'client', 'office', 'email'],
  personal: ['personal', 'home', 'family', 'errand', 'buy', 'shop', 'groceries'],
  study: ['study', 'learn', 'read', 'course', 'assignment', 'homework', 'exam'],
  health: ['gym', 'workout', 'exercise', 'health', 'doctor', 'run', 'yoga', 'meditate']
};

const timeUnits: { [key: string]: number } = {
  'minute': 1,
  'minutes': 1,
  'min': 1,
  'hour': 60,
  'hours': 60,
  'hr': 60,
  'hrs': 60,
  'day': 480,
  'days': 480
};

export function parseNaturalLanguageTask(input: string): Partial<Task>[] {
  const tasks: Partial<Task>[] = [];

  // Split by common delimiters
  const taskStrings = input.split(/,|\band\b|;/i).map(s => s.trim()).filter(s => s);

  for (const taskString of taskStrings) {
    const task: Partial<Task> = {
      name: taskString,
      priority: detectPriority(taskString),
      category: detectCategory(taskString),
      deadline: detectDeadline(taskString),
      estimatedTime: detectEstimatedTime(taskString),
      status: 'pending'
    };

    // Clean up the task name
    task.name = cleanTaskName(taskString);

    tasks.push(task);
  }

  return tasks;
}

function detectPriority(text: string): Priority {
  const lower = text.toLowerCase();

  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return priority as Priority;
    }
  }

  // Check for exclamation marks as urgency indicator
  if ((text.match(/!/g) || []).length >= 2) return 'critical';
  if (text.includes('!')) return 'high';

  return 'medium';
}

function detectCategory(text: string): Category {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category as Category;
    }
  }

  return 'personal';
}

function detectDeadline(text: string): Date | undefined {
  const lower = text.toLowerCase();
  const now = new Date();

  // Today
  if (lower.match(/\btoday\b/)) {
    const deadline = new Date(now);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  // Tomorrow
  if (lower.match(/\btomorrow\b/)) {
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  // This week
  if (lower.match(/\bthis week\b/)) {
    const deadline = new Date(now);
    const dayOfWeek = deadline.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    deadline.setDate(deadline.getDate() + daysUntilSunday);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  // Next week
  if (lower.match(/\bnext week\b/)) {
    const deadline = new Date(now);
    const dayOfWeek = deadline.getDay();
    const daysUntilSunday = 7 - dayOfWeek + 7;
    deadline.setDate(deadline.getDate() + daysUntilSunday);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  }

  // Specific days of the week
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lower.includes(daysOfWeek[i])) {
      const deadline = new Date(now);
      const currentDay = deadline.getDay();
      let daysToAdd = i - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7;
      deadline.setDate(deadline.getDate() + daysToAdd);
      deadline.setHours(23, 59, 59, 999);
      return deadline;
    }
  }

  // Time patterns (e.g., "at 3pm", "by 5:30")
  const timeMatch = lower.match(/(?:at|by)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (timeMatch) {
    const deadline = new Date(now);
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3];

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    deadline.setHours(hours, minutes, 0, 0);

    // If the time has passed today, set it for tomorrow
    if (deadline < now) {
      deadline.setDate(deadline.getDate() + 1);
    }

    return deadline;
  }

  return undefined;
}

function detectEstimatedTime(text: string): number | undefined {
  const lower = text.toLowerCase();

  // Pattern: "30 minutes", "2 hours", "1 day"
  const timeMatch = lower.match(/(\d+)\s*(minute|minutes|min|hour|hours|hr|hrs|day|days)/);
  if (timeMatch) {
    const value = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    return value * (timeUnits[unit] || 1);
  }

  return undefined;
}

function cleanTaskName(text: string): string {
  let cleaned = text;

  // Remove time-related phrases
  cleaned = cleaned.replace(/\b(today|tomorrow|this week|next week)\b/gi, '');
  cleaned = cleaned.replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '');
  cleaned = cleaned.replace(/(?:at|by)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '');

  // Remove priority keywords
  cleaned = cleaned.replace(/\b(urgent|important|critical|asap|high priority|low priority|medium)\b/gi, '');

  // Remove time estimation
  cleaned = cleaned.replace(/\d+\s*(minute|minutes|min|hour|hours|hr|hrs|day|days)\b/gi, '');

  // Remove extra whitespace and punctuation
  cleaned = cleaned.replace(/[,;]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned || text;
}

export function categorizeTasks(tasks: Task[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    overdue: tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'completed'),
    today: tasks.filter(t => {
      if (!t.deadline || t.status === 'completed') return false;
      return t.deadline >= today && t.deadline < tomorrow;
    }),
    upcoming: tasks.filter(t => {
      if (!t.deadline || t.status === 'completed') return false;
      return t.deadline >= tomorrow;
    }),
    noDeadline: tasks.filter(t => !t.deadline && t.status !== 'completed'),
    completed: tasks.filter(t => t.status === 'completed')
  };
}
