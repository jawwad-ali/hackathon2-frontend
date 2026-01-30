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
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">History Chat</h2>
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          aria-label="Copy history"
        >
          <Copy size={18} className="text-gray-500" />
        </button>
      </div>

      {/* History Items */}
      <div className="flex flex-col gap-2">
        {mockHistoryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectHistory?.(item.text)}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-left transition-colors hover:bg-emerald-50"
          >
            <MessageCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-900 line-clamp-2">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryChat;
