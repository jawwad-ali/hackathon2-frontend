'use client';

import { Zap } from 'lucide-react';

interface AssistantMessageProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * AssistantMessage - Left-aligned message with avatar
 *
 * Design Specifications:
 * - Layout: Avatar + Content (horizontal, flex-start aligned)
 * - Avatar: 36x36, emerald green circle, lightning bolt icon
 * - Content: Light gray background, rounded corners
 * - Max-width: 70%
 */
export function AssistantMessage({ content, isStreaming }: AssistantMessageProps) {
  return (
    <div className="flex gap-3 items-start">
      {/* Avatar */}
      <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-full shrink-0">
        <Zap size={18} className="text-white fill-white" />
      </div>

      {/* Content Bubble */}
      <div
        className={`
          max-w-[70%] px-4 py-3 bg-gray-100 text-gray-900
          rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl
          text-sm leading-relaxed
          ${isStreaming ? 'animate-pulse' : ''}
        `}
      >
        {content || (isStreaming && (
          <span className="text-gray-400">...</span>
        ))}

        {/* Streaming indicator */}
        {isStreaming && content && (
          <span className="inline-block w-2 h-2 ml-1 bg-emerald-500 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default AssistantMessage;
