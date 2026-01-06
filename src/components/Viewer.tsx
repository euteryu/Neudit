import React from 'react';
import ReactMarkdown from 'react-markdown';
// UPDATED: v2 location for convertFileSrc
import { convertFileSrc } from '@tauri-apps/api/core';

export const Viewer = ({ content, filePath }) => {
  
  // Custom image renderer to handle relative paths
  const transformImageUri = (uri) => {
    if (uri.startsWith('http')) return uri;
    
    // If we have a file path, resolve the image relative to it
    if (filePath) {
      // 1. Get directory of current file
      // Note: A rough JS split for MVP. For robustness use tauri path API.
      const lastSlash = Math.max(filePath.lastIndexOf('\\'), filePath.lastIndexOf('/'));
      const dir = filePath.substring(0, lastSlash);
      
      // 2. Combine dir + uri (remove ./ if present)
      const cleanUri = uri.startsWith('./') ? uri.slice(2) : uri;
      const fullPath = `${dir}/${cleanUri}`;
      
      // 3. Convert to Tauri asset protocol (asset:// or https://asset.localhost)
      return convertFileSrc(fullPath);
    }
    return uri;
  };

  return (
    <div className="prose prose-slate max-w-none p-4">
      <ReactMarkdown 
        urlTransform={transformImageUri}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};