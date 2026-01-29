# Backend API Contract

**Feature**: 001-streaming-chat-interface
**Date**: 2026-01-29

## Overview

This document defines the contract between the Next.js frontend and the existing FastAPI backend. The frontend is a consumer of this API and MUST NOT modify the backend.

## Endpoint: POST /chat/stream

### Request

**URL**: `${NEXT_PUBLIC_CHAT_API_URL}` (default: `http://localhost:8000/chat/stream`)

**Method**: POST

**Headers**:
```
Content-Type: application/json
Accept: text/event-stream
```

**Body** (OpenAI Chat Completion format):
```typescript
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream: true;
}
```

**Example**:
```json
{
  "messages": [
    { "role": "user", "content": "Add a todo: Buy groceries" }
  ],
  "stream": true
}
```

### Response

**Content-Type**: `text/event-stream`

**Format**: Server-Sent Events (SSE) with JSON payloads

#### Event Types

##### 1. Content Delta (text streaming)
```
data: {"choices":[{"index":0,"delta":{"content":"Hello"}}]}
```

##### 2. Thinking/Reasoning Indicator
```
data: {"choices":[{"index":0,"delta":{"content":""},"metadata":{"thinking":true}}]}
```
Or detected via content pattern:
```
data: {"choices":[{"index":0,"delta":{"content":"<thinking>..."}}]}
```

##### 3. Tool Call Start
```
data: {"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"id":"call_123","type":"function","function":{"name":"update_todo","arguments":""}}]}}]}
```

##### 4. Tool Call Arguments (streamed)
```
data: {"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\"title\":"}}]}}]}
```

##### 5. Tool Call Result (after execution)
```
data: {"choices":[{"index":0,"delta":{"content":"I've added the todo item."}}]}
```

##### 6. Stream Complete
```
data: [DONE]
```

##### 7. Error
```
data: {"error":{"message":"Rate limit exceeded","code":"rate_limit_error"}}
```

### Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success (SSE stream begins) | Process stream |
| 400 | Bad request | Show error, no retry |
| 429 | Rate limited | Show error with retry after delay |
| 500 | Server error | Show error with retry button |
| 503 | Service unavailable | Show error with retry button |

### CORS Requirements

The backend MUST allow:
- Origin: `http://localhost:3000` (dev), production domains
- Methods: `POST, OPTIONS`
- Headers: `Content-Type, Accept`

## Frontend Consumption Pattern

```typescript
// Using ChatKit custom API config
const { control } = useChatKit({
  api: {
    url: process.env.NEXT_PUBLIC_CHAT_API_URL,
    fetch: async (url, init) => {
      return fetch(url, {
        ...init,
        credentials: 'include', // if cookies needed
      });
    },
  },
});
```

## Error Contract

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    retryable?: boolean;
    retryAfter?: number; // seconds
  };
}
```

## Testing the Contract

### Manual Test with curl

```bash
curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"stream":true}'
```

### Expected Output Pattern

```
data: {"choices":[{"index":0,"delta":{"role":"assistant"}}]}
data: {"choices":[{"index":0,"delta":{"content":"Hello"}}]}
data: {"choices":[{"index":0,"delta":{"content":"!"}}]}
data: {"choices":[{"index":0,"delta":{"content":" How"}}]}
...
data: [DONE]
```
