'use client';

import { ReactNode } from 'react';
import { UserProfile } from './user-profile';

interface SidebarProps {
  children?: ReactNode;
}

/**
 * Sidebar - Right sidebar container with user profile at top
 *
 * Reference Design:
 * - Width: ~300px
 * - User profile at TOP (aligned with header height)
 * - Content below (History Chat, Pro Plan card)
 */
export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col shrink-0 w-[300px]">
      {/* User Profile - aligned with header */}
      <div className="h-16 flex items-center pt-4">
        <UserProfile />
      </div>

      {/* Sidebar Content */}
      <div className="flex flex-col gap-6 mt-6">
        {children}
      </div>
    </aside>
  );
}

export default Sidebar;
