// @ts-nocheck
import { useEffect } from 'react';

interface HotkeyHandlers {
  onSave: () => void;
  onOpen: () => void;
  onSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onEscape: () => void;
  onToggleFocus: () => void;
}

export const useHotkeys = (handlers: HotkeyHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SAVE: Ctrl + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handlers.onSave();
      }
      // OPEN: Ctrl + O
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handlers.onOpen();
      }
      // SEARCH: Ctrl + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch();
      }
      // FOCUS MODE: Ctrl + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        handlers.onToggleFocus();
      }
      // ESCAPE
      if (e.key === 'Escape') {
        handlers.onEscape();
      }
      // ZOOM Logic
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handlers.onZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === '-')) {
        e.preventDefault();
        handlers.onZoomOut();
      }
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