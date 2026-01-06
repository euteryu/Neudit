// @ts-nocheck
import { useRef } from 'react';

export const useScrollSync = () => {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleScroll = (sourceRef: React.RefObject<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
    if (!sourceRef.current || !targetRef.current || isSyncing.current) return;
    
    isSyncing.current = true;
    const source = sourceRef.current;
    const target = targetRef.current;
    
    const maxSource = source.scrollHeight - source.clientHeight;
    const maxTarget = target.scrollHeight - target.clientHeight;
    
    if (maxSource > 0 && maxTarget > 0) {
        const percentage = source.scrollTop / maxSource;
        target.scrollTop = percentage * maxTarget;
    }
    
    // Debounce the lock release
    setTimeout(() => { isSyncing.current = false; }, 50);
  };

  return {
    leftScrollRef,
    rightScrollRef,
    handleLeftScroll: () => handleScroll(leftScrollRef, rightScrollRef),
    handleRightScroll: () => handleScroll(rightScrollRef, leftScrollRef)
  };
};