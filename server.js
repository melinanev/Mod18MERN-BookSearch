// This redirects to the actual compiled server file
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the current directory and file structure for debugging
console.log('Current directory:', __dirname);
console.log('Looking for server at:', path.join(__dirname, 'server/dist/server.js'));

// Import the actual server file
import('./server/dist/server.js').catch(err => {
  console.error('Failed to load server file:', err);
  process.exit(1);
});
