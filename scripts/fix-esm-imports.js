#!/usr/bin/env node

/**
 * Fix ESM imports by adding .js extensions
 * Node.js ESM requires explicit file extensions
 */

const fs = require('fs');
const path = require('path');

const ESM_DIR = path.join(__dirname, '../dist/esm');

// Recursively find all .js files
function findJsFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsFiles(fullPath, files);
    } else if (entry.name.endsWith('.js')) {
      files.push(path.relative(ESM_DIR, fullPath));
    }
  }
  
  return files;
}

const files = findJsFiles(ESM_DIR);

files.forEach(file => {
  const filePath = path.join(ESM_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix imports: from './something' -> from './something.js'
  content = content.replace(
    /from ['"](\.[^'"]+)(?<!\.js)['"];/g,
    (match, importPath) => {
      // Don't add .js if it's already there or if it's a directory with index
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }
      
      // Check if it's a directory import (need to add /index.js)
      const absolutePath = path.resolve(path.dirname(filePath), importPath);
      try {
        if (fs.statSync(absolutePath).isDirectory()) {
          return `from '${importPath}/index.js';`;
        }
      } catch (e) {
        // Not a directory, assume it's a file
      }
      
      return `from '${importPath}.js';`;
    }
  );
  
  // Fix exports: export * from './something' -> export * from './something.js'
  content = content.replace(
    /export \* from ['"](\.[^'"]+)(?<!\.js)['"];/g,
    (match, importPath) => {
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }
      
      const absolutePath = path.resolve(path.dirname(filePath), importPath);
      try {
        if (fs.statSync(absolutePath).isDirectory()) {
          return `export * from '${importPath}/index.js';`;
        }
      } catch (e) {
        // Not a directory
      }
      
      return `export * from '${importPath}.js';`;
    }
  );
  
  // Fix named exports: export { something } from './somewhere'
  content = content.replace(
    /export \{[^}]+\} from ['"](\.[^'"]+)(?<!\.js)['"];/g,
    (match, importPath) => {
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }
      
      const absolutePath = path.resolve(path.dirname(filePath), importPath);
      try {
        if (fs.statSync(absolutePath).isDirectory()) {
          return match.replace(importPath, `${importPath}/index.js`);
        }
      } catch (e) {
        // Not a directory
      }
      
      return match.replace(importPath, `${importPath}.js`);
    }
  );
  
  fs.writeFileSync(filePath, content);
});

console.log(`✅ Fixed ESM imports in ${files.length} files`); 