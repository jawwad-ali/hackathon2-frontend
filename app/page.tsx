'use client';

import { useCallback } from 'react';
import {
  Header,
  Sidebar,
  ChatWindow,
  HistoryChat,
} from './chat/_components';

export default function Home() {
  const handleSelectHistory = useCallback((text: string) => {
    console.log('Selected history:', text);
    // TODO: Implement history selection - could populate input or load previous conversation
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Row: Header + Sidebar User Profile aligned */}
      {/* Hidden on mobile - chat takes full screen */}
      <div className="hidden sm:flex max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header (Logo + Nav) */}
        <div className="flex-1">
          <Header />
        </div>

        {/* Sidebar area spacer - only on large screens */}
        <div className="hidden lg:block w-[300px] shrink-0" />
      </div>

      {/* Main Content Row */}
      <div className="flex max-w-[1400px] mx-auto px-0 sm:px-4 md:px-6 gap-0 sm:gap-4 md:gap-6">
        {/* Center: Chat Window with streaming integration */}
        {/* Full width on mobile, flex on larger screens */}
        <ChatWindow />

        {/* Right: Sidebar - hidden on mobile and tablet */}
        <Sidebar>
          <HistoryChat onSelectHistory={handleSelectHistory} />
        </Sidebar>
      </div>
    </div>
  );
}
