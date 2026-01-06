// @ts-nocheck
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, List, ListOrdered, 
  Quote, Undo, Redo 
} from 'lucide-react';
import { NeuButton } from './NeuButton';

const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-2 p-2 mb-4 rounded-xl bg-neu-base/90 backdrop-blur-sm border-b border-neu-dark/10 transition-all">
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} className="!p-2 w-10 h-10" title="Bold (Ctrl+B)"><Bold size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} className="!p-2 w-10 h-10" title="Italic (Ctrl+I)"><Italic size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} className="!p-2 w-10 h-10" title="Strikethrough"><Strikethrough size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} className="!p-2 w-10 h-10" title="Inline Code"><Code size={18} /></NeuButton>
      </div>
      <div className="w-px h-10 bg-neu-dark/20 mx-1"></div>
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} className="!p-2 w-10 h-10" title="Heading 1"><Heading1 size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} className="!p-2 w-10 h-10" title="Heading 2"><Heading2 size={18} /></NeuButton>
      </div>
      <div className="w-px h-10 bg-neu-dark/20 mx-1"></div>
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} className="!p-2 w-10 h-10" title="Bullet List"><List size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} className="!p-2 w-10 h-10" title="Ordered List"><ListOrdered size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} className="!p-2 w-10 h-10" title="Blockquote"><Quote size={18} /></NeuButton>
      </div>
      <div className="flex-1"></div>
      <div className="flex gap-2">
        <NeuButton onClick={() => editor.chain().focus().undo().run()} className="!p-2 w-10 h-10"><Undo size={18} /></NeuButton>
        <NeuButton onClick={() => editor.chain().focus().redo().run()} className="!p-2 w-10 h-10"><Redo size={18} /></NeuButton>
      </div>
    </div>
  );
};

// UPDATED: Added 'onScroll' to props
export const Editor = ({ content, onChange, scrollRef, onScroll }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:my-2 min-h-[50vh] px-2',
      },
    },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown();
      onChange(md);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative flex flex-col h-full">
      <MenuBar editor={editor} />
      {/* UPDATED: onScroll attached here */}
      <div 
        ref={scrollRef} 
        onScroll={onScroll} 
        className="flex-1 overflow-auto p-2 scroll-smooth"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};