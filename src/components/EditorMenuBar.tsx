// @ts-nocheck
import React from 'react';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, List, ListOrdered, 
  Quote, Undo, Redo, Image as ImageIcon 
} from 'lucide-react';
import { NeuButton } from './NeuButton';

export const EditorMenuBar = ({ editor, onInsertImage }) => {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-2 p-2 mb-4 rounded-xl bg-neu-base/90 backdrop-blur-sm border-b border-neu-dark/10 transition-all">
      {/* Text Formatting */}
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} className="!p-2 w-10 h-10" title="Bold (Ctrl+B)"><Bold size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} className="!p-2 w-10 h-10" title="Italic (Ctrl+I)"><Italic size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} className="!p-2 w-10 h-10" title="Strikethrough"><Strikethrough size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} className="!p-2 w-10 h-10" title="Inline Code"><Code size={18} /></NeuButton>
      </div>

      <div className="w-px h-10 bg-neu-dark/20 mx-1"></div>

      {/* Media */}
      <div className="flex gap-2">
         <NeuButton onClick={onInsertImage} className="!p-2 w-10 h-10" title="Insert Image from File">
            <ImageIcon size={18} />
         </NeuButton>
      </div>

      <div className="w-px h-10 bg-neu-dark/20 mx-1"></div>

      {/* Headings */}
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} className="!p-2 w-10 h-10" title="Heading 1 (Ctrl+H)"><Heading1 size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} className="!p-2 w-10 h-10" title="Heading 2"><Heading2 size={18} /></NeuButton>
      </div>
      
      {/* Lists & Quotes */}
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} className="!p-2 w-10 h-10" title="Bullet List"><List size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} className="!p-2 w-10 h-10" title="Ordered List"><ListOrdered size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} className="!p-2 w-10 h-10" title="Blockquote (Ctrl+Q)"><Quote size={18} /></NeuButton>
      </div>

      <div className="flex-1"></div>
      
      {/* History */}
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().undo().run()} className="!p-2 w-10 h-10" title="Undo (Ctrl+Z)"><Undo size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().redo().run()} className="!p-2 w-10 h-10" title="Redo (Ctrl+Y)"><Redo size={18} /></NeuButton>
      </div>
    </div>
  );
};