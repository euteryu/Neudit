// @ts-nocheck
import React, { useState } from 'react';

// Hooks (Logic)
import { useFileHandler } from './hooks/useFileHandler'; 
import { useScrollSync } from './hooks/useScrollSync';
import { useHotkeys } from './hooks/useHotkeys';

// Components (UI)
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { Workspace } from './components/Workspace';
import { SearchReplace } from './components/SearchReplace';
import { ContextMenu } from './components/ContextMenu';
import { ThemePicker } from './components/ThemePicker';
import { HotkeysModal } from './components/HotkeysModal'; // NEW Import

function App() {
  // 1. Logic & State Hooks
  const { content, setContent, filePath, isDragging, isDirty, handleOpenFile, handleSave } = useFileHandler();
  const scrollHook = useScrollSync();
  
  // 2. UI State
  const [mode, setMode] = useState<'edit'|'split'|'view'>('split'); 
  const [zoom, setZoom] = useState(1); 
  const [theme, setTheme] = useState('default');
  
  // 3. Modal/Overlay States
  const [showSearch, setShowSearch] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  // 4. Handlers
  const handleExportPDF = () => {
    const oldMode = mode;
    const oldZoom = zoom;
    setMode('view');
    setZoom(1);
    setFocusMode(false);
    
    // Allow React render cycle to update before printing
    setTimeout(() => { 
        window.print(); 
        setMode(oldMode);
        setZoom(oldZoom);
    }, 500);
  };

  const handleReplaceAll = (find: string, replace: string) => {
    if(!find) return;
    setContent(content.replaceAll(find, replace));
    setShowSearch(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // 5. Global Hotkeys Registration
  useHotkeys({
    onSave: handleSave,
    onOpen: handleOpenFile, // Ctrl + O
    onSearch: () => setShowSearch(prev => !prev),
    onToggleFocus: () => setFocusMode(prev => !prev),
    onEscape: () => { 
        if (showThemePicker) setShowThemePicker(false);
        else if (showHotkeys) setShowHotkeys(false);
        else if (showSearch) setShowSearch(false);
        else if (focusMode) setFocusMode(false);
        else if (contextMenu) setContextMenu(null);
    },
    onZoomIn: () => setZoom(z => Math.min(z + 0.1, 2.0)),
    onZoomOut: () => setZoom(z => Math.max(z - 0.1, 0.5)),
    onZoomReset: () => setZoom(1)
  });

  // 6. Theme Class Helper
  const getThemeClass = () => {
    switch(theme) {
        case 'glacier': return 'theme-glacier';
        case 'sepia': return 'theme-sepia';
        case 'rouge': return 'theme-rouge';
        case 'rainbow': return 'theme-rainbow';
        default: return '';
    }
  };

  return (
    <div 
        onContextMenu={handleContextMenu}
        className={`h-screen flex flex-col bg-neu-base text-neu-text rounded-xl overflow-hidden border border-white/50 shadow-2xl transition-all ${getThemeClass()}`}
    >
      
      {/* 7. Top Title Bar (Hidden in Focus Mode) */}
      {!focusMode && (
        <TitleBar 
            title={filePath ? filePath.split(/[\\/]/).pop() : 'Neudit MD (Untitled)'} 
            isDirty={isDirty} 
        />
      )}

      {/* 8. Main Container */}
      <div className={`flex-1 flex flex-col p-4 gap-4 relative h-0 ${focusMode ? 'pt-4' : 'pt-2'}`}>
        
        {/* --- OVERLAYS LAYER --- */}
        {isDragging && (
            <div className="absolute inset-4 z-[200] bg-neu-base/90 flex items-center justify-center border-4 border-dashed border-neu-dark/50 rounded-xl backdrop-blur-sm pointer-events-none">
                <div className="text-2xl font-bold text-neu-text/70 animate-pulse">Drop Markdown File Here</div>
            </div>
        )}

        {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />}
        
        {showSearch && <SearchReplace onClose={() => setShowSearch(false)} onReplaceAll={handleReplaceAll} />}
        
        {showHotkeys && <HotkeysModal onClose={() => setShowHotkeys(false)} />}
        
        {showThemePicker && (
            <ThemePicker 
                currentTheme={theme} 
                onSelectTheme={(t) => { setTheme(t); setShowThemePicker(false); }} 
                onClose={() => setShowThemePicker(false)} 
            />
        )}
        
        {focusMode && (
            <div className="absolute top-2 right-4 z-40 opacity-30 hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => setFocusMode(false)} 
                    className="text-xs text-neu-text bg-neu-base px-3 py-1 rounded-full shadow-neu-flat border border-white/50"
                >
                    Exit Focus (ESC)
                </button>
            </div>
        )}

        {/* --- TOOLBAR LAYER --- */}
        {!focusMode && (
            <Toolbar 
                mode={mode} 
                setMode={setMode} 
                onOpen={handleOpenFile} 
                onSave={handleSave} 
                onExport={handleExportPDF} 
                onToggleFocus={() => setFocusMode(true)}
                onOpenThemePicker={() => setShowThemePicker(true)}
                onOpenHelp={() => setShowHotkeys(true)}
            />
        )}

        {/* --- WORKSPACE LAYER --- */}
        <Workspace 
            mode={mode}
            content={content}
            setContent={setContent}
            filePath={filePath}
            zoom={zoom}
            scrollHook={scrollHook}
        />
      </div>
    </div>
  );
}

export default App;