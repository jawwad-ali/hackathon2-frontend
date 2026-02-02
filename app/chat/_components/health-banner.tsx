'use client';

import { AlertTriangle, WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import type { HealthStatus } from '../_hooks/use-health-check';

interface HealthBannerProps {
  status: HealthStatus;
  message?: string;
}

/**
 * HealthBanner - Shows warning when backend is degraded or unavailable
 *
 * - Yellow banner for degraded mode (partial functionality)
 * - Red banner for unavailable (no connectivity)
 * - Dismissible by user
 * - Hidden when healthy or checking
 */
export function HealthBanner({ status, message }: HealthBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if healthy, checking, or dismissed
  if (status === 'healthy' || status === 'checking' || dismissed) {
    return null;
  }

  const isUnavailable = status === 'unavailable';
  const bgColor = isUnavailable ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20';
  const borderColor = isUnavailable ? 'border-red-200 dark:border-red-800' : 'border-amber-200 dark:border-amber-800';
  const textColor = isUnavailable ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200';
  const iconColor = isUnavailable ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400';
  const Icon = isUnavailable ? WifiOff : AlertTriangle;

  const defaultMessage = isUnavailable
    ? 'Unable to connect to the server. Please check your connection.'
    : 'Some features may be limited. The assistant is running in degraded mode.';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${bgColor} border-b ${borderColor} animate-slide-down`}
      role="alert"
    >
      <Icon size={18} className={iconColor} aria-hidden="true" />
      <p className={`flex-1 text-sm font-medium ${textColor}`}>
        {message || defaultMessage}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className={`p-1 ${textColor} hover:opacity-70 transition-all duration-200 hover:scale-110 active:scale-95`}
        aria-label="Dismiss warning"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default HealthBanner;
