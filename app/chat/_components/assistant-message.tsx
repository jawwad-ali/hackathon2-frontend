'use client';

import type { Components } from 'react-markdown';
import { Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AssistantMessageProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Custom markdown components with Tailwind prose-like styling
 * T017: Headings, lists, paragraphs
 * T018: Code blocks with monospace font, background, padding
 */
const markdownComponents: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mt-4 mb-2 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mt-3 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 mt-3 mb-1 first:mt-0">{children}</h3>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-900 dark:text-zinc-100">{children}</li>
  ),

  // Inline code
  code: ({ className, children }) => {
    const isCodeBlock = className?.includes('language-');

    if (isCodeBlock) {
      return (
        <code className="block text-xs">{children}</code>
      );
    }

    // Inline code
    return (
      <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded text-xs font-mono transition-colors duration-200">
        {children}
      </code>
    );
  },

  // Code blocks (pre wraps code)
  pre: ({ children }) => (
    <pre className="my-2 p-3 bg-gray-800 dark:bg-zinc-900 text-gray-100 rounded-lg overflow-x-auto font-mono text-xs leading-relaxed transition-colors duration-200">
      {children}
    </pre>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  // Bold and italic
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-emerald-500 pl-3 my-2 text-gray-700 dark:text-zinc-300 italic">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-3 border-gray-300 dark:border-zinc-600" />
  ),

  // Tables (GFM)
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-200 dark:bg-zinc-700">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1 text-left font-semibold text-gray-900 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1 text-gray-800 dark:text-zinc-200 border border-gray-300 dark:border-zinc-600">{children}</td>
  ),
};

/**
 * AssistantMessage - Left-aligned message with avatar
 *
 * Design Specifications:
 * - Layout: Avatar + Content (horizontal, flex-start aligned)
 * - Avatar: 36x36, emerald green circle, lightning bolt icon
 * - Content: Light gray background, rounded corners
 * - Max-width: 70%
 * - Markdown: Full GFM support with prose-like styling
 */
export function AssistantMessage({ content, isStreaming }: AssistantMessageProps) {
  return (
    <div
      className="flex gap-2 sm:gap-3 items-start animate-slide-in-left"
      role="article"
      aria-label={isStreaming ? 'Assistant is responding' : 'Assistant message'}
    >
      {/* Avatar - slightly smaller on mobile */}
      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-full shrink-0 animate-scale-in transition-transform duration-200 hover:scale-105">
        <Zap size={16} className="text-white fill-white sm:w-[18px] sm:h-[18px]" />
      </div>

      {/* Content Bubble - wider on mobile for readability */}
      <div
        className={`
          max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3
          bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100
          rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl
          text-sm leading-relaxed break-words
          transition-all duration-200 hover:shadow-md
          ${isStreaming ? 'animate-gentle-pulse' : ''}
        `}
      >
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        ) : (
          isStreaming && <span className="text-gray-400">...</span>
        )}

        {/* Streaming cursor indicator */}
        {isStreaming && content && (
          <span className="inline-block w-0.5 h-4 ml-1 bg-emerald-500 rounded-sm animate-cursor-blink align-middle" />
        )}
      </div>
    </div>
  );
}

export default AssistantMessage;
