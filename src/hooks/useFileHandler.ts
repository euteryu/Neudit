// @ts-nocheck
import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'; 
import { open, save } from '@tauri-apps/plugin-dialog';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const useFileHandler = () => {
  const [content, setContent] = useState('# Welcome to Neumorph MD\nDrag a file here or open one.');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadFile = async (path: string) => {
    try {
      const text = await readTextFile(path);
      setFilePath(path);
      setContent(text);
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

  // Drag and Drop Listeners
  useEffect(() => {
    const unlisten = listen('tauri://drag-drop', (event) => {
      setIsDragging(false);
      const payload = event.payload as any;
      const paths = payload.paths || payload;
      if (paths && Array.isArray(paths) && paths.length > 0) loadFile(paths[0]);
    });

    const unlistenV1 = listen('tauri://file-drop', (event) => {
        setIsDragging(false);
        const paths = event.payload as string[];
        if (paths && paths.length > 0) loadFile(paths[0]);
    });

    const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { if (e.clientX === 0 && e.clientY === 0) setIsDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      unlisten.then(f => f());
      unlistenV1.then(f => f());
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  return {
    content,
    setContent,
    filePath,
    isDragging,
    handleOpenFile,
    handleSave,
    loadFile
  };
};