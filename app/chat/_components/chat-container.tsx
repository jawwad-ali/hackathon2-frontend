'use client';

import { ReactNode } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ChatContainerProps {
  title?: string;
  children?: ReactNode;
  inputArea?: ReactNode;
  onClearChat?: () => void;
  onNewChat?: () => void;
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
}: ChatContainerProps) {
  return (
    <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-64px-48px)] mt-5">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button
            onClick={onClearChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Clear chat"
          >
            <Trash2 size={16} />
            <span>Clear Chat</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
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
        <div className="px-6 pb-6 pt-4 border-t border-gray-200">{inputArea}</div>
      )}
    </div>
  );
}

export default ChatContainer;
