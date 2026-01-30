'use client';

import { Plus } from 'lucide-react';
import type { NewChatButtonProps } from '../_lib/types';

/**
 * NewChatButton - Starts a new conversation
 *
 * Features (FR-013):
 * - Clears all messages
 * - Returns to welcome state with example prompts
 * - Disabled while streaming to prevent data loss
 *
 * Design:
 * - Dark button matching the UI theme
 * - Plus icon for visual indication
 * - Responsive: icon-only on mobile, icon + text on desktop
 */
export function NewChatButton({ onNewChat, disabled = false }: NewChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onNewChat}
      disabled={disabled}
      className="
        flex items-center justify-center sm:justify-start
        gap-0 sm:gap-2
        w-9 h-9 sm:w-auto sm:h-auto
        sm:px-3 sm:py-2
        text-sm font-medium text-white
        bg-gray-800 hover:bg-gray-700
        rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      "
      aria-label="Start a new chat"
    >
      <Plus size={16} aria-hidden="true" />
      <span className="hidden sm:inline">New Chat</span>
    </button>
  );
}

export default NewChatButton;
