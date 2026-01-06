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
        { label: "Bold", cmd: "Ctrl + B" },
        { label: "Italic", cmd: "Ctrl + I" },
        { label: "Insert Image", cmd: "Toolbar Button" },
      ]
    }
  ];

  return (
    <div className="absolute inset-0 z-[110] bg-neu-base/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      {/* Increased Width to 600px */}
      <div className="bg-neu-base p-8 rounded-2xl shadow-neu-flat border border-white/50 w-[600px] max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-neu-text font-bold uppercase tracking-wider text-lg">
              <Keyboard size={24} />
              <span>Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neu-dark/20 text-neu-text/50">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-bold text-neu-text/60 text-sm uppercase border-b border-neu-dark/10 pb-2">{section.title}</h3>
              <div className="space-y-3">
                {section.keys.map((k) => (
                  <div key={k.label} className="flex justify-between items-center text-base"> {/* Increased to text-base */}
                    <span className="text-neu-text opacity-90 font-medium">{k.label}</span>
                    {/* Increased padding and font size for keys */}
                    <kbd className="bg-neu-base px-3 py-1 rounded-md shadow-neu-flat text-sm font-mono font-bold border border-white/40 text-neu-text/80 whitespace-nowrap ml-2">
                        {k.cmd}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center text-sm text-neu-text/40">
            Press <kbd className="font-bold">ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};