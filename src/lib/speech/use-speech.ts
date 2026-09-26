'use client';

import { useState, useEffect, useCallback } from 'react';
import { speechManager, SpeechState, SpeechPlaybackStatus } from './speech-manager';

export interface UseSpeechOptions {
  id: string;
  stopOnUnmount?: boolean;
}

export interface UseSpeechReturn {
  isSupported: boolean;
  isActive: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  status: SpeechPlaybackStatus;
  globalStatus: SpeechPlaybackStatus;
  globalActiveId: string | null;
  speak: (text: string) => boolean;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggle: (text: string) => void;
}

export function useSpeech({ id, stopOnUnmount = true }: UseSpeechOptions): UseSpeechReturn {
  const [speechState, setSpeechState] = useState<SpeechState>(() => speechManager.getState());

  useEffect(() => {
    // Subscribe to global speech manager updates
    const unsubscribe = speechManager.subscribe((newState) => {
      setSpeechState(newState);
    });

    return () => {
      unsubscribe();
      if (stopOnUnmount) {
        speechManager.stopIfActive(id);
      }
    };
  }, [id, stopOnUnmount]);

  const isActive = speechState.activeId === id;
  const isSpeaking = isActive && speechState.status === 'speaking';
  const isPaused = isActive && speechState.status === 'paused';
  const status: SpeechPlaybackStatus = isActive ? speechState.status : 'idle';

  const speak = useCallback(
    (text: string) => {
      return speechManager.speak(id, text);
    },
    [id]
  );

  const pause = useCallback(() => {
    if (isActive) {
      speechManager.pause();
    }
  }, [isActive]);

  const resume = useCallback(() => {
    if (isActive) {
      speechManager.resume();
    }
  }, [isActive]);

  const stop = useCallback(() => {
    if (isActive) {
      speechManager.stop();
    }
  }, [isActive]);

  const toggle = useCallback(
    (text: string) => {
      if (isSpeaking) {
        pause();
      } else if (isPaused) {
        resume();
      } else {
        speak(text);
      }
    },
    [isSpeaking, isPaused, pause, resume, speak]
  );

  return {
    isSupported: speechState.isSupported,
    isActive,
    isSpeaking,
    isPaused,
    status,
    globalStatus: speechState.status,
    globalActiveId: speechState.activeId,
    speak,
    pause,
    resume,
    stop,
    toggle,
  };
}
