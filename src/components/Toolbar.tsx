// @ts-nocheck
import React from 'react';
import { Save, FolderOpen, Columns, Eye, Edit3, FileDown, Maximize2, Palette, HelpCircle } from 'lucide-react';
import { NeuButton } from './NeuButton';

interface ToolbarProps {
  mode: 'edit' | 'split' | 'view';
  setMode: (m: 'edit' | 'split' | 'view') => void;
  onOpen: () => void;
  onSave: () => void;
  onExport: () => void;
  onToggleFocus: () => void;
  onOpenThemePicker: () => void;
  onOpenHelp: () => void;
}

export const Toolbar = ({ 
  mode, 
  setMode, 
  onOpen, 
  onSave, 
  onExport, 
  onToggleFocus, 
  onOpenThemePicker,
  onOpenHelp
}: ToolbarProps) => {
  return (
    <div className="toolbar-area flex items-center justify-between p-2 rounded-2xl shadow-neu-flat shrink-0 transition-all duration-300 z-30 relative">
      
      {/* LEFT: View Modes */}
      <div className="flex gap-3">
         <div className="flex gap-2 bg-neu-base rounded-xl p-1 shadow-neu-pressed">
          <NeuButton active={mode === 'edit'} onClick={() => setMode('edit')} className="!shadow-none !p-2" title="Rich Editor (Ctrl+E)">
            <Edit3 size={18}/>
          </NeuButton>
          <NeuButton active={mode === 'split'} onClick={() => setMode('split')} className="!shadow-none !p-2" title="Split Code/View (Ctrl+D)">
            <Columns size={18}/>
          </NeuButton>
          <NeuButton active={mode === 'view'} onClick={() => setMode('view')} className="!shadow-none !p-2" title="Read Only (Ctrl+R)">
            <Eye size={18}/>
          </NeuButton>
        </div>
      </div>

      {/* RIGHT: Tools & Actions */}
      <div className="flex gap-3">
        {/* Appearance Tools */}
        <NeuButton onClick={onOpenThemePicker} title="Change Theme">
            <Palette size={20} />
        </NeuButton>
        <NeuButton onClick={onOpenHelp} title="Hotkeys & Help">
            <HelpCircle size={20} />
        </NeuButton>

        <div className="w-px h-8 bg-neu-dark/20 mx-1"></div>

        {/* Focus Mode */}
        <NeuButton onClick={onToggleFocus} title="Focus Mode (Ctrl+Shift+F)">
            <Maximize2 size={20} />
        </NeuButton>

        <div className="w-px h-8 bg-neu-dark/20 mx-1"></div>
        
        {/* File Operations */}
        <NeuButton onClick={onOpen} title="Open File (Ctrl+O)">
            <FolderOpen size={20} />
        </NeuButton>
        <NeuButton onClick={onSave} title="Save File (Ctrl+S)">
            <Save size={20} />
        </NeuButton>
        <NeuButton onClick={onExport} title="Export PDF (Ctrl+P)">
            <FileDown size={20} />
        </NeuButton>
      </div>
    </div>
  );
};