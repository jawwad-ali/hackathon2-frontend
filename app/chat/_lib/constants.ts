
export const EXAMPLE_PROMPTS = [
  'What can you help me with?',
  'Add a new todo item',
  'Show me my todo list',
  'Help me organize my tasks',
] as const;

export type ExamplePrompt = (typeof EXAMPLE_PROMPTS)[number];

export const UI_TEXT = {
  welcomeTitle: 'AI Todo Assistant',
  welcomeSubtitle: 'How can I help you today?',
  inputPlaceholder: 'Type a message...',
  thinkingText: 'Thinking...',
  newChatButton: 'New Chat',
  retryButton: 'Retry',
  sendButton: 'Send',
} as const;

export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  update_todo: 'Updating todo...',
  create_todo: 'Creating todo...',
  delete_todo: 'Deleting todo...',
  list_todos: 'Fetching todos...',
  default: 'Processing...',
};

export function getToolDisplayName(toolName: string): string {
  return TOOL_DISPLAY_NAMES[toolName] || TOOL_DISPLAY_NAMES.default;
}

/**
 * User-friendly error messages for tool execution failures.
 * These messages hide technical details and provide helpful context.
 */
export const TOOL_ERROR_MESSAGES: Record<string, string> = {
  update_todo: 'Unable to update the todo item. Please try again.',
  create_todo: 'Unable to create the todo item. Please try again.',
  delete_todo: 'Unable to delete the todo item. Please try again.',
  list_todos: 'Unable to fetch your todos. Please try again.',
  default: 'Something went wrong. Please try again.',
};

/**
 * Get a user-friendly error message for a failed tool.
 * Never exposes technical details to the user.
 */
export function getToolErrorMessage(toolName: string): string {
  return TOOL_ERROR_MESSAGES[toolName] || TOOL_ERROR_MESSAGES.default;
}
