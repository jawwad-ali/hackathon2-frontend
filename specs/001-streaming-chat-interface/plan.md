# Implementation Plan: Streaming Chat Interface

**Branch**: `001-streaming-chat-interface` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-streaming-chat-interface/spec.md`

## Summary

Build a high-performance streaming chat interface using Next.js 15 App Router and OpenAI ChatKit. The interface connects to an existing FastAPI backend at `/chat/stream`, displays real-time streaming responses with thinking/tool state indicators, renders markdown content, and provides error recovery with retry functionality. Focus on a single polished chat route with under 10 implementation tasks.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.x, React 19.x, @openai/chatkit-react, react-markdown, lucide-react
**Storage**: N/A (ephemeral session, no persistence)
**Testing**: Manual testing with backend; E2E with Playwright (optional)
**Target Platform**: Web browsers (modern, supports SSE/fetch streaming)
**Project Type**: Web application (frontend only)
**Performance Goals**: First token < 500ms (excluding backend), streaming display < 100ms per token, page load < 3s
**Constraints**: No useState for chat log or form inputs; Server Components by default; direct backend connection
**Scale/Scope**: Single chat route, single conversation at a time, ephemeral state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance |
|-----------|-------------|------------|
| I.1 Primary Stack | Next.js 15, TypeScript, Tailwind CSS | PASS - Using Next.js 16, TS, Tailwind 4 |
| I.2 AI Integration | OpenAI ChatKit for streaming | PASS - Using @openai/chatkit-react |
| I.3 Package Management | npm exclusively | PASS - npm only |
| II.1 Server-First | Server Components by default, Client only for interactive leaves | PASS - layout/page are Server, chat components are Client |
| II.2 Direct Connection | ChatKit connects directly to backend, no intermediary routes | PASS - Direct to NEXT_PUBLIC_CHAT_API_URL |
| II.3 No Backend Duplication | No API routes duplicating FastAPI logic | PASS - No /api routes for chat |
| II.4 State Management | useRef for UI-only, ChatKit for messages | PASS - No useState for chat log |
| III.1 Code Quality | Clean, fully typed TypeScript | Will enforce during implementation |
| III.2 Visual Design | Minimalist, dark mode, smooth animations | Will implement |
| III.3 Streaming UI | Skeleton loaders, thinking states, token rendering | Required by spec |
| III.4 Accessibility | WCAG 2.1 AA | Will implement |
| IV.1 No useState for inputs | useRef for form fields | Will enforce |
| IV.2 No standard fetch for AI | ChatKit hooks only | Will use useChatKit |
| IV.3 No hardcoded URLs | Environment variables | PASS - NEXT_PUBLIC_CHAT_API_URL |
| IV.4 No Client at route level | page.tsx/layout.tsx are Server Components | PASS |

**Constitution Status**: All gates pass. Proceed with implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-streaming-chat-interface/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology research findings
├── data-model.md        # TypeScript types and interfaces
├── quickstart.md        # Developer setup guide
├── contracts/           # API contracts
│   └── backend-api.md   # Backend SSE contract
└── tasks.md             # Implementation tasks (next step)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                    # Root layout (Server Component)
├── page.tsx                      # Main chat page (Server Component)
├── globals.css                   # Tailwind imports + custom styles
└── chat/
    ├── _components/              # Client Components
    │   ├── chat-window.tsx       # Main chat container with ChatKit
    │   ├── chat-input.tsx        # Message input with useRef
    │   ├── message-list.tsx      # Scrollable message container
    │   ├── message-bubble.tsx    # Individual message with markdown
    │   ├── thinking-indicator.tsx # Animated thinking state
    │   ├── tool-status.tsx       # Tool execution status
    │   ├── welcome-screen.tsx    # Empty state with example prompts
    │   ├── error-message.tsx     # Error display with retry
    │   └── new-chat-button.tsx   # Reset conversation button
    ├── _lib/
    │   ├── types.ts              # TypeScript interfaces
    │   ├── config.ts             # Chat configuration
    │   └── constants.ts          # Example prompts, labels
    └── _hooks/
        └── use-auto-scroll.ts    # Auto-scroll hook with useRef
```

**Structure Decision**: Single Next.js frontend application. All chat functionality is contained within `app/chat/` with clear separation between Client Components (`_components/`), types (`_lib/`), and custom hooks (`_hooks/`).

## Complexity Tracking

No constitution violations requiring justification. Implementation follows all principles.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │           RootLayout (Server Component)              │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │            page.tsx (Server Component)         │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │      ChatWindow (Client Component)      │  │  │   │
│  │  │  │  ┌──────────┐  ┌──────────────────┐   │  │  │   │
│  │  │  │  │ ChatKit  │  │   MessageList    │   │  │  │   │
│  │  │  │  │  Hook    │  │  ┌────────────┐  │   │  │  │   │
│  │  │  │  │          │  │  │MessageBubble│  │   │  │  │   │
│  │  │  │  └──────────┘  │  │(Markdown)  │  │   │  │  │   │
│  │  │  │                │  └────────────┘  │   │  │  │   │
│  │  │  │  ┌──────────┐  │  ┌────────────┐  │   │  │  │   │
│  │  │  │  │ChatInput │  │  │Thinking    │  │   │  │  │   │
│  │  │  │  │(useRef)  │  │  │Indicator   │  │   │  │  │   │
│  │  │  │  └──────────┘  └──────────────────┘   │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SSE Stream (POST /chat/stream)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Existing)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            POST /chat/stream                         │   │
│  │  - Receives messages array                           │   │
│  │  - Returns SSE stream (OpenAI-compatible)            │   │
│  │  - Handles Agent reasoning, tool calls               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
app/
├── layout.tsx (Server)
│   └── page.tsx (Server)
│       └── ChatWindow (Client) ─────────────────┐
│           ├── Header                           │
│           │   └── NewChatButton               │
│           ├── MessageList                      │
│           │   ├── WelcomeScreen (when empty)  │
│           │   ├── MessageBubble[] (user)      │
│           │   ├── MessageBubble[] (assistant) │
│           │   │   └── Markdown renderer       │
│           │   ├── ThinkingIndicator           │
│           │   ├── ToolStatus                  │
│           │   └── ErrorMessage + RetryButton  │
│           └── ChatInput                        │
│               └── <textarea ref={inputRef}>   │
```

## Implementation Phases

### Phase 1: Foundation (Tasks 1-3)
- Install dependencies
- Create types and configuration
- Set up basic page structure

### Phase 2: Core Chat (Tasks 4-6)
- ChatKit integration
- Message display with markdown
- Chat input with streaming

### Phase 3: States & Indicators (Tasks 7-8)
- Thinking indicator
- Tool execution status

### Phase 4: Polish (Tasks 9-10)
- Welcome screen with prompts
- Error handling with retry
- New chat button

## Dependencies

```json
{
  "dependencies": {
    "@openai/chatkit-react": "latest",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "lucide-react": "^0.400.0"
  }
}
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat/stream
```

## Key Implementation Notes

1. **ChatKit Configuration**: If ChatKit's protocol doesn't align with the backend's OpenAI-compatible format, implement a thin translation layer or use ChatKit in "headless" mode with custom rendering.

2. **No useState for Chat**: All message state flows through ChatKit. Local state is only permitted for retry (storing last message) and ephemeral UI state (loading, error display).

3. **useRef Pattern**: Input field uses uncontrolled component pattern with useRef. Auto-scroll uses ref to container div.

4. **Streaming Display**: Messages append content as tokens arrive. Use CSS transitions for smooth text appearance.

5. **Error Recovery**: On network/backend error, preserve the user's last message and show retry button.

## Next Step

Run `/sp.tasks` to generate the detailed implementation task list.
