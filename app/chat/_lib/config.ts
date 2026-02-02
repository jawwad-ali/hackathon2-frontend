import type { ChatConfig } from './types';

export const chatConfig: ChatConfig = {
  apiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000/chat/stream',
};

export function validateConfig(): void {
  if (!chatConfig.apiUrl) {
    throw new Error(
      'Chat API URL is not configured. Set NEXT_PUBLIC_CHAT_API_URL environment variable.'
    );
  }
}
