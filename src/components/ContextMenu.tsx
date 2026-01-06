// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Copy, Clipboard, Scissors, CheckSquare } from 'lucide-react';

export const ContextMenu = ({ x, y, onClose }) => {
  const menuRef = useRef(null);

  // Close if clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  // Clipboard Actions
  const handleCopy = async () => {
    const text = window.getSelection()?.toString();
    if (text) await navigator.clipboard.writeText(text);
    onClose();
  };

  const handlePaste = async () => {
    try {
      // Note: This requires the user to have focused an input recently
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
    onClose();
  };

  const handleCut = async () => {
    const text = window.getSelection()?.toString();
    if (text) {
        await navigator.clipboard.writeText(text);
        document.execCommand('delete');
    }
    onClose();
  };

  const handleSelectAll = () => {
    document.execCommand('selectAll');
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[999] bg-neu-base w-48 rounded-xl shadow-neu-flat border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      <div className="p-1.5 flex flex-col gap-1">
        <MenuItem icon={<Scissors size={14}/>} label="Cut" onClick={handleCut} />
        <MenuItem icon={<Copy size={14}/>} label="Copy" onClick={handleCopy} />
        <MenuItem icon={<Clipboard size={14}/>} label="Paste" onClick={handlePaste} />
        <div className="h-px bg-neu-dark/20 my-1 mx-2" />
        <MenuItem icon={<CheckSquare size={14}/>} label="Select All" onClick={handleSelectAll} />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neu-text rounded-lg hover:bg-neu-pressed hover:shadow-inner transition-all text-left"
  >
    <span className="opacity-70">{icon}</span>
    <span>{label}</span>
  </button>
);