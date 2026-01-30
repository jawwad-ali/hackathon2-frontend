'use client';

import { Trash2, Plus } from 'lucide-react';

interface FloatingActionsProps {
  onClearChat: () => void;
  onNewChat: () => void;
}

/**
 * FloatingActions - Left floating action buttons
 *
 * Specifications:
 * - Position: relative to main content (not fixed)
 * - Clear Chat: Pill button with icon + text
 * - New Chat: Circular button with plus icon
 * - Shadow: shadow-md
 * - Hover: scale and color change
 */
export function FloatingActions({ onClearChat, onNewChat }: FloatingActionsProps) {
  return (
    <div className="hidden md:flex flex-col shrink-0 w-20 pt-24 gap-3">
      {/* Clear Chat Button */}
      <button
        onClick={onClearChat}
        className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-3xl shadow-md transition-all hover:scale-[1.02]"
        aria-label="Clear chat"
      >
        <Trash2 size={18} className="text-white shrink-0" />
        <span className="text-xs font-medium text-white whitespace-nowrap">
          Clear Chat
        </span>
      </button>

      {/* New Chat Button (Plus) */}
      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full shadow-md transition-all hover:scale-105"
        aria-label="New chat"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );
}

export default FloatingActions;
