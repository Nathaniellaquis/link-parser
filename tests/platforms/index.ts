import fs from 'fs';
import path from 'path';

// Load every *.test.ts in this directory (excluding this file).
const dir = __dirname;
fs.readdirSync(dir)
  .filter((f) => f.endsWith('.test.ts') && f !== 'index.ts')
  .forEach((f) => {
    require(path.join(dir, f));
  });
