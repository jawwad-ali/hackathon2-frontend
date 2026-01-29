<!--
## Sync Impact Report
- Version change: null → 1.0.0
- Added principles:
  - I. Identity & Frameworks (new)
  - II. Architectural Rules (new)
  - III. Design Standards (new)
  - IV. Forbidden Patterns (new)
- Added sections:
  - Technical Stack (new)
  - Governance (new)
- Removed sections: None (initial version)
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ no changes needed - Constitution Check section is generic)
  - .specify/templates/spec-template.md (✅ no changes needed - technology agnostic)
  - .specify/templates/tasks-template.md (✅ no changes needed - paths will be adjusted per plan)
- Follow-up TODOs: None
-->

# Hackathon2 Frontend Constitution

## Core Principles

### I. Identity & Frameworks

The frontend application is built on a modern, type-safe stack optimized for AI-powered
interactions and streaming UX.

- **Primary Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **AI Integration**: OpenAI ChatKit (`@openai/chatkit-react`) and the OpenAI SDK for
  frontend streaming
- **Package Management**: MUST use `npm` exclusively for all dependency management
- **Runtime Environment**: Node.js with React 19 Server Components

**Rationale**: This stack provides server-first rendering, type safety, and native streaming
support required for real-time AI chat interfaces.

### II. Architectural Rules (The Law)

These rules are non-negotiable and govern all architectural decisions:

1. **Server-First**: All routes MUST be Server Components by default. Client Components
   (`"use client"`) are ONLY permitted for interactive leaf nodes (e.g., the Chat Window,
   form inputs, buttons with handlers).

2. **Direct Connection**: The ChatKit provider MUST connect directly to the existing backend
   endpoint. No intermediary Next.js API routes for chat functionality.
   - Backend URL: Configured via `NEXT_PUBLIC_CHAT_API_URL` environment variable
   - Default: `http://localhost:8000/chat/stream`

3. **No Backend Duplication**: MUST NOT create API routes in Next.js that duplicate logic
   already present in the FastAPI orchestrator. The frontend is a presentation layer only.

4. **State Management**:
   - Use `useRef` for UI-only states that do not require re-renders (scroll position,
     input focus, animation state)
   - Use ChatKit's built-in state for message history and streaming state
   - Minimize custom state; prefer derived state where possible

**Rationale**: These rules ensure a clean separation of concerns, optimal performance through
server rendering, and prevent architectural drift that would complicate maintenance.

### III. Design Standards

All UI and code MUST adhere to these standards:

1. **Code Quality**: Clean, fully typed, production-grade TypeScript. Follow the
   nextjs-engineer skill patterns for consistency.

2. **Visual Design**: Maintain a minimalist, high-end developer portfolio aesthetic:
   - Clean typography with ample whitespace
   - Subtle animations and transitions
   - Dark mode support
   - Monochromatic or limited color palette

3. **Streaming UI**: All AI responses MUST implement:
   - Skeleton loaders during initial connection
   - "Thinking" indicator states while awaiting response
   - Smooth token-by-token text rendering
   - Graceful error states with retry options

4. **Accessibility**: WCAG 2.1 AA compliance for all interactive elements.

**Rationale**: Consistent design standards ensure a polished user experience and maintainable
codebase that reflects professional quality.

### IV. Forbidden Patterns

These patterns are explicitly prohibited and MUST be rejected in code review:

1. **No `useState` for Form Inputs**: Use Uncontrolled Components with `useRef` for form
   fields. This prevents unnecessary re-renders on each keystroke.
   ```typescript
   // FORBIDDEN
   const [message, setMessage] = useState('');

   // REQUIRED
   const inputRef = useRef<HTMLInputElement>(null);
   ```

2. **No Standard `fetch` for AI Responses**: MUST use ChatKit streaming hooks exclusively.
   Standard fetch does not support streaming and will create poor UX.
   ```typescript
   // FORBIDDEN
   const response = await fetch('/api/chat', { body: message });

   // REQUIRED
   const { sendMessage, messages } = useChatStream();
   ```

3. **No Hardcoded Backend URLs**: All backend URLs MUST use the `NEXT_PUBLIC_CHAT_API_URL`
   environment variable.
   ```typescript
   // FORBIDDEN
   const API_URL = 'http://localhost:8000/chat/stream';

   // REQUIRED
   const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL;
   ```

4. **No Client Components at Route Level**: Route segments (`page.tsx`, `layout.tsx`)
   MUST remain Server Components. Extract interactive portions into separate Client
   Component files.

**Rationale**: These forbidden patterns would degrade performance, create maintenance
burden, or violate the architectural principles that enable this application's UX goals.

## Technical Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Framework | Next.js | 16.x | App Router only |
| Language | TypeScript | 5.x | Strict mode enabled |
| Styling | Tailwind CSS | 4.x | Utility-first |
| AI SDK | @openai/chatkit-react | latest | Streaming chat UI |
| React | React | 19.x | Server Components |
| Linting | ESLint | 9.x | Next.js config |

### Required Environment Variables

```env
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat/stream
```

## Governance

### Amendment Process

1. Constitution amendments require documented justification
2. All changes MUST be reviewed for impact on existing code
3. Major changes (principle additions/removals) require migration plan
4. Version MUST be incremented according to semantic versioning:
   - **MAJOR**: Breaking governance changes or principle removals
   - **MINOR**: New principles or expanded guidance
   - **PATCH**: Clarifications, typos, non-semantic refinements

### Compliance

- All PRs MUST verify compliance with these principles before merge
- Complexity beyond these guidelines MUST be justified in PR description
- Code review MUST check for forbidden patterns
- Use CLAUDE.md for runtime development guidance and agent instructions

### Version History

| Version | Date | Change Summary |
|---------|------|----------------|
| 1.0.0 | 2026-01-29 | Initial constitution with 4 core principles |

**Version**: 1.0.0 | **Ratified**: 2026-01-29 | **Last Amended**: 2026-01-29
