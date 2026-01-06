// @ts-nocheck
import React from 'react';
import { Save, FolderOpen, Columns, Eye, Edit3, FileDown } from 'lucide-react';
import { NeuButton } from './NeuButton';

export const Toolbar = ({ mode, setMode, onOpen, onSave, onExport }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-2xl shadow-neu-flat shrink-0">
      <div className="flex gap-3">
        <div className="flex gap-2 bg-neu-base rounded-xl p-1 shadow-neu-pressed">
          <NeuButton active={mode === 'edit'} onClick={() => setMode('edit')} className="!shadow-none !p-2" title="Rich Editor">
            <Edit3 size={18}/>
          </NeuButton>
          <NeuButton active={mode === 'split'} onClick={() => setMode('split')} className="!shadow-none !p-2" title="Split Code/View">
            <Columns size={18}/>
          </NeuButton>
          <NeuButton active={mode === 'view'} onClick={() => setMode('view')} className="!shadow-none !p-2" title="Read Only">
            <Eye size={18}/>
          </NeuButton>
        </div>
      </div>

      <div className="flex gap-3">
        <NeuButton onClick={onOpen} title="Open"><FolderOpen size={20} /></NeuButton>
        <NeuButton onClick={onSave} title="Save (Ctrl+S)"><Save size={20} /></NeuButton>
        <NeuButton onClick={onExport} title="Export PDF"><FileDown size={20} /></NeuButton>
      </div>
    </div>
  );
};