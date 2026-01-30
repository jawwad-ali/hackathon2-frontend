'use client';

import { useRef, useCallback } from 'react';
import {
  Header,
  Sidebar,
  ChatContainer,
  ChatInput,
  AssistantMessage,
  UserMessage,
  HistoryChat,
} from './chat/_components';

// Mock messages for demonstration
const mockMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content:
      'Artificial Intelligence (AI) refers to intelligent computer systems that can learn, reason, and perform tasks that typically require human intelligence. It involves techniques like machine learning, natural language processing, and computer vision to analyze data, make decisions, and interact with humans. AI has applications in various fields and has the potential to revolutionize industries and improve efficiency and productivity.',
  },
  {
    id: '2',
    role: 'user' as const,
    content: 'What can Artificial Intelligence do?',
  },
  {
    id: '3',
    role: 'assistant' as const,
    content:
      'Artificial Intelligence (AI) can automate tasks, analyze data, understand human language, recognize images, personalize recommendations, detect fraud, assist in healthcare, power virtual assistants, and enable autonomous systems. Its capabilities continue to expand and advance.',
  },
];

export default function Home() {
  const messagesRef = useRef(mockMessages);

  const handleSendMessage = useCallback((message: string) => {
    console.log('Sending message:', message);
  }, []);

  const handleClearChat = useCallback(() => {
    console.log('Clearing chat');
  }, []);

  const handleNewChat = useCallback(() => {
    console.log('Starting new chat');
  }, []);

  const handleSelectHistory = useCallback((text: string) => {
    console.log('Selected history:', text);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Row: Header + Sidebar User Profile aligned */}
      <div className="flex max-w-[1400px] mx-auto px-6">
        {/* Header (Logo + Nav) */}
        <div className="flex-1">
          <Header />
        </div>

        {/* Sidebar area spacer */}
        <div className="hidden lg:block w-[300px] shrink-0" />
      </div>

      {/* Main Content Row */}
      <div className="flex max-w-[1400px] mx-auto px-6 gap-6">
        {/* Center: Chat Container */}
        <ChatContainer
          title="Super Chat"
          onClearChat={handleClearChat}
          onNewChat={handleNewChat}
          inputArea={
            <ChatInput onSubmit={handleSendMessage} disabled={false} />
          }
        >
          {messagesRef.current.map((msg) =>
            msg.role === 'user' ? (
              <UserMessage key={msg.id} content={msg.content} />
            ) : (
              <AssistantMessage key={msg.id} content={msg.content} />
            )
          )}
        </ChatContainer>

        {/* Right: Sidebar */}
        <Sidebar>
          <HistoryChat onSelectHistory={handleSelectHistory} />
        </Sidebar>
      </div>
    </div>
  );
}
