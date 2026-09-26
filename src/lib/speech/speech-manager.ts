/**
 * NEXUS Global Speech Manager
 * Encapsulates the browser's native Web Speech API (window.speechSynthesis)
 * ensuring strictly ONE active voice playback session across the entire application.
 */

import { sanitizeSpeechText } from './sanitize-speech-text';

export type SpeechPlaybackStatus = 'idle' | 'speaking' | 'paused';

export interface SpeechState {
  activeId: string | null;
  status: SpeechPlaybackStatus;
  isSupported: boolean;
}

type SpeechSubscriber = (state: SpeechState) => void;

class SpeechManager {
  private activeId: string | null = null;
  private status: SpeechPlaybackStatus = 'idle';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private subscribers: Set<SpeechSubscriber> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  constructor() {
    if (this.isSpeechSupported()) {
      this.initVoices();
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => this.stop());
        window.addEventListener('pagehide', () => this.stop());
      }
    }
  }

  public isSpeechSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      Boolean(window.speechSynthesis) &&
      'SpeechSynthesisUtterance' in window
    );
  }

  private initVoices(): void {
    if (!this.isSpeechSupported()) return;

    try {
      this.voices = window.speechSynthesis.getVoices() || [];
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
          this.voicesLoaded = true;
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }
  }

  /**
   * Select a natural English voice if available, falling back to browser default.
   */
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      if (this.isSpeechSupported()) {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch {
          return null;
        }
      }
    }

    if (!this.voices || this.voices.length === 0) return null;

    // Prefer English voices: Natural / Neural / High quality, then standard en-US / en-GB
    const englishVoices = this.voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));

    if (englishVoices.length === 0) {
      return this.voices.find((v) => v.default) || this.voices[0] || null;
    }

    const preferredVoice =
      englishVoices.find((v) => /natural|neural|google|samantha|karen|daniel/i.test(v.name)) ||
      englishVoices.find((v) => v.default) ||
      englishVoices[0];

    return preferredVoice || null;
  }

  public getState(): SpeechState {
    return {
      activeId: this.activeId,
      status: this.status,
      isSupported: this.isSpeechSupported(),
    };
  }

  public subscribe(callback: SpeechSubscriber): () => void {
    this.subscribers.add(callback);
    // Immediately emit current state to new subscriber
    callback(this.getState());

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    const state = this.getState();
    for (const callback of this.subscribers) {
      try {
        callback(state);
      } catch {
        // Prevent subscriber errors from crashing speech manager
      }
    }
  }

  /**
   * Speak a text string under a unique caller ID.
   * Cancels any prior playback before starting.
   */
  public speak(id: string, rawText: string): boolean {
    if (!this.isSpeechSupported()) return false;

    // Stop any existing speech across the whole application
    this.stop();

    const cleanText = sanitizeSpeechText(rawText);
    if (!cleanText) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = this.getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.status = 'speaking';
        this.notify();
      };

      utterance.onpause = () => {
        this.status = 'paused';
        this.notify();
      };

      utterance.onresume = () => {
        this.status = 'speaking';
        this.notify();
      };

      utterance.onend = () => {
        if (this.activeId === id) {
          this.activeId = null;
          this.status = 'idle';
          this.currentUtterance = null;
          this.notify();
        }
      };

      utterance.onerror = (e) => {
        // If canceled intentionally, ignore
        if (e.error === 'canceled' || e.error === 'interrupted') {
          return;
        }
        if (this.activeId === id) {
          this.activeId = null;
          this.status = 'idle';
          this.currentUtterance = null;
          this.notify();
        }
      };

      this.activeId = id;
      this.status = 'speaking';
      this.currentUtterance = utterance;

      window.speechSynthesis.speak(utterance);
      this.notify();
      return true;
    } catch {
      this.activeId = null;
      this.status = 'idle';
      this.currentUtterance = null;
      this.notify();
      return false;
    }
  }

  /**
   * Pause the active speech session
   */
  public pause(): void {
    if (!this.isSpeechSupported()) return;

    try {
      if (this.status === 'speaking') {
        window.speechSynthesis.pause();
        this.status = 'paused';
        this.notify();
      }
    } catch {
      // ignore
    }
  }

  /**
   * Resume the active speech session
   */
  public resume(): void {
    if (!this.isSpeechSupported()) return;

    try {
      if (this.status === 'paused') {
        window.speechSynthesis.resume();
        this.status = 'speaking';
        this.notify();
      }
    } catch {
      // ignore
    }
  }

  /**
   * Stop any active speech playback globally
   */
  public stop(): void {
    if (!this.isSpeechSupported()) return;

    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }

    if (this.activeId !== null || this.status !== 'idle') {
      this.activeId = null;
      this.status = 'idle';
      this.currentUtterance = null;
      this.notify();
    }
  }

  /**
   * Stop speech only if the specified ID is the one currently speaking
   */
  public stopIfActive(id: string): void {
    if (this.activeId === id) {
      this.stop();
    }
  }
}

// Global Singleton Instance
export const speechManager = new SpeechManager();
