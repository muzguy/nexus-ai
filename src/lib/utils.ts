import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

export function getStatusBadgeVariant(status: string): {
  color: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'completed':
    case 'launch_ready':
    case 'aligned':
      return {
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        dot: 'bg-rose-400',
      };
    case 'in_progress':
      return {
        color: 'text-rose-300',
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400 animate-pulse',
      };
    case 'needs_review':
    case 'warning':
    case 'conditional_pass':
      return {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: 'bg-amber-400',
      };
    case 'conflict':
    case 'strategic_misalignment':
      return {
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        dot: 'bg-rose-400',
      };
    default:
      return {
        color: 'text-nexus-400',
        bg: 'bg-nexus-800/50',
        border: 'border-nexus-700/50',
        dot: 'bg-nexus-500',
      };
  }
}
