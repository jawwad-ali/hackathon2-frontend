# Tasks: Streaming Chat Interface

**Input**: Design documents from `/specs/001-streaming-chat-interface/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec - manual testing with backend

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (Next.js)**: `app/` at repository root
- Chat components: `app/chat/_components/`
- Types and config: `app/chat/_lib/`
- Custom hooks: `app/chat/_hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create foundational types/configuration

- [x] T001 Install required dependencies: `npm install @openai/chatkit-react react-markdown remark-gfm lucide-react`
- [x] T002 [P] Create TypeScript types in app/chat/_lib/types.ts (Message, ToolExecution, StreamState, component props)
- [x] T003 [P] Create chat configuration in app/chat/_lib/config.ts (apiUrl from NEXT_PUBLIC_CHAT_API_URL)
- [x] T004 [P] Create constants in app/chat/_lib/constants.ts (EXAMPLE_PROMPTS array)
- [x] T005 [P] Create .env.local with NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat/stream

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core chat infrastructure that MUST be complete before user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create ChatWindow client component shell in app/chat/_components/chat-window.tsx with useChatKit hook integration
- [ ] T007 Update app/page.tsx to import and render ChatWindow component (Server Component wrapper)
- [ ] T008 Create auto-scroll hook in app/chat/_hooks/use-auto-scroll.ts (useRef pattern, no useState)

**Checkpoint**: Foundation ready - ChatKit connected, basic rendering works

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

- [ ] T009 [US1] Create ChatInput component in app/chat/_components/chat-input.tsx with useRef pattern (uncontrolled textarea, no useState)
- [ ] T010 [US1] Create MessageBubble component in app/chat/_components/message-bubble.tsx (basic text display, user/assistant styling)
- [ ] T011 [US1] Create MessageList component in app/chat/_components/message-list.tsx with auto-scroll integration
- [ ] T012 [US1] Integrate ChatInput and MessageList into ChatWindow with sendMessage handler
- [ ] T013 [US1] Implement input disabling during active streaming in ChatWindow
- [ ] T014 [US1] Add responsive styling (mobile 375px to desktop 1920px) to all US1 components

**Checkpoint**: Core chat functionality works - users can send messages and receive streaming responses

---

## Phase 4: User Story 2 - View Agent Thinking State (Priority: P2)

**Goal**: Users see a visual indicator when the Agent is "thinking" or reasoning

**Independent Test**: Ask the Agent a complex question and verify a "thinking" indicator appears before the response begins streaming

**Acceptance Criteria**:
- Visual indicator (animated spinner or "thinking..." text) appears during reasoning phase
- Indicator transitions smoothly when response streaming begins

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create ThinkingIndicator component in app/chat/_components/thinking-indicator.tsx with animated spinner and "thinking..." text
- [ ] T016 [US2] Integrate ThinkingIndicator into MessageList, show when ChatKit signals response start but no content yet
- [ ] T017 [US2] Add smooth CSS transitions for thinking indicator appearance/disappearance

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

- [ ] T018 [P] [US3] Create ToolStatus component in app/chat/_components/tool-status.tsx with tool name and animated status indicator
- [ ] T019 [US3] Parse tool_calls from ChatKit/SSE events in ChatWindow to detect tool execution
- [ ] T020 [US3] Integrate ToolStatus into MessageList, showing during active tool calls
- [ ] T021 [US3] Handle tool execution failures with user-friendly error messages (no technical details)

**Checkpoint**: Tool execution states display correctly with status updates

---

## Phase 6: User Story 4 - Read Markdown-Formatted Responses (Priority: P3)

**Goal**: Agent responses with markdown render as formatted content (headers, lists, code blocks)

**Independent Test**: Ask the Agent to "list 3 items in a numbered list" and verify the response renders as a proper formatted list

**Acceptance Criteria**:
- Headers, lists, bold, and code blocks render as formatted HTML
- Code blocks appear with monospace font and visual distinction

### Implementation for User Story 4

- [ ] T022 [US4] Integrate react-markdown with remark-gfm into MessageBubble component in app/chat/_components/message-bubble.tsx
- [ ] T023 [US4] Add Tailwind prose styling for markdown content (headings, lists, code blocks)
- [ ] T024 [US4] Style code blocks with monospace font, background color, and proper padding

**Checkpoint**: Markdown content renders beautifully in agent responses

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, UX polish, and features that affect multiple user stories

### Welcome Screen (FR-012)

- [ ] T025 [P] Create WelcomeScreen component in app/chat/_components/welcome-screen.tsx with example prompts from constants
- [ ] T026 Integrate WelcomeScreen into MessageList, show when conversation is empty
- [ ] T027 Implement clickable example prompts that send the message on click

### Error Handling with Retry (FR-009)

- [ ] T028 [P] Create ErrorMessage component in app/chat/_components/error-message.tsx with retry button
- [ ] T029 Store last user message for retry functionality in ChatWindow (local state exception allowed)
- [ ] T030 Integrate ErrorMessage into ChatWindow, show on network/backend errors with retry action

### New Chat Button (FR-013)

- [ ] T031 [P] Create NewChatButton component in app/chat/_components/new-chat-button.tsx
- [ ] T032 Integrate NewChatButton into ChatWindow header area
- [ ] T033 Implement conversation reset that clears messages and returns to welcome state

### Final Polish

- [ ] T034 Add dark mode support to all components (use Tailwind dark: variants)
- [ ] T035 Add smooth transitions and subtle animations throughout UI
- [ ] T036 Verify WCAG 2.1 AA accessibility compliance (focus states, aria labels, keyboard navigation)
- [ ] T037 Run manual E2E test: complete happy path from welcome → send message → streaming response → new chat

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
T002 types.ts    ─┐
T003 config.ts   ─┼─ All parallel (different files)
T004 constants.ts─┤
T005 .env.local  ─┘
```

**Within User Stories (after US1):**
```
US2 ThinkingIndicator (T015) ─┬─ Both P2, parallel if staff available
US3 ToolStatus (T018)        ─┘
```

**Within Polish:**
```
T025 WelcomeScreen    ─┐
T028 ErrorMessage     ─┼─ All parallel (different files)
T031 NewChatButton    ─┘
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T008)
3. Complete Phase 3: User Story 1 (T009-T014)
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
| Phase 1: Setup | 5 tasks | T001-T005 |
| Phase 2: Foundational | 3 tasks | T006-T008 |
| Phase 3: US1 (P1) | 6 tasks | T009-T014 - **MVP** |
| Phase 4: US2 (P2) | 3 tasks | T015-T017 |
| Phase 5: US3 (P2) | 4 tasks | T018-T021 |
| Phase 6: US4 (P3) | 3 tasks | T022-T024 |
| Phase 7: Polish | 13 tasks | T025-T037 |
| **Total** | **37 tasks** | |

### Per User Story Count

| User Story | Task Count |
|------------|-----------|
| Setup/Foundational | 8 tasks |
| US1 - Core Streaming | 6 tasks |
| US2 - Thinking State | 3 tasks |
| US3 - Tool Status | 4 tasks |
| US4 - Markdown | 3 tasks |
| Polish/Cross-cutting | 13 tasks |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable once complete
- Manual testing with backend (no automated tests requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Constitution compliance**: All tasks follow Server-First, useRef patterns, ChatKit state management
