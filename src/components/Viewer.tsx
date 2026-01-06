// @ts-nocheck
import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { readFile } from '@tauri-apps/plugin-fs';

// --- 1. GLOBAL CACHE (The Anti-Flicker Mechanism) ---
// We store Blob URLs keyed by the full file path. 
// This ensures that if the component remounts, we grab the image 
// instantly from memory instead of reading from disk again.
const blobCache = new Map<string, string>();

// --- 2. CONTEXT ---
// Used to pass 'filePath' deep into the image component
const ViewerContext = React.createContext<{ filePath: string | null }>({ filePath: null });

// --- 3. STABLE COMPONENT DEFINITION ---
// Defined OUTSIDE Viewer so React doesn't destroy/recreate it on every keystroke
const LocalImage = ({ src, alt, title }: any) => {
  const { filePath } = useContext(ViewerContext);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const load = async () => {
      if (!src) return;

      // A. Web URLs -> Pass through
      if (src.startsWith('http://') || src.startsWith('https://')) {
        setImageSrc(src);
        return;
      }

      // B. Local Files -> Load via Binary + Blob
      if (filePath) {
        try {
           // Normalize Path Logic
           const normalizedFilePath = filePath.replace(/\\/g, '/');
           const lastSlash = normalizedFilePath.lastIndexOf('/');
           const dir = normalizedFilePath.substring(0, lastSlash);

           let cleanSrc = src.replace(/\\/g, '/');
           if (cleanSrc.startsWith('./')) cleanSrc = cleanSrc.slice(2);
           if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.slice(1);

           const fullPath = `${dir}/${cleanSrc}`;

           // CHECK CACHE: If we loaded this before, use it INSTANTLY
           if (blobCache.has(fullPath)) {
             setImageSrc(blobCache.get(fullPath));
             return;
           }

           // If not in cache, read from disk
           const data = await readFile(fullPath);
           const blob = new Blob([data]);
           const url = URL.createObjectURL(blob);
           
           // Store in cache
           blobCache.set(fullPath, url);
           
           if (isMounted.current) setImageSrc(url);

        } catch (err) {
          console.error("Image load error:", src);
        }
      }
    };

    load();

    return () => { isMounted.current = false; };
  }, [src, filePath]); 

  return (
    <img 
      src={imageSrc || ""} 
      alt={alt} 
      title={title}
      className="max-w-full rounded-lg my-4 shadow-sm"
      // Smooth fade-in to mask any tiny loading gaps
      style={{ opacity: imageSrc ? 1 : 0, transition: 'opacity 0.2s ease-in' }} 
    />
  );
};

// --- 4. VIEWER COMPONENT ---
export const Viewer = ({ content, filePath, mode }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  // Debounce typing updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 150);
    return () => clearTimeout(handler);
  }, [content]);

  return (
    // Wrap in Context Provider
    <ViewerContext.Provider value={{ filePath }}>
        <div className={`prose prose-slate max-w-none p-8 pb-20 transition-colors duration-300 ${mode === 'view' ? 'bg-white' : 'bg-neu-base brightness-105'}`}>
            <ReactMarkdown 
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                    // Pass the STABLE component reference.
                    // DO NOT write "img: (props) => ..." here, that causes the flicker!
                    img: LocalImage 
                }}
            >
                {debouncedContent}
            </ReactMarkdown>
        </div>
    </ViewerContext.Provider>
  );
};