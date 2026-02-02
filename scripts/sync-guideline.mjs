import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const GUIDELINE_PATH = 'guideline.md';
const PACKAGE_JSON_PATH = 'package.json';

function getFolderStructure(dir, prefix = '', ignore = ['node_modules', '.git', '.next']) {
  let structure = '';
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (ignore.includes(file)) continue;

    const fullPath = path.join(dir, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    structure += `${prefix}├── ${file}${isDirectory ? '/' : ''}\n`;

    // We only go 1 level deep for the guideline to keep it readable, 
    // but we can customize this.
    if (isDirectory && prefix === '') {
       // structure += getFolderStructure(fullPath, prefix + '│   ', ignore);
    }
  }
  return structure;
}

function generateFolderSection() {
    const rootFiles = fs.readdirSync('.').filter(f => !['node_modules', '.git', '.next', 'package-lock.json', '.claude', '.ai', '.idea', '.gitignore'].includes(f));
    let section = '```text\npractice-ai/\n';
    
    // Sort files to have a consistent order: directories first, then files
    const sortedFiles = [...rootFiles].sort((a, b) => {
        const aIsDir = fs.statSync(a).isDirectory();
        const bIsDir = fs.statSync(b).isDirectory();
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
    });

    for (const file of sortedFiles) {
        const isDir = fs.statSync(file).isDirectory();
        let description = '';
        
        // Simple mapping for descriptions
        if (file === 'app') description = ' # Main application logic (App Router)';
        else if (file === 'public') description = ' # Static assets (images, robots.txt, etc.)';
        else if (file === 'components') description = ' # Reusable UI components';
        else if (file === 'lib') description = ' # Utility functions and shared logic';
        else if (file === 'hooks') description = ' # Custom React hooks';
        else if (file === 'features') description = ' # Feature-based modules';
        else if (file === 'scripts') description = ' # Automation and build scripts';
        else if (file === 'guideline.md') description = ' # This documentation';
        else if (file === 'package.json') description = ' # Project dependencies and scripts';
        else if (file === 'README.md') description = ' # Project overview and quick start';
        
        section += `├── ${file}${isDir ? '/' : ''}${description}\n`;
        
        // Include some sub-structure for main folders
        if (isDir && ['app', 'components', 'lib', 'features', 'scripts'].includes(file)) {
             const subFiles = fs.readdirSync(file).filter(f => !f.startsWith('.')).slice(0, 5);
             for (const sub of subFiles) {
                 const subIsDir = fs.statSync(path.join(file, sub)).isDirectory();
                 section += `│   ├── ${sub}${subIsDir ? '/' : ''}\n`;
             }
             if (fs.readdirSync(file).length > 5) {
                 section += `│   └── ...\n`;
             }
        }
    }
    section += '```';
    return section;
}

function updateGuideline(dryRun = false) {
  let content = fs.readFileSync(GUIDELINE_PATH, 'utf8');
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

  // Update Versions
  const nextVersion = pkg.dependencies.next;
  const tailwindVersion = pkg.devDependencies.tailwindcss || pkg.dependencies.tailwindcss;
  
  const frameworkRegex = /-   \*\*Framework\*\*: .*/;
  if (frameworkRegex.test(content)) {
    content = content.replace(frameworkRegex, `-   **Framework**: [Next.js ${nextVersion}](https://nextjs.org/)`);
  }
  
  const stylingRegex = /-   \*\*Styling\*\*: .*/;
  if (stylingRegex.test(content)) {
    content = content.replace(stylingRegex, `-   **Styling**: [Tailwind CSS ${tailwindVersion}](https://tailwindcss.com/)`);
  }

  // Update Folder Structure
  const folderRegex = /## 3\. Folder and File Structure\n\n```text[\s\S]*?```/;
  const newFolderSection = `## 3. Folder and File Structure\n\n${generateFolderSection()}`;
  content = content.replace(folderRegex, newFolderSection);

  // Update Timestamp (only if not a check)
  if (!dryRun) {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const timestampRegex = /\*Last Updated:.*\*/;
      if (timestampRegex.test(content)) {
        content = content.replace(timestampRegex, `*Last Updated: ${timestamp} (Auto-synced)*`);
      } else {
        content += `\n\n*Last Updated: ${timestamp} (Auto-synced)*\n`;
      }
      fs.writeFileSync(GUIDELINE_PATH, content);
      console.log('guideline.md updated successfully.');
  }
  
  return content;
}

const mode = process.argv[2];

if (mode === '--check') {
    const originalContent = fs.readFileSync(GUIDELINE_PATH, 'utf8');
    const expectedContent = updateGuideline(true);
    
    // Normalize content for comparison if needed (e.g., line endings)
    if (originalContent.replace(/\r\n/g, '\n') !== expectedContent.replace(/\r\n/g, '\n')) {
        console.error('Error: guideline.md is out of sync with the codebase.');
        console.error('Please run "npm run sync-guideline" and commit the changes.');
        process.exit(1);
    } else {
        console.log('guideline.md is up to date.');
    }
} else {
    updateGuideline();
}
