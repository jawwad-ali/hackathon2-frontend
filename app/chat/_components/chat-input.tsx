'use client';

import { useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import type { ChatInputProps } from '../_lib/types';

/**
 * ChatInput - Message input component using useRef pattern
 */
export function ChatInput({
  onSubmit,
  disabled,
  placeholder = 'Ask or search anything',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      const message = textarea.value.trim();
      if (!message || disabled) return;

      onSubmit(message);
      textarea.value = '';
      textarea.style.height = 'auto';
    },
    [onSubmit, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = 120;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {/* Input Container - responsive padding */}
      <div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800">
        {/* Textarea - completely borderless with inline style override */}
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={1}
          aria-label="Message input"
          aria-disabled={disabled}
          style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
          className="w-full resize-none bg-transparent text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[24px] max-h-[100px] sm:max-h-[120px] !outline-none !ring-0 !border-0"
        />

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Hint Text - shows different text when disabled */}
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            {disabled ? 'Waiting for response...' : 'Press Enter to send'}
          </span>

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled}
            aria-label={disabled ? 'Sending message...' : 'Send message'}
            aria-busy={disabled}
            className="flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400 disabled:hover:bg-gray-400"
            style={{ outline: 'none' }}
          >
            {disabled ? (
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput;
