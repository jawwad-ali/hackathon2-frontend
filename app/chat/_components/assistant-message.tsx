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
    <div className="flex gap-2 sm:gap-3 items-start">
      {/* Avatar - slightly smaller on mobile */}
      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-full shrink-0">
        <Zap size={16} className="text-white fill-white sm:w-[18px] sm:h-[18px]" />
      </div>

      {/* Content Bubble - wider on mobile for readability */}
      <div
        className={`
          max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-900
          rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl
          text-sm leading-relaxed break-words
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
