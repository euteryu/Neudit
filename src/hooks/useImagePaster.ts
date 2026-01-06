// @ts-nocheck
import { mkdir, writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// Note: We need the 'join' function from path api, but in v2 it's often easiest to string manipulate for relative paths
// or use the path plugin if installed. For simplicity, we'll do string manipulation safe for Windows.

export const useImagePaster = (filePath: string | null) => {

  const saveImage = async (blob: Blob): Promise<string | null> => {
    if (!filePath) {
      alert("Please save the Markdown file first before pasting images.");
      return null;
    }

    try {
      // 1. Determine paths
      // filePath is like "C:\Users\Name\Docs\Note.md"
      const lastSlash = Math.max(filePath.lastIndexOf('\\'), filePath.lastIndexOf('/'));
      const dirPath = filePath.substring(0, lastSlash);
      const assetsDir = `${dirPath}/assets`;

      // 2. Create assets directory (if not exists)
      // We assume absolute path usage (Tauri capabilities must allow this)
      try {
        await mkdir(assetsDir, { recursive: true });
      } catch (e) {
        // Ignore error if dir exists, or handle specific error
        // console.log("Dir creation check:", e);
      }

      // 3. Prepare Filename
      const timestamp = new Date().getTime();
      const filename = `image-${timestamp}.png`;
      const fullPath = `${assetsDir}/${filename}`;

      // 4. Convert Blob to Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 5. Write File
      await writeFile(fullPath, uint8Array);

      // 6. Return the Relative Markdown Link
      return `![Image](./assets/${filename})`;

    } catch (err) {
      console.error("Failed to save image:", err);
      alert("Failed to save image. Check permissions.");
      return null;
    }
  };

  return { saveImage };
};