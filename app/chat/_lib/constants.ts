
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
