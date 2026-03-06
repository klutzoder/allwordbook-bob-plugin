/**
 * Build script for wordbook-bob-plugin
 * Bundles TypeScript source into a single JS file compatible with Bob plugin runtime
 */

import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = './src';
const distDir = './dist/src';

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Build the main bundle
const result = await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: distDir,
  format: 'iife',
  naming: 'main.js',
  minify: false,
  target: 'browser',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Copy static files
const staticFiles = ['info.json', 'icon.png'];
for (const file of staticFiles) {
  const srcPath = join(srcDir, file);
  const destPath = join(distDir, file);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file}`);
  }
}

console.log('Build completed successfully!');
console.log(`Output: ${distDir}/main.js`);
