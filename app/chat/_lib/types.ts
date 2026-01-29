export interface MessageError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface ToolExecution {
  id: string;
  name: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  arguments?: Record<string, unknown>;
  result?: unknown;
  startedAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;

  // Optional metadata
  isStreaming?: boolean;
  toolCalls?: ToolExecution[];
  thinkingState?: 'thinking' | 'complete';
  error?: MessageError;
}

export type StreamState =
  | { status: 'idle' }
  | { status: 'thinking' }
  | { status: 'streaming'; partialContent: string }
  | { status: 'tool-executing'; tool: ToolExecution }
  | { status: 'error'; error: MessageError };

export interface ChatWindowProps {
  className?: string;
}

export interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

export interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  examplePrompts: readonly string[];
}
export interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export interface ThinkingIndicatorProps {
  visible: boolean;
}

export interface ToolStatusProps {
  tool: ToolExecution;
}

export interface ErrorMessageProps {
  error: MessageError;
  onRetry: () => void;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamState: StreamState;
  onPromptClick: (prompt: string) => void;
}

export interface NewChatButtonProps {
  onNewChat: () => void;
  disabled?: boolean;
}

export interface ChatConfig {
  apiUrl: string;
}
