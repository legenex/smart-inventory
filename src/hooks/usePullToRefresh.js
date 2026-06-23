import { useState, useRef, useEffect } from 'react';

const THRESHOLD = 70;
const MAX_PULL = 120;

export function usePullToRefresh(onRefresh) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const currentPull = useRef(0);
  const callbackRef = useRef(onRefresh);

  useEffect(() => {
    callbackRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY <= 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling.current || isRefreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0) {
        const eased = Math.min(diff * 0.5, MAX_PULL);
        currentPull.current = eased;
        setPullDistance(eased);
      }
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (currentPull.current >= THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(THRESHOLD);
        currentPull.current = THRESHOLD;
        try {
          await callbackRef.current?.();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          currentPull.current = 0;
        }
      } else {
        setPullDistance(0);
        currentPull.current = 0;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing]);

  return { pullDistance, isRefreshing };
}