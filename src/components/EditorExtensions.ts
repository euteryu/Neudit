// @ts-nocheck
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';

// Define Custom Keyboard Shortcuts
const CustomShortcuts = Extension.create({
  name: 'customShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-q': () => this.editor.commands.toggleBlockquote(),
      'Mod-h': () => this.editor.commands.toggleHeading({ level: 1 }),
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 2 }),
    }
  }
});

// Export the configured list
export const getEditorExtensions = () => [
  StarterKit,
  Image.configure({ 
    inline: true,
    allowBase64: true 
  }),
  Markdown.configure({ 
    html: false, // Output strict Markdown
    transformPastedText: true,
    transformCopiedText: true,
    linkify: true,
  }),
  CustomShortcuts,
];