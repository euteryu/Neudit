// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import Math Styles
import { convertFileSrc } from '@tauri-apps/api/core'; 

// Receive 'mode' prop to determine background color
export const Viewer = ({ content, filePath, mode }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 150);
    return () => clearTimeout(handler);
  }, [content]);

  const transformImageUri = (uri) => {
    if (uri.startsWith('http')) return uri;
    if (filePath) {
      const lastSlash = Math.max(filePath.lastIndexOf('\\'), filePath.lastIndexOf('/'));
      const dir = filePath.substring(0, lastSlash);
      const cleanUri = uri.startsWith('./') ? uri.slice(2) : uri;
      return convertFileSrc(`${dir}/${cleanUri}`);
    }
    return uri;
  };

  return (
    // LOGIC: If mode is 'view', use white. If 'split', use theme background (bg-neu-base) but slightly lighter (brightness-105)
    <div className={`prose prose-slate max-w-none p-8 pb-20 transition-colors duration-300 ${mode === 'view' ? 'bg-white' : 'bg-neu-base brightness-105'}`}>
      <ReactMarkdown 
        urlTransform={transformImageUri}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {debouncedContent}
      </ReactMarkdown>
    </div>
  );
};