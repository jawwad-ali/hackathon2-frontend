'use client';

import { Wrench, Check, AlertCircle } from 'lucide-react';
import type { ToolStatusProps, ToolExecution } from '../_lib/types';
import { getToolDisplayName, getToolErrorMessage } from '../_lib/constants';

/**
 * Format tool arguments into a human-readable string.
 * Shows relevant details without overwhelming the user.
 */
function formatToolArguments(tool: ToolExecution): string | null {
  const args = tool.arguments;
  if (!args || Object.keys(args).length === 0) return null;

  switch (tool.name) {
    case 'create_todo': {
      const parts: string[] = [];
      if (args.title) parts.push(`'${args.title}'`);
      if (args.priority && args.priority !== 'medium') {
        parts.push(`${args.priority} priority`);
      }
      if (args.due_date) {
        // Format date nicely if possible
        try {
          const date = new Date(args.due_date as string);
          parts.push(`due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
        } catch {
          parts.push(`due ${args.due_date}`);
        }
      }
      if (args.tags && Array.isArray(args.tags) && args.tags.length > 0) {
        parts.push(`tags: ${(args.tags as string[]).join(', ')}`);
      }
      return parts.length > 0 ? parts.join(' • ') : null;
    }

    case 'update_todo': {
      const parts: string[] = [];
      if (args.todo_id) parts.push(`#${args.todo_id}`);
      if (args.status) parts.push(`→ ${args.status}`);
      if (args.priority) parts.push(`priority: ${args.priority}`);
      if (args.title) parts.push(`title: '${args.title}'`);
      return parts.length > 0 ? parts.join(' • ') : null;
    }

    case 'delete_todo': {
      if (args.todo_id) return `#${args.todo_id}`;
      if (args.todo_ids && Array.isArray(args.todo_ids)) {
        return `${(args.todo_ids as string[]).length} todos`;
      }
      return null;
    }

    case 'list_todos': {
      const parts: string[] = [];
      if (args.status) parts.push(`status: ${args.status}`);
      if (args.priority) parts.push(`priority: ${args.priority}`);
      if (args.limit) parts.push(`limit: ${args.limit}`);
      return parts.length > 0 ? parts.join(' • ') : 'all';
    }

    case 'search_todos': {
      if (args.keyword) return `"${args.keyword}"`;
      return null;
    }

    default:
      return null;
  }
}

/**
 * ToolStatus - Shows when the AI agent is executing a backend tool
 *
 * Features:
 * - Animated spinner during execution
 * - Tool name with friendly display text
 * - Success/failure states with icons
 * - Smooth fade in/out transitions
 * - Accessible with aria-live for screen readers
 *
 * Design:
 * - Blue avatar for tool execution (distinguishes from thinking)
 * - Shows tool name and status
 * - Checkmark when complete, X when failed
 */
export function ToolStatus({ tool }: ToolStatusProps) {
  const isExecuting = tool.status === 'executing' || tool.status === 'pending';
  const isCompleted = tool.status === 'completed';
  const isFailed = tool.status === 'failed';

  // Get friendly display name for the tool
  const displayText = getToolDisplayName(tool.name);

  // Get formatted arguments for display
  const formattedArgs = formatToolArguments(tool);

  // Determine avatar background color based on status
  const avatarBgColor = isFailed
    ? 'bg-red-500'
    : isCompleted
      ? 'bg-emerald-500'
      : 'bg-blue-500';

  return (
    <div
      className="flex items-start gap-2 sm:gap-3 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={`Tool ${tool.name} is ${tool.status}`}
    >
      {/* Avatar with status indicator */}
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 ${avatarBgColor} rounded-full shrink-0 relative transition-colors duration-300`}
      >
        {/* Spinning border during execution */}
        {isExecuting && (
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/50 animate-spin"
            aria-hidden="true"
          />
        )}

        {/* Icon based on status */}
        {isExecuting && (
          <Wrench size={16} className="text-white sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        )}
        {isCompleted && (
          <Check size={16} className="text-white sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        )}
        {isFailed && (
          <AlertCircle size={16} className="text-white sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        )}
      </div>

      {/* Status text */}
      <div
        className={`
          flex flex-col gap-1 px-3 sm:px-4 py-2 sm:py-3 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl
          ${isFailed ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'}
          transition-all duration-300
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isFailed ? getToolErrorMessage(tool.name) : displayText}
          </span>

          {/* Animated dots during execution */}
          {isExecuting && (
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce-dot-1" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce-dot-2" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce-dot-3" />
            </span>
          )}

          {/* Checkmark for completed */}
          {isCompleted && (
            <Check size={14} className="text-emerald-600" aria-hidden="true" />
          )}
        </div>

        {/* Tool arguments - show what's being processed */}
        {formattedArgs && !isFailed && (
          <span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-normal">
            {formattedArgs}
          </span>
        )}
      </div>
    </div>
  );
}

export default ToolStatus;
