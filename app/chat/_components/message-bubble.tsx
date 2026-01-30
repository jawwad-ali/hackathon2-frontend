'use client';

import type { MessageBubbleProps } from '../_lib/types';
import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';

/**
 * MessageBubble - Wrapper component for message display
 *
 * Routes to appropriate component based on message role:
 * - User messages: Right-aligned, dark bubble
 * - Assistant messages: Left-aligned with avatar
 */
export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming && isLatest;

  if (isUser) {
    return <UserMessage content={message.content} />;
  }

  return (
    <AssistantMessage
      content={message.content}
      isStreaming={isStreaming}
    />
  );
}

export default MessageBubble;
