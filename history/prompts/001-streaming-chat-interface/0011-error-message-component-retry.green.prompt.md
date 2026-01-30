---
id: "0011"
title: "ErrorMessage Component with Retry"
stage: green
date: 2026-01-30
surface: agent
model: claude-opus-4-5-20251101
feature: 001-streaming-chat-interface
branch: 001-streaming-chat-interface
user: ali
command: /sp.implement
labels: ["error-handling", "retry", "component", "T022"]
links:
  spec: specs/001-streaming-chat-interface/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - app/chat/_components/error-message.tsx (created)
  - app/chat/_components/message-list.tsx (updated)
  - app/chat/_components/index.ts (updated)
tests:
  - pnpm build - PASS
---

## Prompt

Execute task T022

## Response snapshot

Created dedicated ErrorMessage component with retry button functionality.

**Implementation:**
- Created `app/chat/_components/error-message.tsx` with:
  - AlertCircle icon from lucide-react
  - Error message display with optional error code
  - Retry button with RefreshCw icon (only shown when `error.retryable` is true)
  - Proper ARIA attributes for accessibility
  - Consistent styling with chat UI (red-50 background, red-200 border)

- Updated MessageList to use ErrorMessage component instead of inline error display
- Exported ErrorMessage from components index

**Component Features:**
- Shows error message from `error.message`
- Shows error code if present and not "unknown"
- Retry button only appears when `error.retryable === true`
- Uses RefreshCw icon for visual retry indication

## Outcome

- ✅ Impact: Dedicated, reusable error component with proper retry UX
- 🧪 Tests: Build passes
- 📁 Files: 1 created, 2 updated
- 🔁 Next prompts: T023 (store last message), T024 (integrate error handling)
- 🧠 Reflection: Component extracted from inline code, cleaner separation of concerns

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Build PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add animation for error appearance
