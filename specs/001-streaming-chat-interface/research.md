# Research: Streaming Chat Interface

**Feature**: 001-streaming-chat-interface
**Date**: 2026-01-29

## Research Questions

### 1. OpenAI ChatKit Integration with Custom Backend

**Decision**: Use `@openai/chatkit-react` with custom API configuration pointing to FastAPI backend

**Rationale**:
- Constitution mandates ChatKit for AI integration
- ChatKit supports `CustomApiConfig` for self-hosted backends
- Backend already returns OpenAI-compatible streaming responses

**Alternatives Considered**:
- Vercel AI SDK (`ai` package): Simpler integration for custom backends, but constitution specifies ChatKit
- Raw fetch with SSE parsing: More control but reinvents ChatKit's state management

**Implementation Notes**:
ChatKit requires specific SSE event types for proper rendering:
- `thread.item.added` - New message
- `thread.item.updated` - Streaming text deltas
- `thread.item.done` - Message complete

If the backend doesn't emit these exact events, we'll need a **translation layer** or use ChatKit in "headless" mode with custom rendering.

### 2. Backend API Contract

**Decision**: Connect directly to `POST /chat/stream` endpoint via `NEXT_PUBLIC_CHAT_API_URL` environment variable

**Rationale**:
- Constitution Rule II.2 mandates direct connection (no intermediary API routes)
- Environment variable ensures deployment flexibility (localhost for dev, production URL for deploy)

**Expected Request Format** (OpenAI-compatible):
```typescript
{
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  stream: true
}
```

**Expected Response Format** (SSE stream):
```
data: {"choices":[{"delta":{"content":"..."}}]}
data: {"choices":[{"delta":{"tool_calls":[...]}}]}
data: [DONE]
```

### 3. State Management Approach

**Decision**: ChatKit handles message history; `useRef` for UI-only state

**Rationale**:
- FR-011 prohibits useState for main chat log
- Constitution IV.1 forbids useState for form inputs
- ChatKit's built-in state handles conversation history, streaming state, and error recovery

**Implementation**:
```typescript
// ChatKit manages:
const { messages, isLoading, error, sendMessage } = useChatKit(config);

// useRef for UI-only (no re-renders needed):
const inputRef = useRef<HTMLTextAreaElement>(null);
const scrollRef = useRef<HTMLDivElement>(null);
```

### 4. Thinking/Tool State Detection

**Decision**: Parse SSE events for state indicators based on event type or content markers

**Rationale**:
- Backend signals thinking/tool states via specific SSE event types or content prefixes
- ChatKit's `onResponseStart`/`onResponseEnd` callbacks detect response lifecycle

**Implementation Approach**:
1. Use `onResponseStart` to show thinking indicator
2. Parse `tool_calls` in delta events to show tool execution status
3. Use `onResponseEnd` to hide all indicators and finalize message

### 5. Markdown Rendering

**Decision**: Use `react-markdown` with `remark-gfm` for GitHub-flavored markdown

**Rationale**:
- Industry standard for markdown in React
- Supports code blocks, tables, lists, emphasis
- Lightweight and well-maintained

**Alternatives Considered**:
- `marked` + `DOMPurify`: More manual setup, SSR considerations
- ChatKit built-in rendering: May be available, but custom rendering gives more control

### 6. Error Handling & Retry

**Decision**: Preserve last message on error; display retry button that resends

**Rationale**:
- FR-009 and clarifications require retry functionality
- Better UX than requiring user to retype message

**Implementation**:
```typescript
const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

const handleRetry = () => {
  if (lastUserMessage) {
    sendMessage(lastUserMessage);
  }
};
```

Note: This is the one exception where local state is acceptable (storing the last message for retry is not "main chat log").

## Technology Decisions Summary

| Area | Technology | Version |
|------|------------|---------|
| Chat State | @openai/chatkit-react | latest |
| Markdown | react-markdown | ^9.x |
| Markdown Extensions | remark-gfm | ^4.x |
| Icons | lucide-react | ^0.400+ |
| Styling | Tailwind CSS | 4.x (already installed) |

## Dependencies to Install

```bash
npm install @openai/chatkit-react react-markdown remark-gfm lucide-react
```

## Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| ChatKit protocol mismatch with backend | If events don't align, implement translation layer or use "headless" mode with custom message list rendering |
| Streaming performance | Use React 19 concurrent features; avoid unnecessary re-renders via useRef for scroll position |
| Backend not available during dev | Provide mock endpoint or graceful error state |
