'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import type { ErrorMessageProps } from '../_lib/types';

/**
 * ErrorMessage - Displays error state with optional retry button
 *
 * Features (FR-009):
 * - Clear error message display
 * - Retry button (only shown when error.retryable is true)
 * - Accessible with proper ARIA attributes
 * - Consistent styling with the chat UI
 *
 * Design:
 * - Red background for error state
 * - Alert icon for visual indication
 * - Retry button styled to match the UI
 */
export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-full shrink-0 animate-scale-in">
        <AlertCircle size={16} className="text-red-500 dark:text-red-400" aria-hidden="true" />
      </div>

      {/* Error Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800 dark:text-red-200 break-words">
          {error.message}
        </p>
        {error.code && error.code !== 'unknown' && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
            Error code: {error.code}
          </p>
        )}
      </div>

      {/* Retry Button - only shown when error is retryable */}
      {error.retryable && (
        <button
          type="button"
          onClick={onRetry}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-sm font-medium text-red-700 dark:text-red-300
            bg-red-100 dark:bg-red-800/40 hover:bg-red-200 dark:hover:bg-red-800/60
            rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            shrink-0
            hover:scale-105 active:scale-95
          "
          aria-label="Retry the last message"
        >
          <RefreshCw size={14} aria-hidden="true" className="transition-transform duration-300 hover:rotate-180" />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
