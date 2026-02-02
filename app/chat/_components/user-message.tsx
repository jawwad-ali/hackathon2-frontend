'use client';

interface UserMessageProps {
  content: string;
}

/**
 * UserMessage - Right-aligned message bubble
 *
 * Design Specifications:
 * - Layout: Right-aligned (justify-end)
 * - Bubble: Dark gray background, white text
 * - Border-radius: rounded except bottom-right
 * - Max-width: 70%
 */
export function UserMessage({ content }: UserMessageProps) {
  return (
    <div
      className="flex justify-end animate-slide-in-right"
      role="article"
      aria-label="Your message"
    >
      <div
        className="
          max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3
          bg-gray-800 dark:bg-emerald-600 text-white
          rounded-tl-2xl rounded-tr-2xl rounded-br-sm rounded-bl-2xl
          text-sm leading-relaxed break-words
          transition-all duration-200 hover:shadow-md
        "
      >
        {content}
      </div>
    </div>
  );
}

export default UserMessage;
