import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`InclusiveKids Hub API listening on port ${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
