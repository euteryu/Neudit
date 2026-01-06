import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export const Editor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false, // Output strict markdown
        transformPastedText: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[50vh]',
      },
    },
    onUpdate: ({ editor }) => {
      // Get markdown output
      const md = editor.storage.markdown.getMarkdown();
      onChange(md);
    },
  });

  // Update editor content if file changes externally
  useEffect(() => {
    if (editor && content !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} className="p-4" />;
};