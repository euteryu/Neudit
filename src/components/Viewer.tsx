// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw'; // <--- NEW IMPORT
import 'katex/dist/katex.min.css'; 
import { convertFileSrc } from '@tauri-apps/api/core'; 

export const Viewer = ({ content, filePath, mode }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 150);
    return () => clearTimeout(handler);
  }, [content]);

  const transformImageUri = (uri) => {
    if (uri.startsWith('http') || uri.startsWith('https')) return uri;
    
    if (filePath) {
      // 1. Get Directory of the MD file
      // We accept both / and \ to be safe
      const lastSlash = Math.max(filePath.lastIndexOf('\\'), filePath.lastIndexOf('/'));
      const dir = filePath.substring(0, lastSlash);
      
      // 2. Clean up the incoming URI (remove ./ or leading /)
      let cleanUri = uri;
      if (cleanUri.startsWith('./')) cleanUri = cleanUri.slice(2);
      if (cleanUri.startsWith('/')) cleanUri = cleanUri.slice(1);
      
      // 3. Construct absolute path
      // IMPORTANT: convertFileSrc handles the OS specifics, 
      // but we need to ensure we join them with the correct OS separator first.
      const isWindows = filePath.includes('\\');
      const sep = isWindows ? '\\' : '/';
      
      // On Windows, image.png might become .../assets\image.png
      // We replace forward slashes in the URI with backslashes if on Windows
      if (isWindows) {
          cleanUri = cleanUri.replace(/\//g, '\\');
      }

      const fullPath = `${dir}${sep}${cleanUri}`;
      
      return convertFileSrc(fullPath);
    }
    return uri;
  };

  return (
    <div className={`prose prose-slate max-w-none p-8 pb-20 transition-colors duration-300 ${mode === 'view' ? 'bg-white' : 'bg-neu-base brightness-105'}`}>
      <ReactMarkdown 
        urlTransform={transformImageUri}
        remarkPlugins={[remarkMath]}
        // ADD rehypeRaw here to render HTML tags (<img>) correctly
        rehypePlugins={[rehypeKatex, rehypeRaw]} 
      >
        {debouncedContent}
      </ReactMarkdown>
    </div>
  );
};