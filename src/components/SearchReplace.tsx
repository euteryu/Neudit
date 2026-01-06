// @ts-nocheck
import React, { useState } from 'react';
import { Search, X, Replace, ArrowRight } from 'lucide-react';
import { NeuButton } from './NeuButton';

export const SearchReplace = ({ onClose, onReplaceAll }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleReplace = () => {
    if (!findText) return;
    onReplaceAll(findText, replaceText);
  };

  return (
    <div className="absolute top-4 right-4 z-50 bg-neu-base p-4 rounded-2xl shadow-neu-flat border border-white/50 w-80 animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-neu-text/70 uppercase tracking-wider">Search & Replace</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-neu-dark/20 text-neu-text/50">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Find Input */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Find..." 
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                autoFocus
                className="w-full p-2 pl-9 bg-neu-base rounded-xl text-neu-text outline-none text-sm placeholder-neu-text/40 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-shadow"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-neu-text/50" />
        </div>

        {/* Replace Input */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Replace with..." 
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-full p-2 pl-9 bg-neu-base rounded-xl text-neu-text outline-none text-sm placeholder-neu-text/40 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] focus:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] transition-shadow"
            />
            <ArrowRight size={14} className="absolute left-3 top-2.5 text-neu-text/50" />
        </div>

        {/* Action Button */}
        <NeuButton onClick={handleReplace} className="w-full !py-2 text-sm gap-2">
            <Replace size={14} />
            <span>Replace All</span>
        </NeuButton>
      </div>
    </div>
  );
};