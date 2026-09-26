'use client';

import React from 'react';
import { useSpeech } from '@/lib/speech/use-speech';
import { Volume2, Pause, Play, Square } from 'lucide-react';

export interface ListenButtonProps {
  id: string;
  text: string | (() => string);
  label?: string;
  size?: 'xs' | 'sm';
  variant?: 'default' | 'compact' | 'subtle';
  className?: string;
  stopOnUnmount?: boolean;
}

export function ListenButton({
  id,
  text,
  label = 'Listen',
  size = 'sm',
  variant = 'default',
  className = '',
  stopOnUnmount = true,
}: ListenButtonProps) {
  const { isSupported, isSpeaking, isPaused, speak, pause, resume, stop } = useSpeech({
    id,
    stopOnUnmount,
  });

  // Gracefully hide if Web Speech API is not supported in the user's browser
  if (!isSupported) {
    return null;
  }

  const resolveText = (): string => {
    return typeof text === 'function' ? text() : text;
  };

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = resolveText();
    speak(content);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    pause();
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    resume();
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  const sizeClasses =
    size === 'xs'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  const iconSizeClass = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  // IDLE STATE: [ 🔊 Listen ]
  if (!isSpeaking && !isPaused) {
    return (
      <button
        type="button"
        onClick={handleListen}
        className={`inline-flex items-center font-mono font-medium rounded-full border transition-all cursor-pointer select-none shrink-0 ${
          variant === 'compact'
            ? 'border-rose-500/25 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-white'
            : variant === 'subtle'
            ? 'border-nexus-800 bg-nexus-850/80 text-nexus-300 hover:bg-nexus-800 hover:text-white'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-white shadow-xs'
        } ${sizeClasses} ${className}`}
        aria-label={`Listen to ${label.toLowerCase()} aloud`}
        title={`Listen to ${label.toLowerCase()} aloud`}
      >
        <Volume2 className={`${iconSizeClass} text-rose-400 shrink-0`} />
        <span>{label}</span>
      </button>
    );
  }

  // ACTIVE PLAYBACK STATE: [ ⏸ Pause ] [ ■ Stop ] or [ ▶ Resume ] [ ■ Stop ]
  return (
    <div
      className={`inline-flex items-center gap-1 p-0.5 rounded-full border bg-nexus-900 border-nexus-750 shadow-sm transition-all select-none shrink-0 ${className}`}
      role="group"
      aria-label="Speech playback controls"
    >
      <span className="sr-only" aria-live="polite">
        {isSpeaking ? 'Voice playback in progress' : 'Voice playback paused'}
      </span>

      {isSpeaking ? (
        <button
          type="button"
          onClick={handlePause}
          className={`inline-flex items-center font-mono font-medium rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 transition-all cursor-pointer ${sizeClasses}`}
          aria-label="Pause voice playback"
          title="Pause voice playback"
        >
          <span className="relative flex h-2 w-2 mr-0.5">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400"></span>
          </span>
          <Pause className={`${iconSizeClass} shrink-0`} />
          <span>Pause</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleResume}
          className={`inline-flex items-center font-mono font-medium rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer ${sizeClasses}`}
          aria-label="Resume voice playback"
          title="Resume voice playback"
        >
          <Play className={`${iconSizeClass} shrink-0`} />
          <span>Resume</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleStop}
        className="inline-flex items-center justify-center rounded-full text-nexus-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer p-1"
        aria-label="Stop voice playback"
        title="Stop voice playback"
      >
        <Square className={`${iconSizeClass} fill-current shrink-0`} />
      </button>
    </div>
  );
}
