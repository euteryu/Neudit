// @ts-nocheck
import { useEffect } from 'react';

interface HotkeyHandlers {
  onSave: () => void;
  onSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onEscape: () => void;
}

export const useHotkeys = (handlers: HotkeyHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SAVE: Ctrl + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handlers.onSave();
      }
      // SEARCH: Ctrl + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch();
      }
      // ESCAPE
      if (e.key === 'Escape') {
        handlers.onEscape();
      }
      // ZOOM IN
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handlers.onZoomIn();
      }
      // ZOOM OUT
      if ((e.ctrlKey || e.metaKey) && (e.key === '-')) {
        e.preventDefault();
        handlers.onZoomOut();
      }
      // ZOOM RESET
      if ((e.ctrlKey || e.metaKey) && (e.key === '0')) {
        e.preventDefault();
        handlers.onZoomReset();
      }
    };

    const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            e.deltaY < 0 ? handlers.onZoomIn() : handlers.onZoomOut();
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('wheel', handleWheel);
    };
  }, [handlers]);
};