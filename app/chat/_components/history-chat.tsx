'use client';

import { Copy, MessageCircle } from 'lucide-react';
import { mockHistoryItems } from '../_lib/design-tokens';

interface HistoryChatProps {
  onSelectHistory?: (text: string) => void;
}

/**
 * HistoryChat - Chat history sidebar section
 *
 * Design Specifications:
 * - White card background, rounded-2xl
 * - Section header: "History Chat" + copy icon
 * - History items: Light gray bg, icon + text (line-clamp-2)
 * - Hover: Light emerald background
 */
export function HistoryChat({ onSelectHistory }: HistoryChatProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm dark:shadow-none dark:border dark:border-zinc-800 transition-colors duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">History Chat</h2>
        <button
          className="p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95"
          aria-label="Copy history"
        >
          <Copy size={18} className="text-gray-500 dark:text-zinc-400" />
        </button>
      </div>

      {/* History Items */}
      <div className="flex flex-col gap-2">
        {mockHistoryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectHistory?.(item.text)}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-left transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-900 dark:text-zinc-100 line-clamp-2">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryChat;
