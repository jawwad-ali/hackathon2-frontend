---
id: 005
title: Implement ChatWindow Component with ChatKit
stage: green
date: 2026-01-30
surface: agent
model: claude-opus-4-5-20251101
feature: 001-streaming-chat-interface
branch: 001-streaming-chat-interface
user: user
command: /sp.implement
labels: ["implementation", "chatkit", "react", "T006"]
links:
  spec: specs/001-streaming-chat-interface/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - app/chat/_components/chat-window.tsx
  - app/chat/_components/index.ts
tests:
  - TypeScript compilation check (passed)
---

## Prompt

Load your NextJS skill and Implement task T006 carefully

## Response snapshot

Implemented T006 - Created ChatWindow client component shell with useChatKit hook integration.

Key implementation details:
1. Created `app/chat/_components/chat-window.tsx` as a Client Component ('use client')
2. Integrated `useChatKit` hook from `@openai/chatkit-react`
3. Configured CustomApiConfig with:
   - `url`: from `chatConfig.apiUrl` (environment variable)
   - `domainKey`: 'local-dev'
4. Set up ChatKit options:
   - Dark theme
   - Start screen with greeting and example prompts from constants
   - Composer with custom placeholder
   - Header with title and "New Chat" button (compose icon)
5. Added event handlers: `onResponseStart`, `onResponseEnd`, `onError`
6. Created barrel export in `app/chat/_components/index.ts`
7. Verified TypeScript compilation passes

The component follows constitution requirements:
- No useState for chat log (ChatKit manages state)
- Direct connection to backend (no intermediary API routes)
- Client Component for interactivity

## Outcome

- Impact: Created foundational chat component that blocks US1-US4
- Tests: TypeScript compilation passed
- Files: 2 files created (chat-window.tsx, index.ts)
- Next prompts: T007 (update page.tsx), T008 (auto-scroll hook)
- Reflection: ChatKit provides built-in UI, may need protocol adaptation layer if backend uses OpenAI format instead of ChatKit protocol

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify ChatKit renders correctly in browser
