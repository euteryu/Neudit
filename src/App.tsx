// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useFileHandler } from './hooks/useFileHandler'; 
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { RawEditor } from './components/RawEditor';
import { Viewer } from './components/Viewer';

function App() {
  const { content, setContent, filePath, isDragging, handleOpenFile, handleSave } = useFileHandler();
  const [mode, setMode] = useState('split'); 
  const [zoom, setZoom] = useState(1); // 1 = 100%

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
    // Reset zoom for printing to avoid huge/tiny PDF text
    const oldZoom = zoom;
    setZoom(1);
    setTimeout(() => { 
        window.print(); 
        setMode(oldMode);
        setZoom(oldZoom);
    }, 500);
  };

  // Keyboard Shortcuts (Save & Zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SAVE: Ctrl + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // ZOOM IN: Ctrl + = (or + on numpad)
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(z => Math.min(z + 0.1, 2.0)); // Max 200%
      }

      // ZOOM OUT: Ctrl + -
      if ((e.ctrlKey || e.metaKey) && (e.key === '-')) {
        e.preventDefault();
        setZoom(z => Math.max(z - 0.1, 0.5)); // Min 50%
      }

      // RESET ZOOM: Ctrl + 0
      if ((e.ctrlKey || e.metaKey) && (e.key === '0')) {
        e.preventDefault();
        setZoom(1);
      }
    };

    // Wheel Zoom (Ctrl + Scroll)
    const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                setZoom(z => Math.min(z + 0.1, 2.0));
            } else {
                setZoom(z => Math.max(z - 0.1, 0.5));
            }
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('wheel', handleWheel);
    };
  }, [handleSave]);

  return (
    // FIX: We apply the zoom to this container, but NOT the TitleBar (optional choice)
    // Actually, usually TitleBars stay static size while content zooms. 
    // Let's wrap the content below the titlebar in the zoom style.
    <div className="h-screen flex flex-col bg-neu-base text-neu-text rounded-xl overflow-hidden border border-white/50 shadow-2xl">
      
      {/* TitleBar stays constant size usually */}
      <TitleBar title={filePath ? filePath.split(/[\\/]/).pop() : 'Untitled.md'} />

      {/* Main Content Area - Zoom Applied Here */}
      <div 
        className="flex-1 flex flex-col p-4 gap-4 pt-2 relative h-0 origin-top"
        style={{ zoom: zoom }} // CSS Zoom property (Works in Tauri/Chrome)
      >
        
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
                             <Editor 
                                content={content} 
                                onChange={setContent} 
                             />
                        </div>
                    ) : (
                        <div className="h-full flex-1 relative">
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