// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'; 
import { open, save } from '@tauri-apps/plugin-dialog';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { FileText, Save, FolderOpen, Columns, Eye, Edit3, FileDown } from 'lucide-react';
import { NeuButton } from './components/NeuButton';
import { Editor } from './components/Editor';
import { Viewer } from './components/Viewer';

function App() {
  const [content, setContent] = useState('# Welcome to Neumorph MD\nDrag a file here or open one.');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [mode, setMode] = useState('split'); 

  const editorScrollRef = useRef<HTMLDivElement>(null);
  const viewerScrollRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  // --- Scroll Sync Logic ---
  const handleScroll = (sourceRef: any, targetRef: any) => {
    if (!sourceRef.current || !targetRef.current || isSyncing.current) return;
    isSyncing.current = true;
    const source = sourceRef.current;
    const target = targetRef.current;
    
    // Calculate percentage
    const maxSource = source.scrollHeight - source.clientHeight;
    const maxTarget = target.scrollHeight - target.clientHeight;
    
    if (maxSource > 0 && maxTarget > 0) {
        const percentage = source.scrollTop / maxSource;
        target.scrollTop = percentage * maxTarget;
    }

    setTimeout(() => { isSyncing.current = false; }, 50);
  };

  const loadFile = async (path: string) => {
    try {
        const text = await readTextFile(path);
        setFilePath(path);
        setContent(text);
        await getCurrentWindow().setTitle(`Neumorph MD - ${path}`);
    } catch (e) {
        console.error("Failed to read file", e);
    }
  };

  const handleOpenFile = async () => {
    try {
      const selected = await open({
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
      });
      if (selected) {
        const path = Array.isArray(selected) ? selected[0] : selected;
        if (path) loadFile(path);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      if (filePath) {
        await writeTextFile(filePath, content);
      } else {
        const savePath = await save({ filters: [{ name: 'Markdown', extensions: ['md'] }] });
        if (savePath) {
          await writeTextFile(savePath, content);
          setFilePath(savePath);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleExportPDF = () => {
    const oldMode = mode;
    setMode('view');
    setTimeout(() => { window.print(); setMode(oldMode); }, 500);
  };

  // --- Native & HTML5 Drag and Drop ---
  useEffect(() => {
    // 1. Tauri OS-level Drop (Window Frame)
    const unlisten = listen('tauri://file-drop', (event) => {
      const paths = event.payload as string[];
      if (paths && paths.length > 0) loadFile(paths[0]);
    });

    // 2. HTML5 Webview Drop (Inner Content)
    const handleWebDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Check if file was dropped
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            // Note: In Webview, direct file access might be limited in production, 
            // but normally it provides a File object. 
            // However, Tauri drag-drop usually handles paths best via the event above.
            // If the event above fails, we might rely on this, 
            // but standard web files don't give full paths for security.
            // We use this mainly to prevent the browser from opening the file as a raw page.
            
            // If strictly needed, we can read the file content here:
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if(ev.target?.result) setContent(ev.target.result as string);
            };
            reader.readAsText(file);
            setFilePath(null); // We lose the path in web-drop, usually.
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault(); // Essential to allow dropping
        e.stopPropagation();
    };

    window.addEventListener('drop', handleWebDrop);
    window.addEventListener('dragover', handleDragOver);

    return () => {
      unlisten.then(f => f());
      window.removeEventListener('drop', handleWebDrop);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filePath, content]);

  return (
    <div className="h-screen flex flex-col bg-neu-base p-4 gap-4">
      <div className="flex items-center justify-between p-2 rounded-2xl shadow-neu-flat">
        <div className="flex gap-4">
            <div className="text-neu-text font-bold px-4 flex items-center gap-2">
                <FileText size={20} />
                <span>{filePath ? filePath.split(/[\\/]/).pop() : 'Untitled'}</span>
            </div>
        </div>

        <div className="flex gap-3">
            <div className="flex gap-2 mr-4 bg-neu-base rounded-xl p-1 shadow-neu-pressed">
                <NeuButton active={mode === 'edit'} onClick={() => setMode('edit')} className="!shadow-none !p-2"><Edit3 size={18}/></NeuButton>
                <NeuButton active={mode === 'split'} onClick={() => setMode('split')} className="!shadow-none !p-2"><Columns size={18}/></NeuButton>
                <NeuButton active={mode === 'view'} onClick={() => setMode('view')} className="!shadow-none !p-2"><Eye size={18}/></NeuButton>
            </div>
            <NeuButton onClick={handleOpenFile} title="Open"><FolderOpen size={20} /></NeuButton>
            <NeuButton onClick={handleSave} title="Save"><Save size={20} /></NeuButton>
            <NeuButton onClick={handleExportPDF} title="Export PDF"><FileDown size={20} /></NeuButton>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {(mode === 'edit' || mode === 'split') && (
            <div className={`flex-1 rounded-2xl shadow-neu-pressed bg-neu-base overflow-hidden flex flex-col transition-all ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                {/* UPDATED: Pass onScroll to Editor component */}
                <Editor 
                    content={content} 
                    onChange={setContent} 
                    scrollRef={editorScrollRef}
                    onScroll={() => handleScroll(editorScrollRef, viewerScrollRef)}
                />
            </div>
        )}
        {(mode === 'view' || mode === 'split') && (
            <div 
                ref={viewerScrollRef}
                onScroll={() => handleScroll(viewerScrollRef, editorScrollRef)}
                className={`flex-1 rounded-2xl shadow-neu-flat bg-[#fcfcfc] overflow-auto transition-all p-2 ${mode === 'split' ? 'w-1/2' : 'w-full'}`}
            >
                <Viewer content={content} filePath={filePath} />
            </div>
        )}
      </div>
    </div>
  );
}

export default App;