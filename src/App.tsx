// @ts-nocheck
import React, { useState } from 'react';

// Hooks
import { useFileHandler } from './hooks/useFileHandler'; 
import { useScrollSync } from './hooks/useScrollSync';
import { useHotkeys } from './hooks/useHotkeys';

// Components
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { Workspace } from './components/Workspace';
import { SearchReplace } from './components/SearchReplace';
import { ContextMenu } from './components/ContextMenu';
import { ThemePicker } from './components/ThemePicker';

function App() {
  const { content, setContent, filePath, isDragging, isDirty, handleOpenFile, handleSave } = useFileHandler();
  const scrollHook = useScrollSync();
  
  const [mode, setMode] = useState('split'); 
  const [zoom, setZoom] = useState(1); 
  const [showSearch, setShowSearch] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [theme, setTheme] = useState('default');
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false); // NEW State

  const handleExportPDF = () => {
    const oldMode = mode;
    const oldZoom = zoom;
    setMode('view');
    setZoom(1);
    setFocusMode(false);
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

  useHotkeys({
    onSave: handleSave,
    onSearch: () => setShowSearch(prev => !prev),
    onEscape: () => { 
        if (showThemePicker) setShowThemePicker(false);
        else if (showSearch) setShowSearch(false);
        else if (focusMode) setFocusMode(false); 
    },
    onZoomIn: () => setZoom(z => Math.min(z + 0.1, 2.0)),
    onZoomOut: () => setZoom(z => Math.max(z - 0.1, 0.5)),
    onZoomReset: () => setZoom(1)
  });

  // Calculate Class for Theme
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
      
      {!focusMode && (
        <TitleBar 
            title={filePath ? filePath.split(/[\\/]/).pop() : 'Neudit MD (Untitled)'} 
            isDirty={isDirty} 
        />
      )}

      <div className={`flex-1 flex flex-col p-4 gap-4 relative h-0 ${focusMode ? 'pt-4' : 'pt-2'}`}>
        
        {isDragging && (
            <div className="absolute inset-4 z-50 bg-neu-base/90 flex items-center justify-center border-4 border-dashed border-neu-dark/50 rounded-xl backdrop-blur-sm pointer-events-none">
                <div className="text-2xl font-bold text-neu-text/70 animate-pulse">Drop Markdown File Here</div>
            </div>
        )}

        {/* OVERLAYS */}
        {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />}
        {showSearch && <SearchReplace onClose={() => setShowSearch(false)} onReplaceAll={handleReplaceAll} />}
        {showThemePicker && (
            <ThemePicker 
                currentTheme={theme} 
                onSelectTheme={(t) => { setTheme(t); setShowThemePicker(false); }} 
                onClose={() => setShowThemePicker(false)} 
            />
        )}
        
        {focusMode && (
            <div className="absolute top-2 right-4 z-40 opacity-30 hover:opacity-100 transition-opacity">
                <button onClick={() => setFocusMode(false)} className="text-xs text-neu-text bg-neu-base px-3 py-1 rounded-full shadow-neu-flat border border-white/50">Exit Focus (ESC)</button>
            </div>
        )}

        {!focusMode && (
            <Toolbar 
                mode={mode} 
                setMode={setMode} 
                onOpen={handleOpenFile} 
                onSave={handleSave} 
                onExport={handleExportPDF} 
                onToggleFocus={() => setFocusMode(true)}
                onOpenThemePicker={() => setShowThemePicker(true)}
            />
        )}

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