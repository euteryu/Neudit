// @ts-nocheck
import React, { useEffect } from 'react';
import { X, Palette } from 'lucide-react';
import { NeuButton } from './NeuButton';

const themes = [
  { id: 'default', name: 'Neudit Classic', color: '#e0e5ec' },
  { id: 'glacier', name: 'Glacier Blue', color: '#e4ebf5' },
  { id: 'sepia', name: 'Sepia Coffee', color: '#e8e0d5' },
  { id: 'rouge', name: 'Rouge Rose', color: '#f0e4e6' },
  { id: 'rainbow', name: 'Rainbow Holo', color: '#ecf0f3', special: true },
];

export const ThemePicker = ({ onClose, currentTheme, onSelectTheme }) => {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="absolute top-16 right-4 z-[100] bg-neu-base p-6 rounded-2xl shadow-neu-flat border border-white/50 w-72 animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-neu-text font-bold uppercase tracking-wider text-sm">
            <Palette size={16} />
            <span>Theme Gallery</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-neu-dark/20 text-neu-text/50">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTheme(t.id)}
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all outline-none
              ${currentTheme === t.id ? 'shadow-neu-pressed text-neu-text font-bold' : 'shadow-neu-flat hover:-translate-y-0.5 opacity-80 hover:opacity-100'}
            `}
          >
            {/* Color Swatch */}
            <div 
                className="w-8 h-8 rounded-full shadow-inner border border-white/20" 
                style={{ 
                    backgroundColor: t.color,
                    background: t.special ? 'linear-gradient(135deg, #ecf0f3 0%, #ffffff 100%)' : t.color
                }}
            >
                {t.special && <div className="w-full h-full rounded-full opacity-50 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.2),rgba(255,0,128,0.2))]" />}
            </div>
            
            <span className="text-sm">{t.name}</span>
            
            {currentTheme === t.id && <div className="ml-auto w-2 h-2 rounded-full bg-neu-text/50" />}
          </button>
        ))}
      </div>
    </div>
  );
};