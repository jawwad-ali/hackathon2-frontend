'use client';

import { Zap } from 'lucide-react';
import type { ThinkingIndicatorProps } from '../_lib/types';

/**
 * ThinkingIndicator - Shows when the AI agent is thinking/reasoning
 *
 * Features:
 * - Animated spinner in avatar
 * - Pulsing dots animation for "thinking" text
 * - Smooth fade in/out transitions (controlled by parent)
 * - Accessible with aria-live for screen readers
 *
 * Design:
 * - Matches AssistantMessage layout (avatar + content)
 * - Emerald green avatar with spinner
 * - Animated dots that pulse sequentially
 */
export function ThinkingIndicator({ visible }: ThinkingIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className="flex items-start gap-2 sm:gap-3 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label="AI is thinking"
    >
      {/* Avatar with spinning indicator */}
      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-full shrink-0 relative">
        {/* Spinning border */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/50 animate-spin"
          aria-hidden="true"
        />
        {/* Zap icon */}
        <Zap size={16} className="text-white fill-white sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
      </div>

      {/* Thinking text with animated dots */}
      <div className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 dark:bg-zinc-800 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl transition-colors duration-200">
        <span className="text-sm text-gray-600 dark:text-zinc-400">Thinking</span>
        <span className="flex gap-0.5" aria-hidden="true">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce-dot-1" />
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce-dot-2" />
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce-dot-3" />
        </span>
      </div>
    </div>
  );
}

export default ThinkingIndicator;
