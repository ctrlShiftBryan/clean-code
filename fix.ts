import { promises as fs } from 'fs';
import { join } from 'path';

export async function fixLineEndings(directory: string): Promise<boolean> {
  let filesChanged = false;
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = join(directory, file.name);

    // Skip specific directories
    if (
      file.isDirectory() &&
      ['.git-sources', '.git', 'node_modules'].includes(file.name)
    ) {
      continue;
    }

    if (file.isDirectory()) {
      const changed = await fixLineEndings(filePath); // Recursively handle subdirectories
      if (changed) {
        filesChanged = true;
      }
    } else if (file.isFile()) {
      const content = await fs.readFile(filePath, 'utf-8');
      const fixedContent = content.replace(/\r\n/g, '\n'); // Replace Windows line endings with Unix
      if (content !== fixedContent) {
        await fs.writeFile(filePath, fixedContent, 'utf-8');
        console.log(`Fixed line endings in ${filePath}`); // Log only when changed
        filesChanged = true;
      }
    }
  }
  return filesChanged;
}
