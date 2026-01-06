// @ts-nocheck
import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, FileText, Circle } from 'lucide-react';

export const TitleBar = ({ title, isDirty }) => {
  const appWindow = getCurrentWindow();

  return (
    <div className="titlebar-area h-10 flex items-center justify-between pl-4 pr-2 select-none bg-neu-base rounded-t-xl overflow-hidden shrink-0 z-50">
      
      <div 
        data-tauri-drag-region 
        className="flex-1 h-full flex items-center gap-2 text-neu-text text-sm font-bold opacity-70"
      >
        <div className="flex items-center gap-2 pointer-events-none">
            <FileText size={16} />
            <span>{title || 'Untitled'}</span>
            {/* Unsaved Indicator */}
            {isDirty && (
                <div className="flex items-center gap-1 text-orange-500 animate-pulse ml-2" title="Unsaved Changes">
                    <Circle size={8} fill="currentColor" />
                </div>
            )}
        </div>
      </div>

      <div className="flex gap-2 z-50">
        <button onClick={() => appWindow.minimize()} className="p-1.5 rounded-full hover:bg-neu-dark/20 text-neu-text transition-colors flex items-center justify-center">
          <Minus size={14} />
        </button>
        <button onClick={() => appWindow.toggleMaximize()} className="p-1.5 rounded-full hover:bg-neu-dark/20 text-neu-text transition-colors flex items-center justify-center">
          <Square size={12} />
        </button>
        <button onClick={() => appWindow.close()} className="p-1.5 rounded-full hover:bg-red-400 hover:text-white text-neu-text transition-colors flex items-center justify-center">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};