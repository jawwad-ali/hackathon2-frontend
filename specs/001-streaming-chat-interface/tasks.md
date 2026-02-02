# Tasks: Streaming Chat Interface

**Input**: Design documents from `/specs/001-streaming-chat-interface/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec - manual testing with backend

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**IMPORTANT**: This task list has been regenerated after determining that `@openai/chatkit-react` is **incompatible** with the backend's custom SSE protocol. The implementation now uses a custom streaming solution that directly consumes the backend's SSE events (`thinking`, `tool_call`, `response_delta`, `error`, `done`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (Next.js)**: `app/` at repository root
- Chat components: `app/chat/_components/`
- Types and config: `app/chat/_lib/`
- Custom hooks: `app/chat/_hooks/`

## Existing Components (KEEP)

The following were created before the ChatKit compatibility issue was discovered and remain valid:

- `app/chat/_components/chat-input.tsx` - Uncontrolled textarea with useRef
- `app/chat/_components/message-bubble.tsx` - Basic message display
- `app/chat/_components/index.ts` - Barrel export
- `app/chat/_hooks/use-auto-scroll.ts` - IntersectionObserver-based auto-scroll
- `app/chat/_lib/types.ts` - TypeScript interfaces
- `app/chat/_lib/config.ts` - Chat configuration
- `app/chat/_lib/constants.ts` - Example prompts and UI text

---

## Phase 1: Setup (Custom SSE Infrastructure)

**Purpose**: Create the custom streaming infrastructure to replace ChatKit

- [x] T001 Create SSE event types in app/chat/_lib/sse-types.ts (thinking, tool_call, response_delta, error, done)
- [x] T002 Create useStreamingChat hook in app/chat/_hooks/use-streaming-chat.ts with fetch + SSE parsing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core chat infrastructure that MUST be complete before user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create ChatWindow client component in app/chat/_components/chat-window.tsx integrating useStreamingChat hook
- [x] T004 Update app/page.tsx to import and render the new ChatWindow component

**Checkpoint**: Foundation ready - custom streaming connected, basic rendering works

---

## Phase 3: User Story 1 - Send Message and Receive Streaming Response (Priority: P1) MVP

**Goal**: Users can send messages and see real-time streaming responses from the AI Agent

**Independent Test**: Type "Hello, how are you?" and verify text appears character-by-character in real-time

**Acceptance Criteria**:
- Message appears in chat history immediately on submit
- Streaming response begins within 500ms (excluding backend time)
- Input disabled during streaming to prevent duplicate submissions
- Response updates in real-time without flickering

### Implementation for User Story 1

- [x] T005 [US1] Create MessageList component in app/chat/_components/message-list.tsx with auto-scroll integration
- [x] T006 [US1] Integrate ChatInput and MessageList into ChatWindow with sendMessage handler
- [x] T007 [US1] Implement input disabling during active streaming in ChatWindow
- [x] T008 [US1] Add responsive styling (mobile 375px to desktop 1920px) to all US1 components

**Checkpoint**: Core chat functionality works - users can send messages and receive streaming responses

---

## Phase 4: User Story 2 - View Agent Thinking State (Priority: P2)

**Goal**: Users see a visual indicator when the Agent is "thinking" or reasoning

**Independent Test**: Ask the Agent a complex question and verify a "thinking" indicator appears before the response begins streaming

**Acceptance Criteria**:
- Visual indicator (animated spinner or "thinking..." text) appears during reasoning phase
- Indicator transitions smoothly when response streaming begins

### Implementation for User Story 2

- [x] T009 [P] [US2] Create ThinkingIndicator component in app/chat/_components/thinking-indicator.tsx with animated spinner and "thinking..." text
- [x] T010 [US2] Integrate ThinkingIndicator into MessageList, show when streamState is 'thinking'
- [x] T011 [US2] Add smooth CSS transitions for thinking indicator appearance/disappearance

**Checkpoint**: Thinking states display correctly during Agent reasoning

---

## Phase 5: User Story 3 - View Tool Execution Status (Priority: P2)

**Goal**: Users see status updates when the Agent executes backend tools (e.g., "Updating database...")

**Independent Test**: Ask the Agent to "add a new todo item" and verify a status message like "Updating database..." appears

**Acceptance Criteria**:
- Status message appears when tool execution begins (within 200ms)
- Status updates or disappears when tool completes
- Graceful error display for failed tool executions (no technical details exposed)

### Implementation for User Story 3

- [x] T012 [P] [US3] Create ToolStatus component in app/chat/_components/tool-status.tsx with tool name and animated status indicator
- [x] T013 [US3] Parse tool_call events from SSE stream in useStreamingChat hook
- [x] T014 [US3] Integrate ToolStatus into MessageList, showing during active tool calls
- [x] T015 [US3] Handle tool execution failures with user-friendly error messages (no technical details)

**Checkpoint**: Tool execution states display correctly with status updates

---

## Phase 6: User Story 4 - Read Markdown-Formatted Responses (Priority: P3)

**Goal**: Agent responses with markdown render as formatted content (headers, lists, code blocks)

**Independent Test**: Ask the Agent to "list 3 items in a numbered list" and verify the response renders as a proper formatted list

**Acceptance Criteria**:
- Headers, lists, bold, and code blocks render as formatted HTML
- Code blocks appear with monospace font and visual distinction

### Implementation for User Story 4

- [x] T016 [US4] Integrate react-markdown with remark-gfm into MessageBubble component in app/chat/_components/message-bubble.tsx
- [x] T017 [US4] Add Tailwind prose styling for markdown content (headings, lists, code blocks)
- [x] T018 [US4] Style code blocks with monospace font, background color, and proper padding

**Checkpoint**: Markdown content renders beautifully in agent responses

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, UX polish, and features that affect multiple user stories

### Welcome Screen (FR-012)

- [x] T019 [P] Create WelcomeScreen component in app/chat/_components/welcome-screen.tsx with example prompts from constants
- [x] T020 Integrate WelcomeScreen into MessageList, show when conversation is empty
- [x] T021 Implement clickable example prompts that send the message on click

### Error Handling with Retry (FR-009)

- [x] T022 [P] Create ErrorMessage component in app/chat/_components/error-message.tsx with retry button
- [x] T023 Store last user message for retry functionality in ChatWindow (useRef pattern)
- [x] T024 Integrate ErrorMessage into ChatWindow, show on network/backend errors with retry action

### New Chat Button (FR-013)

- [x] T025 [P] Create NewChatButton component in app/chat/_components/new-chat-button.tsx
- [x] T026 Integrate NewChatButton into ChatWindow header area
- [x] T027 Implement conversation reset that clears messages and returns to welcome state

### Final Polish

- [x] T028 Add dark mode support to all components (use Tailwind dark: variants)
- [x] T029 Add smooth transitions and subtle animations throughout UI
- [x] T030 Verify WCAG 2.1 AA accessibility compliance (focus states, aria labels, keyboard navigation)
- [x] T031 Run manual E2E test: complete happy path from welcome → send message → streaming response → new chat

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1) should complete first (core MVP)
  - US2 and US3 (both P2) can proceed in parallel after US1
  - US4 (P3) can proceed after US1
- **Polish (Phase 7)**: Depends on US1 minimum; better after all stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Requires US1 MessageList; enhances with thinking indicator
- **User Story 3 (P2)**: Requires US1 MessageList; enhances with tool status
- **User Story 4 (P3)**: Requires US1 MessageBubble; enhances with markdown rendering

### Parallel Opportunities

**Within Setup (Phase 1):**
```
T001 sse-types.ts ─┬─ Can run in parallel (different files)
T002 use-streaming-chat.ts ─┘ (T002 imports T001, so sequential recommended)
```

**Within User Stories (after US1):**
```
US2 ThinkingIndicator (T009) ─┬─ Both P2, parallel if staff available
US3 ToolStatus (T012)        ─┘
```

**Within Polish:**
```
T019 WelcomeScreen    ─┐
T022 ErrorMessage     ─┼─ All parallel (different files)
T025 NewChatButton    ─┘
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: User Story 1 (T005-T008)
4. **STOP and VALIDATE**: Test core chat independently
5. Deploy/demo if ready - users can chat with the Agent!

### Incremental Delivery

1. **Setup + Foundational** → Foundation ready
2. **Add User Story 1** → Test independently → Deploy (MVP!)
3. **Add User Story 2 + 3** → Test thinking/tool states → Deploy
4. **Add User Story 4** → Test markdown rendering → Deploy
5. **Add Polish** → Welcome screen, error retry, new chat → Final Deploy

### Task Count Summary

| Phase | Task Count | Notes |
|-------|-----------|-------|
| Phase 1: Setup | 2 tasks | T001-T002 |
| Phase 2: Foundational | 2 tasks | T003-T004 |
| Phase 3: US1 (P1) | 4 tasks | T005-T008 - **MVP** |
| Phase 4: US2 (P2) | 3 tasks | T009-T011 |
| Phase 5: US3 (P2) | 4 tasks | T012-T015 |
| Phase 6: US4 (P3) | 3 tasks | T016-T018 |
| Phase 7: Polish | 13 tasks | T019-T031 |
| **Total** | **31 tasks** | |

### Per User Story Count

| User Story | Task Count |
|------------|-----------|
| Setup/Foundational | 4 tasks |
| US1 - Core Streaming | 4 tasks |
| US2 - Thinking State | 3 tasks |
| US3 - Tool Status | 4 tasks |
| US4 - Markdown | 3 tasks |
| Polish/Cross-cutting | 13 tasks |

---

## Backend SSE Protocol Reference

The backend at `/chat/stream` uses this custom SSE protocol:

**Request Format:**
```json
{
  "message": "User message text",
  "request_id": "optional-uuid",
  "thread_id": "optional-thread-id"
}
```

**SSE Event Types:**
```
event: thinking
data: {"status": "thinking"}

event: tool_call
data: {"tool": "tool_name", "status": "executing"}

event: response_delta
data: {"content": "partial response text"}

event: error
data: {"message": "error description", "code": "error_code"}

event: done
data: {"status": "complete", "full_response": "..."}
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable once complete
- Manual testing with backend (no automated tests requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Constitution compliance**: All tasks follow Server-First, useRef patterns, custom SSE streaming (NOT ChatKit)
