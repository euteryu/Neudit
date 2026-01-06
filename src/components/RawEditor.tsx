// @ts-nocheck
import React from 'react';

export const RawEditor = ({ content, onChange, scrollRef, onScroll }) => {
  return (
    <textarea
      ref={scrollRef}
      onScroll={onScroll}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className="w-full h-full p-4 bg-neu-base text-neu-text resize-none outline-none font-mono text-sm leading-relaxed shadow-inner rounded-xl"
      style={{ boxShadow: 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)' }}
      placeholder="# Type Markdown here..."
    />
  );
};