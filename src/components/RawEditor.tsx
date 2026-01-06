// @ts-nocheck
import React from 'react';
import { useImagePaster } from '../hooks/useImagePaster'; // Import hook

export const RawEditor = ({ content, onChange, scrollRef, onScroll, filePath }) => {
  const { saveImage } = useImagePaster(filePath);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const markdownLink = await saveImage(blob);
          if (markdownLink) {
             // Insert at cursor
             const textarea = e.target as HTMLTextAreaElement;
             const start = textarea.selectionStart;
             const end = textarea.selectionEnd;
             const newContent = content.substring(0, start) + markdownLink + content.substring(end);
             onChange(newContent);
             
             // Restore cursor (timeout needed for React render cycle)
             setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + markdownLink.length;
             }, 0);
          }
        }
        return; // Stop after first image
      }
    }
  };

  return (
    <textarea
      ref={scrollRef}
      onScroll={onScroll}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onPaste={handlePaste} // <--- Added Listener
      spellCheck={false}
      className="w-full h-full p-4 bg-neu-base text-neu-text resize-none outline-none font-mono text-base leading-7 shadow-inner rounded-xl transition-colors duration-300"
      style={{ boxShadow: 'var(--shadow-neu-pressed)' }}
      placeholder="# Type Markdown here..."
    />
  );
};