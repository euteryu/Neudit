// @ts-nocheck
import { useState, useEffect, useRef } from 'react'; // Added useRef
import { listen } from '@tauri-apps/api/event';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'; 
import { open, save } from '@tauri-apps/plugin-dialog';

export const useFileHandler = () => {
  const [content, setContent] = useState('# Welcome to Neudit MD\nDrag a file here or open one.');
  const [savedContent, setSavedContent] = useState('# Welcome to Neudit MD\nDrag a file here or open one.'); 
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // FIX: Use a Ref to track live content for async handlers
  const contentRef = useRef(content);
  
  // Keep Ref in sync with State
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const isDirty = content !== savedContent;

  const loadFile = async (path: string) => {
    try {
      const text = await readTextFile(path);
      setFilePath(path);
      setContent(text);
      setSavedContent(text); // Reset dirty state
    } catch (e) {
      console.error("Failed to read file", e);
      alert("Failed to load file.");
    }
  };

  const handleOpenFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
      });
      if (selected) {
        // Handle both string and array return types safely
        const path = Array.isArray(selected) ? selected[0] : selected;
        if (path) loadFile(path);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      // FIX: Use contentRef.current to ensure we save the LATEST text
      const textToSave = contentRef.current;

      if (filePath) {
        await writeTextFile(filePath, textToSave);
        setSavedContent(textToSave); // Sync saved state
      } else {
        const savePath = await save({ filters: [{ name: 'Markdown', extensions: ['md'] }] });
        if (savePath) {
          await writeTextFile(savePath, textToSave);
          setFilePath(savePath);
          setSavedContent(textToSave);
        }
      }
    } catch (err) { 
      console.error(err); 
      alert("Failed to save file.");
    }
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
    isDirty,
    handleOpenFile,
    handleSave,
    loadFile
  };
};