// @ts-nocheck
import { open } from '@tauri-apps/plugin-dialog';
import { mkdir, copyFile } from '@tauri-apps/plugin-fs';

export const useImageInserter = (filePath: string | null) => {

  // Returns object { markdown: string, src: string, alt: string } or null
  const insertImage = async () => {
    if (!filePath) {
      alert("Please save your Markdown file first.");
      return null;
    }

    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }]
      });

      if (!selected) return null;
      const sourcePath = selected as string;

      const isWindows = filePath.includes('\\');
      const sep = isWindows ? '\\' : '/';
      const lastSlash = filePath.lastIndexOf(sep);
      const parentDir = filePath.substring(0, lastSlash);
      const assetsDir = `${parentDir}${sep}assets`;

      try {
        await mkdir(assetsDir, { recursive: true });
      } catch (e) { /* folder exists */ }

      const originalName = sourcePath.split(/[\\/]/).pop() || 'image';
      const newName = `${Date.now()}-${originalName}`;
      const destPath = `${assetsDir}${sep}${newName}`;

      await copyFile(sourcePath, destPath);

      // Return structured data
      return {
        markdown: `![${originalName}](./assets/${newName})`,
        src: `./assets/${newName}`,
        alt: originalName
      };

    } catch (err: any) {
      console.error("Image insert failed:", err);
      alert(`Error: ${err.message || JSON.stringify(err)}`);
      return null;
    }
  };

  return { insertImage };
};