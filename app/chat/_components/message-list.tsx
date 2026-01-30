'use client';

import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';
import { ThinkingIndicator } from './thinking-indicator';
import { ToolStatus } from './tool-status';
import { WelcomeScreen } from './welcome-screen';
import { ErrorMessage } from './error-message';
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

        {/* Error state - uses dedicated ErrorMessage component (T022) */}
        {hasError && streamState.status === 'error' && onRetry && (
          <ErrorMessage error={streamState.error} onRetry={onRetry} />
        )}

        {/* End marker for auto-scroll */}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
}

export default MessageList;
