'use client';

import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';
import { useAutoScroll } from '../_hooks';
import type { MessageListProps } from '../_lib/types';
import type { ToolExecution } from '../_lib/types';

/**
 * MessageList - Renders messages with auto-scroll functionality
 *
 * Features:
 * - Renders user and assistant messages
 * - Auto-scrolls to bottom on new messages
 * - Respects user scroll position (pauses auto-scroll when user scrolls up)
 * - Shows thinking indicator during agent reasoning
 * - Shows tool execution status
 * - Shows welcome screen when empty
 * - Shows error state
 */
export function MessageList({
  messages,
  isLoading,
  streamState,
  onPromptClick,
}: MessageListProps) {
  const { scrollRef, endRef } = useAutoScroll({
    threshold: 100,
    behavior: 'smooth',
  });

  // Determine states
  const showThinking = streamState.status === 'thinking';
  const currentTool: ToolExecution | null =
    streamState.status === 'tool-executing' ? streamState.tool : null;
  const hasError = streamState.status === 'error';
  const isEmpty = messages.length === 0 && !showThinking && !isLoading;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-3 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Empty state - Welcome message */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12 px-4">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full mb-3 sm:mb-4">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Welcome to Super Chat
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-md mb-4 sm:mb-6">
              Start a conversation by typing a message below. I can help you with
              questions, tasks, and more.
            </p>

            {/* Example prompts - stack on mobile, wrap on larger screens */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center w-full sm:max-w-lg">
              {['What can you help me with?', 'Tell me a joke', 'Explain AI briefly'].map(
                (prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onPromptClick(prompt)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-colors w-full sm:w-auto"
                  >
                    {prompt}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Render messages */}
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserMessage key={msg.id} content={msg.content} />
          ) : (
            <AssistantMessage
              key={msg.id}
              content={msg.content}
              isStreaming={msg.isStreaming}
            />
          )
        )}

        {/* Thinking indicator */}
        {showThinking && (
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-full shrink-0">
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm" aria-live="polite">
              Thinking...
            </span>
          </div>
        )}

        {/* Tool execution indicator */}
        {currentTool && (
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full shrink-0">
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm" aria-live="polite">
              Executing: {currentTool.name}...
            </span>
          </div>
        )}

        {/* Error state */}
        {hasError && streamState.status === 'error' && (
          <div
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full shrink-0">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {streamState.error.message}
              </p>
            </div>
          </div>
        )}

        {/* End marker for auto-scroll */}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
}

export default MessageList;
