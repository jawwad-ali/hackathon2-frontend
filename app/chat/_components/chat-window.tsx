'use client';

import { useCallback } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';
import { HealthBanner } from './health-banner';
import { useStreamingChat, useHealthCheck } from '../_hooks';
import type { ChatWindowProps } from '../_lib/types';

/**
 * ChatWindow - Smart component that integrates useStreamingChat with the UI
 *
 * This component:
 * - Manages chat state via useStreamingChat hook
 * - Renders MessageList for messages with auto-scroll
 * - Renders ChatInput for message input
 * - Handles send, clear, and new chat actions
 * - Shows streaming state (thinking indicator, tool status, errors)
 */
export function ChatWindow({ className }: ChatWindowProps) {
  // Check backend health on mount
  const healthCheck = useHealthCheck();

  const {
    messages,
    streamState,
    sendMessage,
    clearMessages,
    isStreaming,
    retryLastMessage,
  } = useStreamingChat();

  const handleSendMessage = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const handleClearChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handleNewChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handlePromptClick = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const handleRetry = useCallback(() => {
    retryLastMessage();
  }, [retryLastMessage]);

  return (
    <div
      className={`flex flex-col flex-1 bg-white rounded-none sm:rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-56px)] sm:h-auto ${className || ''}`}
    >
      {/* Health status banner - shows when backend is degraded or unavailable */}
      <HealthBanner status={healthCheck.status} message={healthCheck.message} />

      {/* Title Bar - responsive padding and text */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Super Chat</h1>

        {/* Action Buttons - hide text on mobile, show icons only */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            disabled={isStreaming}
            className="flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Clear chat"
          >
            <Trash2 size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            disabled={isStreaming}
            className="flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="New chat"
          >
            <Plus size={16} aria-hidden="true" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Area with Auto-Scroll */}
      <MessageList
        messages={messages}
        isLoading={isStreaming}
        streamState={streamState}
        onPromptClick={handlePromptClick}
        onRetry={handleRetry}
      />

      {/* Input Area - responsive padding */}
      <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-200">
        <ChatInput
          onSubmit={handleSendMessage}
          disabled={isStreaming}
          placeholder={isStreaming ? 'Waiting for response...' : 'Ask or search anything'}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
