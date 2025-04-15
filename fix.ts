import { promises as fs } from 'fs';
import { join, extname } from 'path';

export async function fixLineEndings(directory: string): Promise<boolean> {
  let filesChanged = false;
  const files = await fs.readdir(directory, { withFileTypes: true });

  // File extensions to process (add more as needed)
  const textExtensions = [
    '.sql',
    '.js',
    '.ts',
    '.tsx',
    '.jsx',
    '.json',
    '.md',
    '.txt',
    '.yml',
    '.yaml',
    '.css',
    '.scss',
    '.html',
    '.xml',
    '.csv',
    '.sh',
  ];

  // Directories to skip
  const skipDirectories = [
    '.git-sources',
    '.git',
    'node_modules',
    'dist',
    'build',
  ];

  for (const file of files) {
    const filePath = join(directory, file.name);

    if (file.isDirectory() && !skipDirectories.includes(file.name)) {
      const changed = await fixLineEndings(filePath); // Recursively handle subdirectories
      if (changed) {
        filesChanged = true;
      }
    } else if (file.isFile()) {
      // Only process text files based on extension
      const ext = extname(file.name).toLowerCase();
      if (!textExtensions.includes(ext)) {
        continue;
      }

      try {
        // Read file as binary to properly detect all line ending types
        const buffer = await fs.readFile(filePath);

        // Check if file contains CR or CRLF
        if (buffer.includes(Buffer.from([0x0d]))) {
          // Convert file content to string
          const content = buffer.toString('utf8');

          // First normalize all line endings to LF
          // This handles CRLF (\r\n) and lone CR (\r) cases
          const fixedContent = content
            .replace(/\r\n/g, '\n') // Convert CRLF to LF
            .replace(/\r/g, '\n'); // Convert any remaining CR to LF

          if (content !== fixedContent) {
            await fs.writeFile(filePath, fixedContent, 'utf8');
            console.log(`Fixed line endings in ${filePath}`);
            filesChanged = true;
          }
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  return filesChanged;
}

// Optional: Function to run on a specific file
export async function fixLineEndingsInFile(filePath: string): Promise<boolean> {
  try {
    const buffer = await fs.readFile(filePath);

    // Check if file contains CR or CRLF
    if (buffer.includes(Buffer.from([0x0d]))) {
      const content = buffer.toString('utf8');

      // Normalize all line endings to LF
      const fixedContent = content
        .replace(/\r\n/g, '\n') // Convert CRLF to LF
        .replace(/\r/g, '\n'); // Convert any remaining CR to LF

      if (content !== fixedContent) {
        await fs.writeFile(filePath, fixedContent, 'utf8');
        console.log(`Fixed line endings in ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}
