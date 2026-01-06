// @ts-nocheck
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

// Hooks
import { useImagePaster } from '../hooks/useImagePaster';
import { useImageInserter } from '../hooks/useImageInserter';

// Refactored Components
import { getEditorExtensions } from './EditorExtensions';
import { EditorMenuBar } from './EditorMenuBar';

export const Editor = ({ content, onChange, scrollRef, onScroll, filePath }) => {
  const { saveImage } = useImagePaster(filePath);
  const { insertImage } = useImageInserter(filePath);

  // 1. Logic: Click Button -> Select File -> Insert Image Node
  const handleImageClick = async () => {
    const result = await insertImage();
    if (result && editor) {
        editor.chain().focus().setImage({ src: result.src, alt: result.alt }).run();
    }
  };

  // 2. Logic: Paste Event -> Save File -> Insert Image Node
  const handlePasteEvents = (view, event) => {
    const items = event.clipboardData?.items;
    if (!items) return false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          saveImage(blob).then((markdownLink) => {
            if (markdownLink) {
                // Parse markdown link back to src/alt for Tiptap
                // Format: ![alt](src)
                const match = markdownLink.match(/!\[(.*?)\]\((.*?)\)/);
                if (match && match[2]) {
                     const alt = match[1] || 'image';
                     const src = match[2];
                     editor.chain().focus().setImage({ src, alt }).run();
                } else {
                     // Fallback if regex fails (rare)
                     view.dispatch(view.state.tr.insertText(markdownLink));
                }
            }
          });
        }
        return true; // We handled it
      }
    }
    return false; // Let Tiptap handle text paste
  };

  const editor = useEditor({
    extensions: getEditorExtensions(), // Imported from refactored file
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:my-2 min-h-[50vh] px-2',
      },
      handlePaste: handlePasteEvents
    },
    onUpdate: ({ editor }) => {
      // Convert Tiptap JSON -> Markdown String for parent
      const md = editor.storage.markdown.getMarkdown();
      onChange(md);
    },
  });

  // Sync: Update editor content if parent content changes (e.g. file open)
  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative flex flex-col h-full">
      <EditorMenuBar editor={editor} onInsertImage={handleImageClick} />
      
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