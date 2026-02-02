---
id: "0008"
title: "Tool Error Handling"
stage: green
date: 2026-01-30
surface: agent
model: claude-opus-4-5-20251101
feature: 001-streaming-chat-interface
branch: 001-streaming-chat-interface
user: ali
command: /sp.implement
labels: ["tool-status", "error-handling", "user-friendly"]
links:
  spec: specs/001-streaming-chat-interface/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - app/chat/_lib/constants.ts (updated)
  - app/chat/_components/tool-status.tsx (updated)
  - specs/001-streaming-chat-interface/tasks.md (updated)
tests:
  - Manual build verification (pnpm build - PASS)
---

## Prompt

Execute t015

## Response snapshot

Implemented T015 - Handle tool execution failures with user-friendly error messages:

**Changes to constants.ts:**
1. Added `TOOL_ERROR_MESSAGES` constant mapping tool names to friendly error messages
2. Added `getToolErrorMessage()` function to retrieve error messages

**Changes to ToolStatus:**
1. Added import for `getToolErrorMessage`
2. Updated error display to use `getToolErrorMessage(tool.name)` instead of hardcoded text

**Error Messages:**
```typescript
export const TOOL_ERROR_MESSAGES: Record<string, string> = {
  update_todo: 'Unable to update the todo item. Please try again.',
  create_todo: 'Unable to create the todo item. Please try again.',
  delete_todo: 'Unable to delete the todo item. Please try again.',
  list_todos: 'Unable to fetch your todos. Please try again.',
  default: 'Something went wrong. Please try again.',
};
```

**Before:**
```tsx
{isFailed ? 'Tool execution failed' : displayText}
```

**After:**
```tsx
{isFailed ? getToolErrorMessage(tool.name) : displayText}
```

## Outcome

- ✅ Impact: Tool failures now show user-friendly messages specific to each tool type
- 🧪 Tests: Build passes (pnpm build successful)
- 📁 Files: 2 files modified
- 🔁 Next prompts: T016 (Markdown rendering with react-markdown)
- 🧠 Reflection: Error messages follow same pattern as display names - centralized mapping

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Build PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with actual tool_call failure SSE events
