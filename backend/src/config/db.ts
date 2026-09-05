import { Pool, type QueryResultRow } from 'pg';
import { env } from './env.js';

export const pool = new Pool(
  env.database.connectionString
    ? { connectionString: env.database.connectionString }
    : {
        host: env.database.host,
        port: env.database.port,
        database: env.database.database,
        user: env.database.user,
        password: env.database.password,
      }
);

pool.on('error', (err) => {
  // Unexpected errors on idle clients should not crash the process silently.
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL error on idle client', err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}
