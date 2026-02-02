# Data Model: Streaming Chat Interface

**Feature**: 001-streaming-chat-interface
**Date**: 2026-01-29

## Overview

This document defines the TypeScript types used in the streaming chat interface. These types map to the Key Entities defined in the specification.

## Core Types

### Message

Represents a single message in the conversation.

```typescript
interface Message {
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

interface MessageError {
  code: string;
  message: string;
  retryable: boolean;
}
```

**Validation Rules**:
- `id` must be unique within a conversation
- `content` may be empty during streaming (grows as tokens arrive)
- `role` is constrained to user or assistant (system messages handled by backend)

### Conversation (Ephemeral)

The conversation is managed by ChatKit's internal state. We do not persist it.

```typescript
// Conceptual - managed by ChatKit
interface Conversation {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}
```

**Note**: Per clarification, conversation is ephemeral and lost on page refresh.

### ToolExecution

Metadata about a tool being executed by the Agent.

```typescript
interface ToolExecution {
  id: string;
  name: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  arguments?: Record<string, unknown>;
  result?: unknown;
  startedAt: Date;
  completedAt?: Date;
}
```

**State Transitions**:
```
pending → executing → completed
                   → failed
```

### StreamState

Current state of the response stream for UI rendering.

```typescript
type StreamState =
  | { status: 'idle' }
  | { status: 'thinking' }
  | { status: 'streaming'; partialContent: string }
  | { status: 'tool-executing'; tool: ToolExecution }
  | { status: 'error'; error: MessageError };
```

## UI Component Props

### ChatWindowProps

```typescript
interface ChatWindowProps {
  className?: string;
}
```

### MessageBubbleProps

```typescript
interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}
```

### WelcomeScreenProps

```typescript
interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  examplePrompts: string[];
}
```

### ChatInputProps

```typescript
interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}
```

### ThinkingIndicatorProps

```typescript
interface ThinkingIndicatorProps {
  visible: boolean;
}
```

### ToolStatusProps

```typescript
interface ToolStatusProps {
  tool: ToolExecution;
}
```

### ErrorMessageProps

```typescript
interface ErrorMessageProps {
  error: MessageError;
  onRetry: () => void;
}
```

## Configuration Types

### ChatConfig

```typescript
interface ChatConfig {
  apiUrl: string;
  // Future: auth tokens, model selection, etc.
}

// Runtime configuration from environment
const chatConfig: ChatConfig = {
  apiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/chat/stream',
};
```

## Example Prompt Data

```typescript
const EXAMPLE_PROMPTS = [
  "What can you help me with?",
  "Add a new todo item",
  "Show me my todo list",
  "Help me organize my tasks",
] as const;

type ExamplePrompt = typeof EXAMPLE_PROMPTS[number];
```
