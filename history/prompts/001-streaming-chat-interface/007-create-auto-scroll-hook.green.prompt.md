---
id: 007
title: Create Auto-Scroll Hook with useRef
stage: green
date: 2026-01-30
surface: agent
model: claude-opus-4-5-20251101
feature: 001-streaming-chat-interface
branch: 001-streaming-chat-interface
user: user
command: /sp.implement
labels: ["implementation", "react-hook", "useRef", "T008"]
links:
  spec: specs/001-streaming-chat-interface/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - app/chat/_hooks/use-auto-scroll.ts
  - app/chat/_hooks/index.ts
tests:
  - TypeScript compilation check (passed)
---

## Prompt

Load your NextJS skill and Implement task T008 carefully

## Response snapshot

Implemented T008 - Created auto-scroll hook in app/chat/_hooks/use-auto-scroll.ts using useRef pattern (no useState).

Key implementation details:
1. Created `useAutoScroll` hook with useRef-only state management
2. Returns `scrollRef`, `endRef`, `scrollToBottom`, and `isAtBottom`
3. Uses IntersectionObserver for efficient scroll detection
4. Respects user scroll position - pauses auto-scroll when user scrolls up
5. Resumes auto-scroll when user scrolls back to bottom
6. Configurable threshold (default 100px) and scroll behavior (smooth/auto)
7. Created barrel export in `app/chat/_hooks/index.ts`

Constitution compliance:
- IV.1: No useState for UI-only state
- Uses useRef for shouldAutoScrollRef to avoid re-renders during streaming
- Efficient scroll handling with passive event listeners

This completes Phase 2 (Foundational) - ChatKit connected, basic rendering ready.

## Outcome

- Impact: Completes Phase 2 Foundational - unblocks User Story implementation
- Tests: TypeScript compilation passed
- Files: 2 files created (use-auto-scroll.ts, index.ts)
- Next prompts: T009-T014 (Phase 3: User Story 1 - Core streaming chat)
- Reflection: useRef pattern provides smooth scrolling without re-render overhead

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Integration test with MessageList component
