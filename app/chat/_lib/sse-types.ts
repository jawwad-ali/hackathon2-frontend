/**
 * SSE Event Types for Custom Backend Streaming Protocol
 *
 * Backend endpoint: /chat/stream
 * Protocol: Server-Sent Events with named event types
 */

// ============================================
// SSE Event Names (as sent by backend)
// ============================================

export type SSEEventType =
  | 'thinking'
  | 'tool_call'
  | 'response_delta'
  | 'error'
  | 'done';

// ============================================
// SSE Event Data Payloads
// ============================================

/**
 * Sent when the agent is reasoning/thinking
 * event: thinking
 * data: {"status": "thinking"}
 */
export interface ThinkingEventData {
  status: 'thinking';
}

/**
 * Sent when the agent executes a backend tool
 * event: tool_call
 * data: {"tool": "tool_name", "status": "executing"}
 */
export interface ToolCallEventData {
  tool: string;
  status: 'executing' | 'completed' | 'failed';
  error?: string;
}

/**
 * Sent for each chunk of the streaming response
 * event: response_delta
 * data: {"content": "partial response text"}
 */
export interface ResponseDeltaEventData {
  content: string;
}

/**
 * Sent when an error occurs
 * event: error
 * data: {"message": "error description", "code": "error_code"}
 */
export interface ErrorEventData {
  message: string;
  code: string;
}

/**
 * Sent when the stream is complete
 * event: done
 * data: {"status": "complete", "full_response": "..."}
 */
export interface DoneEventData {
  status: 'complete';
  full_response: string;
}

// ============================================
// Union Type for All Event Data
// ============================================

export type SSEEventData =
  | ThinkingEventData
  | ToolCallEventData
  | ResponseDeltaEventData
  | ErrorEventData
  | DoneEventData;

// ============================================
// Parsed SSE Event (internal representation)
// ============================================

export interface ParsedSSEEvent<T extends SSEEventData = SSEEventData> {
  type: SSEEventType;
  data: T;
}

// Type-safe event interfaces
export interface ThinkingEvent extends ParsedSSEEvent<ThinkingEventData> {
  type: 'thinking';
}

export interface ToolCallEvent extends ParsedSSEEvent<ToolCallEventData> {
  type: 'tool_call';
}

export interface ResponseDeltaEvent extends ParsedSSEEvent<ResponseDeltaEventData> {
  type: 'response_delta';
}

export interface ErrorEvent extends ParsedSSEEvent<ErrorEventData> {
  type: 'error';
}

export interface DoneEvent extends ParsedSSEEvent<DoneEventData> {
  type: 'done';
}

export type SSEEvent =
  | ThinkingEvent
  | ToolCallEvent
  | ResponseDeltaEvent
  | ErrorEvent
  | DoneEvent;

// ============================================
// Request Format
// ============================================

/**
 * Request body format for POST /chat/stream
 */
export interface ChatStreamRequest {
  message: string;
  request_id?: string;
  thread_id?: string;
}

// ============================================
// Type Guards
// ============================================

export function isThinkingEvent(event: SSEEvent): event is ThinkingEvent {
  return event.type === 'thinking';
}

export function isToolCallEvent(event: SSEEvent): event is ToolCallEvent {
  return event.type === 'tool_call';
}

export function isResponseDeltaEvent(event: SSEEvent): event is ResponseDeltaEvent {
  return event.type === 'response_delta';
}

export function isErrorEvent(event: SSEEvent): event is ErrorEvent {
  return event.type === 'error';
}

export function isDoneEvent(event: SSEEvent): event is DoneEvent {
  return event.type === 'done';
}
