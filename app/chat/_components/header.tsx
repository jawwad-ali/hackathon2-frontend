'use client';

import { Zap } from 'lucide-react';
import { navItems } from '../_lib/design-tokens';

/**
 * Header - Navigation header with logo and tabs
 *
 * Reference Design Analysis:
 * - Background: transparent (same as page)
 * - NO border-bottom
 * - Logo + Nav tabs positioned together on the LEFT
 * - User profile is NOT in header (it's in sidebar area)
 */
export function Header() {
  return (
    <header className="flex items-center h-16 px-6 pt-4" role="banner">
      {/* Logo */}
      <div
        className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="Super Chat logo"
      >
        <Zap size={24} className="text-emerald-500 fill-emerald-500" aria-hidden="true" />
      </div>

      {/* Navigation Tabs - positioned right next to logo */}
      <nav className="flex items-center gap-1 ml-6" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            aria-current={item.active ? 'page' : undefined}
            className={`
              px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200
              ${
                item.active
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
