#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { fixLineEndings } from './fix.ts'; // Import the function from the TS file
import { execSync } from 'child_process';

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

// Function to check if package.json exists and has a check script
function hasCheckScript(directory) {
  const packageJsonPath = path.join(directory, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.scripts && packageJson.scripts.check;
    } catch (error) {
      console.error('Error reading package.json:', error);
      return false;
    }
  }

  return false;
}

// Function to run the check script
function runCheckScript(directory) {
  console.log('Running check script before processing task...');

  try {
    // Determine which package manager to use (npm, yarn, bun, etc.)
    let packageManager = 'npm';

    // Check for yarn.lock, bun.lockb, etc. to determine package manager
    if (fs.existsSync(path.join(directory, 'bun.lockb'))) {
      packageManager = 'bun';
    } else if (fs.existsSync(path.join(directory, 'yarn.lock'))) {
      packageManager = 'yarn';
    } else if (fs.existsSync(path.join(directory, 'pnpm-lock.yaml'))) {
      packageManager = 'pnpm';
    }

    // Run the check script
    execSync(`${packageManager} run check`, {
      cwd: directory,
      stdio: 'inherit',
    });

    console.log('Check script completed successfully.');
    return true;
  } catch (error) {
    console.error('Check script failed:', error.message);
    return false;
  }
}

// Function to format date and time
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours);

  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${formattedHours}:${minutes}${ampm}`;
}

// Function to calculate time difference and format it
function formatTimeDifference(startDate, endDate) {
  const diffMs = endDate - startDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours} hours ${diffMinutes} minutes`;
}

// Function to copy docs
function copyDocs(rl, callback) {
  // Determine source and destination paths
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sourceDocsDir = path.join(__dirname, 'docs');
  const destinationDir = process.cwd(); // Directory where npx command is run
  const destinationDocsDir = path.join(destinationDir, 'docs');

  // Check if source docs directory exists
  if (!fs.existsSync(sourceDocsDir)) {
    console.error(`Source docs directory not found: ${sourceDocsDir}`);
    if (callback) callback();
    return;
  }

  // Get list of folders in the docs directory
  const docsFolders = fs.readdirSync(sourceDocsDir).filter((item) => {
    const itemPath = path.join(sourceDocsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  if (docsFolders.length === 0) {
    console.log('No documentation folders found.');
    if (callback) callback();
    return;
  }

  // Create readline interface if not provided
  let shouldCloseRl = false;
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    shouldCloseRl = true;
  }

  // Display options
  console.log('Select which documentation to copy:');
  console.log('0: All documentation');
  docsFolders.forEach((folder, index) => {
    console.log(`${index + 1}: ${folder}`);
  });

  rl.question(`Enter your choice (0-${docsFolders.length}): `, (answer) => {
    const choice = parseInt(answer.trim());

    if (isNaN(choice) || choice < 0 || choice > docsFolders.length) {
      console.log(
        `Invalid choice. Please enter a number between 0 and ${docsFolders.length}.`,
      );
      if (shouldCloseRl) rl.close();
      if (callback) callback();
      return;
    }

    try {
      if (choice === 0) {
        // Copy all folders
        console.log(
          `Copying all documentation from ${sourceDocsDir} to ${destinationDocsDir}...`,
        );

        if (!fs.existsSync(destinationDocsDir)) {
          fs.mkdirSync(destinationDocsDir, { recursive: true });
        }

        docsFolders.forEach((folder) => {
          const sourceFolderPath = path.join(sourceDocsDir, folder);
          const destFolderPath = path.join(destinationDocsDir, folder);
          copyDirRecursive(sourceFolderPath, destFolderPath);
          console.log(`Copied ${folder} documentation.`);
        });
      } else {
        // Copy specific folder
        const selectedFolder = docsFolders[choice - 1];
        console.log(`Copying ${selectedFolder} documentation...`);

        const sourceFolderPath = path.join(sourceDocsDir, selectedFolder);
        const destFolderPath = path.join(destinationDocsDir, selectedFolder);

        if (!fs.existsSync(destinationDocsDir)) {
          fs.mkdirSync(destinationDocsDir, { recursive: true });
        }

        copyDirRecursive(sourceFolderPath, destFolderPath);
        console.log(`Copied ${selectedFolder} documentation.`);
      }

      console.log('Documentation copied successfully!');
    } catch (error) {
      console.error('Error copying documentation:', error);
    }

    if (shouldCloseRl) rl.close();
    if (callback) callback();
  });
}

// Function to process time tracking
function processTime() {
  const destinationDir = process.cwd(); // Directory where command is run
  const taskDir = path.join(destinationDir, 'task');

  // Check if task folder exists
  if (!fs.existsSync(taskDir)) {
    console.log('Task folder does not exist. Creating it...');
    fs.mkdirSync(taskDir, { recursive: true });
    console.log('Task folder created successfully!');
    console.log('No files in task folder to calculate time from.');
    return;
  }

  // Get all files in the task folder
  const files = fs
    .readdirSync(taskDir)
    .filter((file) => {
      const filePath = path.join(taskDir, file);
      return fs.statSync(filePath).isFile();
    })
    .map((file) => {
      const filePath = path.join(taskDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        birthtime: stats.birthtime,
      };
    });

  if (files.length === 0) {
    console.log('No files in task folder to calculate time from.');
    return;
  }

  // Sort files by creation time (oldest first)
  files.sort((a, b) => a.birthtime - b.birthtime);

  // Get the earliest file creation time
  const earliestFile = files[0];
  const startTime = earliestFile.birthtime;
  const endTime = new Date();

  // Calculate time difference
  const totalTime = formatTimeDifference(startTime, endTime);
  const formattedStartTime = formatDateTime(startTime);
  const formattedEndTime = formatDateTime(endTime);

  // Create the time file
  const fileNumber = files.length + 1;
  const paddedNumber = String(fileNumber).padStart(2, '0');
  const timeFileName = `${paddedNumber}_time`;
  const timeFilePath = path.join(taskDir, timeFileName);

  // Create the content for the time file
  const timeFileContent = `total: ${totalTime}
start-time: ${formattedStartTime}
end-time: ${formattedEndTime}`;

  // Write the time file
  fs.writeFileSync(timeFilePath, timeFileContent);

  console.log(`Time tracking information saved to ${timeFilePath}`);
  console.log(`Total time: ${totalTime}`);
}

// Function to fix line endings
async function processFix() {
  const targetDirectory = process.cwd(); // Use current working directory
  console.log(`Fixing line endings in ${targetDirectory}...`);
  try {
    const changed = await fixLineEndings(targetDirectory);
    if (changed) {
      console.log(
        'Line endings fixed for all files, excluding specified directories.',
      );
    } else {
      console.log('All files already have correct line endings.');
    }
  } catch (err) {
    console.error('Error fixing line endings:', err);
  }
}

// Function to process task folder
function processTask(rl, callback) {
  const destinationDir = process.cwd(); // Directory where command is run
  const taskDir = path.join(destinationDir, 'task');
  const taskHistoryDir = path.join(destinationDir, 'task-history');

  // Check if task folder exists
  if (!fs.existsSync(taskDir)) {
    // Create task folder if it doesn't exist
    console.log('Task folder does not exist. Creating it...');
    fs.mkdirSync(taskDir, { recursive: true });
    console.log('Task folder created successfully!');

    // No need to run time tracking on a newly created task folder
    console.log('Skipping time tracking for new task folder.');

    if (callback) callback();
  } else {
    // Task folder exists, prompt for task name and move it
    if (!rl) {
      // Create a readline interface if one wasn't provided
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
      });
      const originalCallback = callback;
      callback = () => {
        rl.close();
        if (originalCallback) originalCallback();
      };
    }

    // Run time tracking before processing the task
    console.log('Running time tracking before processing task...');
    processTime();

    rl.question('Enter a name for the current task: ', (taskName) => {
      // Format the task name (lowercase, replace spaces with hyphens)
      const formattedTaskName = taskName.toLowerCase().replace(/\s+/g, '-');

      // Check if there's a check script and run it before proceeding
      if (hasCheckScript(destinationDir)) {
        console.log('Found check script in package.json');
        const checkPassed = runCheckScript(destinationDir);

        if (!checkPassed) {
          console.error(
            'Check script failed. Task folder will not be renamed.',
          );
          console.log('Please fix the issues and try again.');
          if (callback) callback();
          return;
        }
      }

      // Create task-history folder if it doesn't exist
      if (!fs.existsSync(taskHistoryDir)) {
        fs.mkdirSync(taskHistoryDir, { recursive: true });
        console.log('Task history folder created.');
      }

      // Count existing folders in task-history to determine the next number
      let folderCount = 0;
      if (fs.existsSync(taskHistoryDir)) {
        const items = fs.readdirSync(taskHistoryDir);
        folderCount = items.filter((item) => {
          const itemPath = path.join(taskHistoryDir, item);
          return fs.statSync(itemPath).isDirectory();
        }).length;
      }

      // Create new folder name with padded number
      const newFolderNumber = folderCount + 1;
      const paddedNumber = String(newFolderNumber).padStart(2, '0');
      const newFolderName = `${paddedNumber}-${formattedTaskName}`;
      const newFolderPath = path.join(taskHistoryDir, newFolderName);

      // Move task folder to task-history with new name
      fs.renameSync(taskDir, newFolderPath);
      console.log(`Moved current task to ${newFolderPath}`);

      // Create a new task folder
      fs.mkdirSync(taskDir, { recursive: true });
      console.log('Created a new task folder');

      if (callback) callback();
    });
  }
}

// Main function to handle the flow
async function main() {
  // Make main async
  // Check for command line arguments
  const arg = process.argv[2];

  // If command line argument is provided, execute the corresponding function
  if (arg === '1' || arg === 'docs') {
    copyDocs(null, null);
    return;
  } else if (arg === '2' || arg === 'task') {
    processTask(null, null);
    return;
  } else if (arg === '3' || arg === 'time') {
    processTime();
    return;
  } else if (arg === '4' || arg === 'fix') {
    await processFix(); // Use await since fixLineEndings is async
    return;
  }

  // If no valid argument is provided, use interactive prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // Prompt user for choice
  console.log('Please select an option:');
  console.log('1. Copy docs');
  console.log('2. Process task folder');
  console.log('3. Track time');
  console.log('4. Fix line endings');

  rl.question('Enter your choice (1, 2, 3, or 4): ', async (answer) => {
    // Make async
    if (answer === '1') {
      copyDocs(rl, () => rl.close());
    } else if (answer === '2') {
      processTask(rl, () => rl.close());
    } else if (answer === '3') {
      processTime();
      rl.close();
    } else if (answer === '4') {
      await processFix(); // Use await
      rl.close();
    } else {
      console.log('Invalid choice. Please run again and select 1, 2, 3, or 4.');
      rl.close();
    }
  });
}

// Display help message if --help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage:');
  console.log('  npx cli [option]');
  console.log('');
  console.log('Options:');
  console.log('  1, docs    Copy documentation files');
  console.log('  2, task    Process task folder');
  console.log('  3, time    Track time based on file creation dates');
  console.log('  4, fix     Fix line endings in the current directory');
  console.log('  --help, -h Show this help message');
  console.log('');
  console.log('If no option is provided, an interactive prompt will be shown.');
  process.exit(0);
}

// Start the program
main();
