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
    <header className="flex items-center h-16 px-6 pt-4">
      {/* Logo */}
      <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-full shrink-0">
        <Zap size={24} className="text-emerald-500 fill-emerald-500" />
      </div>

      {/* Navigation Tabs - positioned right next to logo */}
      <nav className="flex items-center gap-1 ml-6">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              px-5 py-2.5 text-sm font-medium rounded-full transition-colors
              ${
                item.active
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }
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
