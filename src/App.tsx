// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'; 
import { open, save } from '@tauri-apps/plugin-dialog';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { FileText, Save, FolderOpen, Columns, Eye, Edit3, FileDown } from 'lucide-react';

// Import local components
import { NeuButton } from './components/NeuButton';
import { Editor } from './components/Editor';
import { Viewer } from './components/Viewer';

function App() {
  const [content, setContent] = useState('# Welcome to Neumorph MD\nDrag a file here or open one.');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [mode, setMode] = useState('split'); 

  const handleOpenFile = async () => {
    try {
      const selected = await open({
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
      });
      if (selected) {
        // Handle both single string or array of strings result
        const path = Array.isArray(selected) ? selected[0] : selected;
        if (path) loadFile(path);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadFile = async (path: string) => {
    const text = await readTextFile(path);
    setFilePath(path);
    setContent(text);
    await getCurrentWindow().setTitle(`Neumorph MD - ${path}`);
  };

  const handleSave = async () => {
    try {
      if (filePath) {
        await writeTextFile(filePath, content);
      } else {
        const savePath = await save({
          filters: [{ name: 'Markdown', extensions: ['md'] }]
        });
        if (savePath) {
          await writeTextFile(savePath, content);
          setFilePath(savePath);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPDF = () => {
    const oldMode = mode;
    setMode('view');
    setTimeout(() => {
        window.print();
        setMode(oldMode);
    }, 500);
  };

  useEffect(() => {
    const unlisten = listen('tauri://file-drop', (event) => {
      const paths = event.payload as string[];
      if (paths && paths.length > 0) {
        loadFile(paths[0]);
      }
    });
    return () => {
      unlisten.then(f => f());
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
            <div className={`flex-1 rounded-2xl shadow-neu-pressed bg-neu-base overflow-auto transition-all ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <Editor content={content} onChange={setContent} />
            </div>
        )}
        {(mode === 'view' || mode === 'split') && (
            <div className={`flex-1 rounded-2xl shadow-neu-flat bg-[#fcfcfc] overflow-auto transition-all p-2 ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <Viewer content={content} filePath={filePath} />
            </div>
        )}
      </div>
    </div>
  );
}

export default App;