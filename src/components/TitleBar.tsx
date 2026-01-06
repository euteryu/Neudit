// @ts-nocheck
import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, FileText } from 'lucide-react';

export const TitleBar = ({ title }) => {
  const appWindow = getCurrentWindow();

  return (
    <div className="h-10 flex items-center justify-between pl-4 pr-2 select-none bg-neu-base rounded-t-xl overflow-hidden">
      
      {/* 
         DRAG REGION: 
         We apply 'data-tauri-drag-region' ONLY to this container.
         It takes up all available space (flex-1), allowing you to drag 
         from anywhere except the buttons.
      */}
      <div 
        data-tauri-drag-region 
        className="flex-1 h-full flex items-center gap-2 text-neu-text text-sm font-bold opacity-70"
      >
        {/* Pointer events none ensures clicking the text passes through to the drag region */}
        <div className="flex items-center gap-2 pointer-events-none">
            <FileText size={16} />
            <span>{title || 'Untitled'}</span>
        </div>
      </div>

      {/* 
         WINDOW CONTROLS:
         These are OUTSIDE the drag region div.
         We also add 'z-50' to ensure they sit on top.
      */}
      <div className="flex gap-2 z-50">
        <button 
          onClick={() => appWindow.minimize()} 
          className="p-1.5 rounded-full hover:bg-neu-dark/20 text-neu-text transition-colors flex items-center justify-center"
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={() => appWindow.toggleMaximize()} 
          className="p-1.5 rounded-full hover:bg-neu-dark/20 text-neu-text transition-colors flex items-center justify-center"
          title="Maximize"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={() => appWindow.close()} 
          className="p-1.5 rounded-full hover:bg-red-400 hover:text-white text-neu-text transition-colors flex items-center justify-center"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};