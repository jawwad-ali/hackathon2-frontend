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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header Row - fixed height, hidden on mobile */}
      <div className="hidden sm:block shrink-0">
        <div className="flex max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Header (Logo + Nav) */}
          <div className="flex-1">
            <Header />
          </div>

          {/* Sidebar area spacer - only on large screens */}
          <div className="hidden lg:block w-[300px] shrink-0" />
        </div>
      </div>

      {/* Main Content Row - takes remaining height */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto px-0 sm:px-4 md:px-6 gap-0 sm:gap-4 md:gap-6 sm:pb-6">
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
