'use client';

import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';
import { ThinkingIndicator } from './thinking-indicator';
import { ToolStatus } from './tool-status';
import { WelcomeScreen } from './welcome-screen';
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
  onRetry,
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
        {/* Empty state - Welcome screen with example prompts (T019-T021) */}
        {isEmpty && <WelcomeScreen onPromptClick={onPromptClick} />}

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

        {/* Thinking indicator - uses dedicated component with smooth animations */}
        <ThinkingIndicator visible={showThinking} />

        {/* Tool execution indicator - uses dedicated ToolStatus component */}
        {currentTool && <ToolStatus tool={currentTool} />}

        {/* Error state with conditional retry button */}
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
            {/* Only show retry button when error is retryable */}
            {streamState.error.retryable && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* End marker for auto-scroll */}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
}

export default MessageList;
