import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ...existing code...

const __filename = fileURLToPath(import.meta.url); // Converts import.meta.url to a file path
const __dirname = dirname(__filename); // Gets the directory name of the current file

// ...existing code...