'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, isMounted } = useTheme();

  // If not mounted yet, render placeholder with same dimensions to avoid layout shift
  if (!isMounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-nexus-850 border border-nexus-800 opacity-60" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`w-8 h-8 rounded-lg bg-nexus-850 hover:bg-nexus-800 border border-nexus-800 text-nexus-300 hover:text-nexus-100 flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 cursor-pointer ${className || ''}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-700 hover:text-emerald-600 transition-colors" />
      )}
    </button>
  );
}
