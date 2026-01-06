// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css'; 
import { readFile } from '@tauri-apps/plugin-fs'; // Import Binary Reader

// --- CUSTOM IMAGE COMPONENT ---
// This handles loading local files into Blob URLs bypassing asset.localhost
const LocalImage = ({ src, alt, filePath }: { src?: string, alt?: string, filePath: string | null }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      if (!src) return;
      
      // 1. If it's a web URL, just show it
      if (src.startsWith('http://') || src.startsWith('https://')) {
        setImageSrc(src);
        return;
      }

      // 2. If it's local, we need to resolve the path manually
      if (filePath) {
        try {
           // Normalize Path: Windows prefers Backslashes, but JS prefers Forward. 
           // We'll standardise to Forward Slashes for calculation, then OS specific for reading if needed.
           // However, Tauri v2's fs plugin usually handles forward slashes fine on Windows.
           
           // A. Get Directory of MD file
           const normalizedFilePath = filePath.replace(/\\/g, '/');
           const lastSlash = normalizedFilePath.lastIndexOf('/');
           const dir = normalizedFilePath.substring(0, lastSlash);

           // B. Clean the incoming src (remove ./ or leading /)
           let cleanSrc = src.replace(/\\/g, '/');
           if (cleanSrc.startsWith('./')) cleanSrc = cleanSrc.slice(2);
           if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.slice(1);

           // C. Construct Absolute Path
           const fullPath = `${dir}/${cleanSrc}`;

           // D. Read File as Binary
           const data = await readFile(fullPath);
           
           // E. Create Blob URL
           const blob = new Blob([data]);
           objectUrl = URL.createObjectURL(blob);
           
           if (active) setImageSrc(objectUrl);

        } catch (err) {
          console.error("Failed to load image:", src, err);
          // Optional: Set a placeholder or keep undefined
        }
      }
    };

    loadImage();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl); // Cleanup memory
    };
  }, [src, filePath]);

  return (
    <img 
      src={imageSrc || ""} 
      alt={alt} 
      className={imageSrc ? "opacity-100 transition-opacity" : "opacity-0"} 
      style={{ maxWidth: '100%', borderRadius: '8px' }}
    />
  );
};

// --- VIEWER COMPONENT ---
export const Viewer = ({ content, filePath, mode }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 150);
    return () => clearTimeout(handler);
  }, [content]);

  return (
    <div className={`prose prose-slate max-w-none p-8 pb-20 transition-colors duration-300 ${mode === 'view' ? 'bg-white' : 'bg-neu-base brightness-105'}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          // Override the default img tag with our smart loader
          img: ({node, ...props}) => <LocalImage {...props} filePath={filePath} />
        }}
      >
        {debouncedContent}
      </ReactMarkdown>
    </div>
  );
};