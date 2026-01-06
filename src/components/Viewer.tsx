// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { convertFileSrc } from '@tauri-apps/api/core'; 

export const Viewer = ({ content, filePath }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  // PERFORMANCE: Only update view 150ms after user stops typing
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
    <div className="prose prose-slate max-w-none p-4 pb-20">
      <ReactMarkdown urlTransform={transformImageUri}>
        {debouncedContent}
      </ReactMarkdown>
    </div>
  );
};