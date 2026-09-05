import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEEDS_DIR = path.join(__dirname, 'seeds');

async function runSeeds() {
  console.log('Seeding database...');
  const files = (await readdir(SEEDS_DIR)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = await readFile(path.join(SEEDS_DIR, file), 'utf-8');
    console.log(`  - running ${file}`);
    await pool.query(sql);
  }

  console.log('Seeding complete.');
}

runSeeds()
  .then(() => pool.end())
  .catch((error) => {
    console.error('Seeding failed:', error);
    return pool.end().finally(() => process.exit(1));
  });
