#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to copy directories recursively
function copyDirRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyDirRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName),
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Determine source and destination paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDocsDir = path.join(__dirname, 'docs');
const destinationDir = process.cwd(); // Directory where npx command is run
const destinationDocsDir = path.join(destinationDir, 'docs');

console.log(`Copying docs from ${sourceDocsDir} to ${destinationDocsDir}...`);

try {
  copyDirRecursive(sourceDocsDir, destinationDocsDir);
  console.log('Docs copied successfully!');
} catch (error) {
  console.error('Error copying docs:', error);
  process.exit(1);
}
