'use client';

import { Bell, Settings } from 'lucide-react';

/**
 * UserProfile - User info section for sidebar top
 *
 * Reference Design:
 * - Positioned at top-right of sidebar area
 * - Avatar + Username + notification/settings icons
 */
export function UserProfile() {
  return (
    <div className="flex items-center justify-end gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-600">IK</span>
      </div>

      {/* Username */}
      <span className="text-sm font-medium text-gray-900">ikkiseek</span>

      {/* Notification Icon */}
      <button
        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-400" />
      </button>

      {/* Settings Icon */}
      <button
        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
        aria-label="Settings"
      >
        <Settings size={20} className="text-gray-400" />
      </button>
    </div>
  );
}

export default UserProfile;
