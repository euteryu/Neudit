// @ts-nocheck
import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

export const HotkeysModal = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sections = [
    {
      title: "Global App",
      keys: [
        { label: "Open File", cmd: "Ctrl + O" },
        { label: "Save File", cmd: "Ctrl + S" },
        { label: "Export PDF", cmd: "Ctrl + P" },
        { label: "Search / Replace", cmd: "Ctrl + F" },
        { label: "Focus Mode", cmd: "Ctrl + Shift + F" },
        { label: "Zoom In/Out", cmd: "Ctrl + / -" },
      ]
    },
    {
      title: "Rich Editor",
      keys: [
        { label: "Heading 1", cmd: "Ctrl + H" },
        { label: "Blockquote", cmd: "Ctrl + Q" },
        { label: "Bold / Italic", cmd: "Ctrl + B / I" },
        { label: "Insert Image", cmd: "Toolbar Button" },
      ]
    }
  ];

  return (
    <div className="absolute inset-0 z-[110] bg-neu-base/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-neu-base p-6 rounded-2xl shadow-neu-flat border border-white/50 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-neu-text font-bold uppercase tracking-wider text-sm">
              <Keyboard size={18} />
              <span>Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neu-dark/20 text-neu-text/50">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="font-bold text-neu-text/60 text-xs uppercase border-b border-neu-dark/10 pb-1">{section.title}</h3>
              <div className="space-y-2">
                {section.keys.map((k) => (
                  <div key={k.label} className="flex justify-between items-center text-sm">
                    <span className="text-neu-text opacity-80">{k.label}</span>
                    <kbd className="bg-neu-base px-2 py-0.5 rounded shadow-neu-flat text-xs font-mono font-bold border border-white/40 text-neu-text/70">{k.cmd}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center text-xs text-neu-text/40">
            Press <kbd className="font-bold">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};