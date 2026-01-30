'use client';

import { Zap } from 'lucide-react';
import { EXAMPLE_PROMPTS, UI_TEXT } from '../_lib/constants';

interface WelcomeScreenProps {
  /** Callback when user clicks an example prompt */
  onPromptClick: (prompt: string) => void;
}

/**
 * WelcomeScreen - Displays welcome message and example prompts
 *
 * Features (FR-012):
 * - Centered welcome message with avatar icon
 * - Example prompts from constants (clickable)
 * - Responsive layout (stacked on mobile, wrapped on desktop)
 *
 * Design Specifications:
 * - Avatar: Emerald circle with lightning bolt icon (matches assistant)
 * - Title/Subtitle: From UI_TEXT constants
 * - Prompts: From EXAMPLE_PROMPTS constants, styled as pills/chips
 */
export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12 px-4">
      {/* Avatar - matches assistant avatar style */}
      <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full mb-3 sm:mb-4">
        <Zap
          size={28}
          className="text-emerald-500 fill-emerald-500 sm:w-8 sm:h-8"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        {UI_TEXT.welcomeTitle}
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-md mb-4 sm:mb-6">
        {UI_TEXT.welcomeSubtitle}
      </p>

      {/* Example prompts - stack on mobile, wrap on larger screens */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center w-full sm:max-w-lg mb-4 sm:mb-6">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptClick(prompt)}
            className="
              px-4 py-2 text-sm text-gray-600 bg-gray-100
              hover:bg-emerald-50 hover:text-emerald-700
              rounded-full transition-colors
              w-full sm:w-auto
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            "
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Tip about stateless nature */}
      <p className="text-xs text-gray-400 max-w-xs">
        <span className="font-medium">Tip:</span> Be specific in each message — include todo IDs or details for best results.
      </p>
    </div>
  );
}

export default WelcomeScreen;
