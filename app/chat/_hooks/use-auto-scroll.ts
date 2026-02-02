import { useRef, useCallback, useEffect } from 'react';

/**
 * Options for the useAutoScroll hook
 */
export interface UseAutoScrollOptions {
  /**
   * Threshold in pixels from the bottom to consider "at bottom"
   * If user scrolls up beyond this threshold, auto-scroll is disabled
   * @default 100
   */
  threshold?: number;

  /**
   * Scroll behavior - 'smooth' for animation, 'auto' for instant
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;
}

/**
 * Return type for the useAutoScroll hook
 */
export interface UseAutoScrollReturn {
  /**
   * Ref to attach to the scrollable container element
   */
  scrollRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Ref to attach to the content/end marker element
   * This element should be at the bottom of the scrollable content
   */
  endRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Manually trigger a scroll to the bottom
   * Useful when you know content has been added
   */
  scrollToBottom: () => void;

  /**
   * Check if the container is currently scrolled to the bottom
   * (within the threshold)
   */
  isAtBottom: () => boolean;
}

/**
 * useAutoScroll - Auto-scroll hook using useRef pattern (no useState)
 *
 * This hook provides auto-scrolling functionality for chat interfaces.
 * It uses only useRef for state management to avoid unnecessary re-renders
 * during streaming content updates.
 *
 * Features:
 * - Automatically scrolls to bottom when new content arrives (if already at bottom)
 * - Respects user scroll position - if user scrolls up, auto-scroll is paused
 * - Resumes auto-scroll when user scrolls back to bottom
 * - Uses IntersectionObserver for efficient scroll detection
 *
 * @example
 * ```tsx
 * function MessageList({ messages }: { messages: Message[] }) {
 *   const { scrollRef, endRef, scrollToBottom } = useAutoScroll();
 *
 *   return (
 *     <div ref={scrollRef} className="overflow-y-auto h-full">
 *       {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
 *       <div ref={endRef} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutoScroll(options: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const { threshold = 100, behavior = 'smooth' } = options;

  // Ref for the scrollable container
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Ref for the end marker element (placed at bottom of content)
  const endRef = useRef<HTMLDivElement | null>(null);

  // Track whether auto-scroll should be active (using ref to avoid re-renders)
  const shouldAutoScrollRef = useRef<boolean>(true);

  /**
   * Check if the scroll container is at (or near) the bottom
   */
  const isAtBottom = useCallback((): boolean => {
    const container = scrollRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, [threshold]);

  /**
   * Scroll to the bottom of the container
   */
  const scrollToBottom = useCallback((): void => {
    const end = endRef.current;
    if (end) {
      end.scrollIntoView({ behavior, block: 'end' });
    }
  }, [behavior]);

  /**
   * Handle scroll events to determine if auto-scroll should be active
   * If user scrolls up (away from bottom), disable auto-scroll
   * If user scrolls back to bottom, re-enable auto-scroll
   */
  const handleScroll = useCallback((): void => {
    shouldAutoScrollRef.current = isAtBottom();
  }, [isAtBottom]);

  /**
   * Set up scroll listener and IntersectionObserver
   */
  useEffect(() => {
    const container = scrollRef.current;
    const end = endRef.current;

    if (!container) return;

    // Add scroll listener to track user scroll position
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Use IntersectionObserver to detect when end marker becomes visible
    // This triggers auto-scroll when new content pushes the end marker into view
    let observer: IntersectionObserver | null = null;

    if (end) {
      observer = new IntersectionObserver(
        (entries) => {
          // If end marker is not visible and we should auto-scroll, do it
          const [entry] = entries;
          if (!entry.isIntersecting && shouldAutoScrollRef.current) {
            scrollToBottom();
          }
        },
        {
          root: container,
          threshold: 0,
        }
      );

      observer.observe(end);
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (observer && end) {
        observer.unobserve(end);
        observer.disconnect();
      }
    };
  }, [handleScroll, scrollToBottom]);

  /**
   * Auto-scroll when shouldAutoScrollRef is true
   * This effect runs on mount and when dependencies change
   */
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  return {
    scrollRef,
    endRef,
    scrollToBottom,
    isAtBottom,
  };
}

export default useAutoScroll;
