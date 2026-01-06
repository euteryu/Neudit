// @ts-nocheck
import { open } from '@tauri-apps/plugin-dialog';
import { mkdir, copyFile } from '@tauri-apps/plugin-fs';

export const useImageInserter = (filePath: string | null) => {

  const insertImage = async (): Promise<string | null> => {
    if (!filePath) {
      alert("Please save your Markdown file first.");
      return null;
    }

    try {
      // 1. Open File Dialog
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }]
      });

      if (!selected) return null; // User cancelled
      const sourcePath = selected as string;

      // 2. Prepare Destination
      // We manually detect the separator to stay safe on Windows vs Mac
      const isWindows = filePath.includes('\\');
      const sep = isWindows ? '\\' : '/';

      const lastSlash = filePath.lastIndexOf(sep);
      const parentDir = filePath.substring(0, lastSlash);
      const assetsDir = `${parentDir}${sep}assets`;

      // 3. Create folder
      try {
        await mkdir(assetsDir, { recursive: true });
      } catch (e) {
        // Ignore if exists, but log if permission error
        console.log("Dir creation note:", e);
      }

      // 4. Copy File
      const originalName = sourcePath.split(/[\\/]/).pop();
      const newName = `${Date.now()}-${originalName}`;
      const destPath = `${assetsDir}${sep}${newName}`;

      console.log(`Copying from: ${sourcePath} to ${destPath}`); // check console F12 if needed

      await copyFile(sourcePath, destPath);

      // 5. Return Markdown Link
      // Markdown standard ALWAYS uses forward slash /, even on Windows
      return `![${originalName}](./assets/${newName})`;

    } catch (err: any) {
      console.error("Image insert failed:", err);
      // SHOW THE REAL ERROR TO USER
      alert(`Error: ${err.message || JSON.stringify(err)}`); 
      return null;
    }
  };

  return { insertImage };
};