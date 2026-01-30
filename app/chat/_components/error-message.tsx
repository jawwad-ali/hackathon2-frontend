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
      className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full shrink-0">
        <AlertCircle size={16} className="text-red-500" aria-hidden="true" />
      </div>

      {/* Error Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800 break-words">
          {error.message}
        </p>
        {error.code && error.code !== 'unknown' && (
          <p className="text-xs text-red-600 mt-0.5">
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
            text-sm font-medium text-red-700
            bg-red-100 hover:bg-red-200
            rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            shrink-0
          "
          aria-label="Retry the last message"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
