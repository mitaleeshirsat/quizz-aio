import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env');

console.log('=== ENV FILE TEST ===');
console.log('Looking for .env at:', envPath);
console.log('File exists:', existsSync(envPath));

if (existsSync(envPath)) {
  console.log('\n.env file contents:');
  console.log(readFileSync(envPath, 'utf8'));
}

dotenv.config({ path: envPath });

console.log('\nLoaded environment variables:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'FOUND ✓' : 'NOT FOUND ✗');