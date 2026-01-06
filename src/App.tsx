// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useFileHandler } from './hooks/useFileHandler'; // Our new Hook
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar'; // Our new Component
import { Editor } from './components/Editor';
import { RawEditor } from './components/RawEditor';
import { Viewer } from './components/Viewer';

function App() {
  const { content, setContent, filePath, isDragging, handleOpenFile, handleSave } = useFileHandler();
  const [mode, setMode] = useState('split'); 

  // Scroll Sync Refs
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleScroll = (sourceRef: any, targetRef: any) => {
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
    setTimeout(() => { isSyncing.current = false; }, 50);
  };

  const handleExportPDF = () => {
    const oldMode = mode;
    setMode('view');
    setTimeout(() => { window.print(); setMode(oldMode); }, 500);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="h-screen flex flex-col bg-neu-base text-neu-text rounded-xl overflow-hidden border border-white/50 shadow-2xl">
      
      <TitleBar title={filePath ? filePath.split(/[\\/]/).pop() : 'Untitled.md'} />

      {/* Main Content Area */}
      {/* FIX: h-0 flex-1 is crucial for scrolling to work inside flex containers */}
      <div className="flex-1 flex flex-col p-4 gap-4 pt-2 relative h-0">
        
        {isDragging && (
            <div className="absolute inset-4 z-50 bg-neu-base/90 flex items-center justify-center border-4 border-dashed border-neu-dark/50 rounded-xl backdrop-blur-sm pointer-events-none">
                <div className="text-2xl font-bold text-neu-text/70 animate-pulse">Drop Markdown File Here</div>
            </div>
        )}

        <Toolbar 
          mode={mode} 
          setMode={setMode} 
          onOpen={handleOpenFile} 
          onSave={handleSave} 
          onExport={handleExportPDF} 
        />

        {/* Panels */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
            {mode !== 'view' && (
                <div className={`flex flex-col rounded-2xl shadow-neu-pressed bg-neu-base overflow-hidden transition-all ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                    {mode === 'edit' ? (
                        <div className="h-full flex-1 overflow-hidden">
                             {/* Editor handles its own scrolling internally */}
                             <Editor 
                                content={content} 
                                onChange={setContent} 
                             />
                        </div>
                    ) : (
                        <div className="h-full flex-1 relative">
                            {/* RawEditor needs absolute positioning or h-full to scroll correctly */}
                            <div className="absolute inset-0">
                                <RawEditor 
                                    content={content} 
                                    onChange={setContent} 
                                    scrollRef={leftScrollRef}
                                    onScroll={() => handleScroll(leftScrollRef, rightScrollRef)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {(mode === 'view' || mode === 'split') && (
                <div 
                    ref={rightScrollRef}
                    onScroll={() => handleScroll(rightScrollRef, leftScrollRef)}
                    className={`rounded-2xl shadow-neu-flat bg-[#fcfcfc] overflow-y-auto transition-all p-2 ${mode === 'split' ? 'w-1/2' : 'w-full'}`}
                >
                    <Viewer content={content} filePath={filePath} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;