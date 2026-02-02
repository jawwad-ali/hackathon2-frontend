'use client';

import { useState, useEffect } from 'react';

export type HealthStatus = 'checking' | 'healthy' | 'degraded' | 'unavailable';

export interface HealthCheckResult {
  status: HealthStatus;
  message?: string;
  mcpServerStatus?: string;
  openaiStatus?: string;
}

/**
 * useHealthCheck - Checks backend health on mount
 *
 * Calls the /health endpoint to determine if:
 * - Backend is available
 * - MCP server is connected
 * - OpenAI API is accessible
 *
 * Returns a status that can be used to show warnings.
 */
export function useHealthCheck(): HealthCheckResult {
  const [result, setResult] = useState<HealthCheckResult>({
    status: 'checking',
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Derive health URL from chat API URL
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/chat/stream';
        const baseUrl = chatApiUrl.replace('/chat/stream', '');
        const healthUrl = `${baseUrl}/health`;

        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Short timeout for health check
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          setResult({
            status: 'unavailable',
            message: 'Backend server is not responding correctly',
          });
          return;
        }

        const data = await response.json();

        // Check for degraded mode (MCP server issues)
        if (data.mcp_server === 'disconnected' || data.mcp_server === 'error') {
          setResult({
            status: 'degraded',
            message: 'Some features may be limited',
            mcpServerStatus: data.mcp_server,
            openaiStatus: data.openai,
          });
          return;
        }

        // Check for OpenAI issues
        if (data.openai === 'error' || data.openai === 'unavailable') {
          setResult({
            status: 'degraded',
            message: 'AI responses may be delayed',
            mcpServerStatus: data.mcp_server,
            openaiStatus: data.openai,
          });
          return;
        }

        // All healthy
        setResult({
          status: 'healthy',
          mcpServerStatus: data.mcp_server,
          openaiStatus: data.openai,
        });
      } catch (error) {
        // Network error or timeout
        setResult({
          status: 'unavailable',
          message: 'Unable to connect to server',
        });
      }
    };

    checkHealth();
  }, []);

  return result;
}

export default useHealthCheck;
