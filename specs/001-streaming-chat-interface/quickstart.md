# Quickstart: Streaming Chat Interface

**Feature**: 001-streaming-chat-interface
**Date**: 2026-01-29

## Prerequisites

- Node.js 20+
- npm 10+
- Backend running at `http://localhost:8000` (FastAPI with `/chat/stream` endpoint)

## Setup

### 1. Install Dependencies

```bash
npm install @openai/chatkit-react react-markdown remark-gfm lucide-react
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat/stream
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the chat interface.

## Project Structure (After Implementation)

```
app/
├── layout.tsx              # Root layout (Server Component)
├── page.tsx                # Chat page (Server Component shell)
├── globals.css             # Tailwind imports
└── chat/
    ├── _components/        # Client Components (interactive)
    │   ├── chat-window.tsx
    │   ├── chat-input.tsx
    │   ├── message-list.tsx
    │   ├── message-bubble.tsx
    │   ├── thinking-indicator.tsx
    │   ├── tool-status.tsx
    │   ├── welcome-screen.tsx
    │   └── error-message.tsx
    └── _lib/
        ├── types.ts        # TypeScript interfaces
        ├── config.ts       # Chat configuration
        └── constants.ts    # Example prompts, etc.
```

## Key Files

### Chat Configuration (`app/chat/_lib/config.ts`)

```typescript
export const chatConfig = {
  apiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/chat/stream',
};
```

### Root Page (`app/page.tsx`)

```typescript
// Server Component - no 'use client'
import { ChatWindow } from './chat/_components/chat-window';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <ChatWindow />
    </main>
  );
}
```

### Chat Window (`app/chat/_components/chat-window.tsx`)

```typescript
'use client';

import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { chatConfig } from '../_lib/config';

export function ChatWindow() {
  const { control } = useChatKit({
    api: {
      url: chatConfig.apiUrl,
    },
  });

  return (
    <div className="mx-auto max-w-3xl h-screen">
      <ChatKit control={control} className="h-full" />
    </div>
  );
}
```

## Testing

### Verify Backend Connection

```bash
# In one terminal, ensure backend is running:
cd ../backend && uvicorn main:app --reload

# In another terminal, test the endpoint:
curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"stream":true}'
```

### Verify Frontend

1. Open `http://localhost:3000`
2. Type a message and press Enter
3. Observe streaming response

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Ensure backend allows `http://localhost:3000` |
| Connection refused | Verify backend is running on port 8000 |
| No response | Check browser Network tab for SSE stream |
| Hydration error | Ensure ChatKit components use `'use client'` |

## Development Tips

1. **Hot Reload**: Changes to Client Components reflect immediately
2. **Server Components**: Changes to layout/page.tsx require page refresh
3. **Environment Variables**: Changes to `.env.local` require dev server restart
4. **Debugging Streams**: Use browser DevTools > Network > filter by "eventsource" or "fetch"
