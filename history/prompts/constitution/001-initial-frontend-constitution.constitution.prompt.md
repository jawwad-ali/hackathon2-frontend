---
id: 001
title: Initial Frontend Constitution
stage: constitution
date: 2026-01-29
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: system
command: /sp.constitution
labels: ["constitution", "next.js", "architecture", "streaming", "chatkit"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

1. Identity & Frameworks:

Primary Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS.

AI Integration: OpenAI ChatKit (@openai/chatkit-react) and the OpenAI SDK for frontend streaming.

Package Management: Strictly use npm (or your preferred manager) for the frontend.

2. Architectural Rules (The "Law"):

Server-First: All routes must be Server Components. Client Components ("use client") are only permitted for interactive leaf nodes (e.g., the Chat Window).

Direct Connection: Connect the ChatKit provider directly to the existing backend endpoint: http://localhost:8000/chat/stream.

No Backend Duplication: Do not create API routes in Next.js that duplicate logic already present in the FastAPI orchestrator.

State Management: Use useRef for UI-only states that don't require re-renders. Use ChatKit's built-in state for message history.

3. Design Standards:

Follow the nextjs-engineer skill for code quality: clean, typed, and production-grade.

Maintain a minimalist, high-end developer portfolio aesthetic (inspired by the referenced demo link).

Implement Streaming UI with skeleton loaders and "Thinking" states for all AI responses.

4. Forbidden Patterns:

No useState for form inputs (use Uncontrolled Components with useRef).

No standard fetch for AI responses; strictly use the ChatKit streaming hooks.

No hardcoding of the Backend URL; use an environment variable NEXT_PUBLIC_CHAT_API_URL.

## Response snapshot

Created initial constitution v1.0.0 for hackathon2-frontend with 4 core principles:

1. **Identity & Frameworks** - Defines the Next.js 15 + TypeScript + Tailwind CSS stack with OpenAI ChatKit for AI streaming
2. **Architectural Rules (The Law)** - Server-first rendering, direct backend connection, no API duplication, proper state management
3. **Design Standards** - Clean code quality, minimalist aesthetic, streaming UI with loaders/thinking states, WCAG compliance
4. **Forbidden Patterns** - Explicit prohibitions with code examples: no useState for forms, no fetch for AI, no hardcoded URLs, no client components at route level

Also added Technical Stack table, Required Environment Variables section, and full Governance section with amendment process, compliance rules, and version history.

## Outcome

- Impact: Established foundational governance for frontend development
- Tests: N/A (constitution document)
- Files: .specify/memory/constitution.md (created)
- Next prompts: /sp.specify for feature specs, /sp.plan for implementation planning
- Reflection: Constitution provides clear, enforceable rules with concrete code examples for forbidden patterns

## Evaluation notes (flywheel)

- Failure modes observed: None - straightforward constitution creation
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
