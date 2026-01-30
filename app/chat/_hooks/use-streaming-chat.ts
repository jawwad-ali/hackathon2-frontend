'use client';

import { useRef, useCallback } from 'react';
import type { Message, StreamState, ToolExecution, MessageError } from '../_lib/types';
import type {
  SSEEvent,
  SSEEventType,
  ChatStreamRequest,
  ThinkingEventData,
  ToolCallEventData,
  ResponseDeltaEventData,
  ErrorEventData,
  DoneEventData,
} from '../_lib/sse-types';
import { chatConfig } from '../_lib/config';

// ============================================
// Types
// ============================================

export interface UseStreamingChatReturn {
  /** Current list of messages */
  messages: Message[];
  /** Current stream state (idle, thinking, streaming, tool-executing, error) */
  streamState: StreamState;
  /** Send a message and start streaming */
  sendMessage: (content: string) => Promise<void>;
  /** Clear all messages and reset state */
  clearMessages: () => void;
  /** Retry the last failed message */
  retryLastMessage: () => Promise<void>;
  /** Whether a stream is currently active */
  isStreaming: boolean;
}

interface StreamingState {
  messages: Message[];
  streamState: StreamState;
  lastUserMessage: string | null;
  abortController: AbortController | null;
}

// ============================================
// SSE Parser
// ============================================

function parseSSELine(line: string): { event?: string; data?: string } | null {
  if (!line || line.startsWith(':')) {
    return null; // Comment or empty line
  }

  if (line.startsWith('event:')) {
    return { event: line.slice(6).trim() };
  }

  if (line.startsWith('data:')) {
    return { data: line.slice(5).trim() };
  }

  return null;
}

function parseSSEEvent(eventType: string, dataStr: string): SSEEvent | null {
  try {
    const data = JSON.parse(dataStr);

    switch (eventType as SSEEventType) {
      case 'thinking':
        return { type: 'thinking', data: data as ThinkingEventData };
      case 'tool_call':
        return { type: 'tool_call', data: data as ToolCallEventData };
      case 'response_delta':
        return { type: 'response_delta', data: data as ResponseDeltaEventData };
      case 'error':
        return { type: 'error', data: data as ErrorEventData };
      case 'done':
        return { type: 'done', data: data as DoneEventData };
      default:
        console.warn(`Unknown SSE event type: ${eventType}`);
        return null;
    }
  } catch (e) {
    console.error('Failed to parse SSE event data:', e);
    return null;
  }
}

// ============================================
// Hook Implementation
// ============================================

export function useStreamingChat(): UseStreamingChatReturn {
  // Use refs for state to avoid re-renders during streaming
  // We'll use a forceUpdate pattern for UI updates
  const stateRef = useRef<StreamingState>({
    messages: [],
    streamState: { status: 'idle' },
    lastUserMessage: null,
    abortController: null,
  });

  // Force update mechanism using useRef + callback
  const updateCallbacksRef = useRef<Set<() => void>>(new Set());
  const forceUpdateRef = useRef(0);

  const triggerUpdate = useCallback(() => {
    forceUpdateRef.current += 1;
    updateCallbacksRef.current.forEach((cb) => cb());
  }, []);

  // Generate unique message ID
  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  // Process SSE stream
  const processStream = useCallback(
    async (response: Response, assistantMessageId: string) => {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEventType = '';
      let accumulatedContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const parsed = parseSSELine(line);

            if (!parsed) {
              continue;
            }

            if (parsed.event) {
              currentEventType = parsed.event;
              continue;
            }

            if (parsed.data && currentEventType) {
              const event = parseSSEEvent(currentEventType, parsed.data);

              if (!event) {
                continue;
              }

              // Handle each event type
              switch (event.type) {
                case 'thinking':
                  stateRef.current.streamState = { status: 'thinking' };
                  triggerUpdate();
                  break;

                case 'tool_call': {
                  const toolData = event.data;
                  const toolStatus: ToolExecution['status'] =
                    toolData.status === 'executing' ? 'executing' :
                    toolData.status === 'completed' ? 'completed' : 'failed';

                  // Find the assistant message
                  const msgIndex = stateRef.current.messages.findIndex(
                    (m) => m.id === assistantMessageId
                  );

                  if (msgIndex !== -1) {
                    const msg = stateRef.current.messages[msgIndex];
                    const existingTools = msg.toolCalls || [];

                    // Check if this tool already exists (by name) to update its status
                    const existingToolIndex = existingTools.findIndex(
                      (t) => t.name === toolData.tool && t.status === 'executing'
                    );

                    let updatedTools: ToolExecution[];
                    let currentToolExecution: ToolExecution;

                    if (existingToolIndex !== -1 && (toolStatus === 'completed' || toolStatus === 'failed')) {
                      // Update existing tool's status (completion/failure)
                      currentToolExecution = {
                        ...existingTools[existingToolIndex],
                        status: toolStatus,
                        completedAt: new Date(),
                      };
                      updatedTools = [
                        ...existingTools.slice(0, existingToolIndex),
                        currentToolExecution,
                        ...existingTools.slice(existingToolIndex + 1),
                      ];
                    } else if (toolStatus === 'executing') {
                      // New tool execution starting
                      currentToolExecution = {
                        id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        name: toolData.tool,
                        status: 'executing',
                        startedAt: new Date(),
                      };
                      updatedTools = [...existingTools, currentToolExecution];
                    } else {
                      // Fallback: create new tool entry (for completed/failed without prior executing)
                      currentToolExecution = {
                        id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        name: toolData.tool,
                        status: toolStatus,
                        startedAt: new Date(),
                        completedAt: new Date(),
                      };
                      updatedTools = [...existingTools, currentToolExecution];
                    }

                    // Update message with tool calls
                    stateRef.current.messages[msgIndex] = {
                      ...msg,
                      toolCalls: updatedTools,
                    };

                    // Update stream state based on tool status
                    if (toolStatus === 'executing') {
                      stateRef.current.streamState = {
                        status: 'tool-executing',
                        tool: currentToolExecution,
                      };
                    } else if (toolStatus === 'completed') {
                      // Tool completed, transition back to thinking/streaming
                      stateRef.current.streamState = { status: 'thinking' };
                    } else if (toolStatus === 'failed') {
                      // Tool failed - keep showing it briefly, then continue
                      stateRef.current.streamState = {
                        status: 'tool-executing',
                        tool: currentToolExecution,
                      };
                    }
                  }
                  triggerUpdate();
                  break;
                }

                case 'response_delta': {
                  accumulatedContent += event.data.content;
                  stateRef.current.streamState = {
                    status: 'streaming',
                    partialContent: accumulatedContent,
                  };

                  // Update assistant message content
                  const msgIdx = stateRef.current.messages.findIndex(
                    (m) => m.id === assistantMessageId
                  );
                  if (msgIdx !== -1) {
                    stateRef.current.messages[msgIdx] = {
                      ...stateRef.current.messages[msgIdx],
                      content: accumulatedContent,
                      isStreaming: true,
                    };
                  }
                  triggerUpdate();
                  break;
                }

                case 'error': {
                  const errorData = event.data;
                  const error: MessageError = {
                    code: errorData.code || errorData.error_type || 'unknown',
                    message: errorData.message,
                    // Use backend's recoverable flag, default to true if not provided
                    retryable: errorData.recoverable ?? true,
                  };

                  stateRef.current.streamState = { status: 'error', error };

                  // Update assistant message with error
                  const errorMsgIdx = stateRef.current.messages.findIndex(
                    (m) => m.id === assistantMessageId
                  );
                  if (errorMsgIdx !== -1) {
                    stateRef.current.messages[errorMsgIdx] = {
                      ...stateRef.current.messages[errorMsgIdx],
                      isStreaming: false,
                      error,
                    };
                  }
                  triggerUpdate();
                  break;
                }

                case 'done': {
                  // Finalize the message
                  const doneMsgIdx = stateRef.current.messages.findIndex(
                    (m) => m.id === assistantMessageId
                  );
                  if (doneMsgIdx !== -1) {
                    stateRef.current.messages[doneMsgIdx] = {
                      ...stateRef.current.messages[doneMsgIdx],
                      content: event.data.full_response || accumulatedContent,
                      isStreaming: false,
                      thinkingState: 'complete',
                    };
                  }

                  stateRef.current.streamState = { status: 'idle' };
                  triggerUpdate();
                  break;
                }
              }

              // Reset event type after processing
              currentEventType = '';
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
    [triggerUpdate]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return;
      }

      // Abort any existing stream
      if (stateRef.current.abortController) {
        stateRef.current.abortController.abort();
      }

      const abortController = new AbortController();
      stateRef.current.abortController = abortController;
      stateRef.current.lastUserMessage = content;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date(),
      };

      // Create placeholder assistant message
      const assistantMessageId = generateId();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true,
        thinkingState: 'thinking',
      };

      stateRef.current.messages = [
        ...stateRef.current.messages,
        userMessage,
        assistantMessage,
      ];
      stateRef.current.streamState = { status: 'thinking' };
      triggerUpdate();

      try {
        const requestBody: ChatStreamRequest = {
          message: content.trim(),
          request_id: generateId(),
        };

        const response = await fetch(chatConfig.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(requestBody),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        await processStream(response, assistantMessageId);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // Request was aborted, ignore
          return;
        }

        const errorMessage: MessageError = {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          retryable: true,
        };

        stateRef.current.streamState = { status: 'error', error: errorMessage };

        // Update assistant message with error
        const errorMsgIdx = stateRef.current.messages.findIndex(
          (m) => m.id === assistantMessageId
        );
        if (errorMsgIdx !== -1) {
          stateRef.current.messages[errorMsgIdx] = {
            ...stateRef.current.messages[errorMsgIdx],
            isStreaming: false,
            error: errorMessage,
          };
        }
        triggerUpdate();
      } finally {
        stateRef.current.abortController = null;
      }
    },
    [generateId, processStream, triggerUpdate]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    if (stateRef.current.abortController) {
      stateRef.current.abortController.abort();
    }

    stateRef.current = {
      messages: [],
      streamState: { status: 'idle' },
      lastUserMessage: null,
      abortController: null,
    };
    triggerUpdate();
  }, [triggerUpdate]);

  // Retry last message
  const retryLastMessage = useCallback(async () => {
    const lastMessage = stateRef.current.lastUserMessage;
    if (!lastMessage) {
      return;
    }

    // Remove the last assistant message (which has the error)
    const messages = stateRef.current.messages;
    if (messages.length >= 2) {
      const lastAssistantIdx = messages.length - 1;
      const lastUserIdx = messages.length - 2;

      if (
        messages[lastAssistantIdx].role === 'assistant' &&
        messages[lastUserIdx].role === 'user'
      ) {
        // Remove both the failed assistant message and the user message
        stateRef.current.messages = messages.slice(0, -2);
        triggerUpdate();
      }
    }

    // Resend the message
    await sendMessage(lastMessage);
  }, [sendMessage, triggerUpdate]);

  // Compute isStreaming
  const isStreaming =
    stateRef.current.streamState.status === 'thinking' ||
    stateRef.current.streamState.status === 'streaming' ||
    stateRef.current.streamState.status === 'tool-executing';

  return {
    messages: stateRef.current.messages,
    streamState: stateRef.current.streamState,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isStreaming,
  };
}

export default useStreamingChat;
