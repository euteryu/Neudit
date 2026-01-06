// @ts-nocheck
import React from 'react';
import { Editor } from './Editor';
import { RawEditor } from './RawEditor';
import { Viewer } from './Viewer';

interface WorkspaceProps {
  mode: string;
  content: string;
  setContent: (s: string) => void;
  filePath: string | null;
  zoom: number;
  scrollHook: any; // Result from useScrollSync
}

export const Workspace = ({ mode, content, setContent, filePath, zoom, scrollHook }: WorkspaceProps) => {
  const { leftScrollRef, rightScrollRef, handleLeftScroll, handleRightScroll } = scrollHook;

  return (
    <div 
      className="flex-1 flex gap-4 overflow-hidden min-h-0 origin-top-left"
      style={{ zoom: zoom }}
    >
        {/* Left Panel (Editor) */}
        {mode !== 'view' && (
            <div className={`flex flex-col rounded-2xl shadow-neu-pressed bg-neu-base overflow-hidden transition-all ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                {mode === 'edit' ? (
                    <div className="h-full flex-1 overflow-hidden">
                            <Editor 
                            content={content} 
                            onChange={setContent} 
                            filePath={filePath} 
                            />
                    </div>
                ) : (
                    <div className="h-full flex-1 relative">
                        <div className="absolute inset-0">
                            <RawEditor 
                                content={content} 
                                onChange={setContent} 
                                scrollRef={leftScrollRef} 
                                onScroll={handleLeftScroll} 
                                filePath={filePath}
                            />
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Right Panel (Viewer) */}
        {(mode === 'view' || mode === 'split') && (
            <div 
                ref={rightScrollRef} 
                onScroll={handleRightScroll} 
                // Remove bg-[#fcfcfc] here, let the Viewer handle the background
                className={`rounded-2xl shadow-neu-flat overflow-y-auto transition-all p-2 ${mode === 'split' ? 'w-1/2' : 'w-full'}`}
            >
                {/* Pass mode down */}
                <Viewer content={content} filePath={filePath} mode={mode} />
            </div>
        )}
    </div>
  );
};