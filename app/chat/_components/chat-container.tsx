'use client';

import { ReactNode } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ChatContainerProps {
  title?: string;
  children?: ReactNode;
  inputArea?: ReactNode;
  onClearChat?: () => void;
  onNewChat?: () => void;
  className?: string;
}

/**
 * ChatContainer - Main chat wrapper with title bar
 *
 * Specifications:
 * - Background: white card
 * - Border-radius: 16px
 * - Shadow: shadow-sm
 * - Title bar with "Super Chat" and action buttons (Clear Chat, New Chat)
 * - Scrollable messages area
 * - Input area at bottom
 */
export function ChatContainer({
  title = 'Super Chat',
  children,
  inputArea,
  onClearChat,
  onNewChat,
  className,
}: ChatContainerProps) {
  return (
    <div className={`flex flex-col flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-zinc-800 overflow-hidden h-[calc(100vh-64px-48px)] mt-5 transition-colors duration-200 ${className || ''}`}>
      {/* Title Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">{title}</h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Clear chat"
          >
            <Trash2 size={16} />
            <span>Clear Chat</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-zinc-700 hover:bg-gray-700 dark:hover:bg-zinc-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="New chat"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">{children}</div>
      </div>

      {/* Input Area */}
      {inputArea && (
        <div className="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-zinc-700">{inputArea}</div>
      )}
    </div>
  );
}

export default ChatContainer;
