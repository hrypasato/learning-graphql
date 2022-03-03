import pg from 'pg';

import { pgConnectionString } from '../config';

export default async function pgClient() {
  const pgPool = new pg.Pool({
    connectionString: pgConnectionString,
  });

  // Test the connection
  const client = await pgPool.connect();
  const tableCountResp = await client.query(
    'select now();'
  );
  client.release();

  console.log(
    'Connected to PostgreSQL | Now:',
    tableCountResp.rows[0].now
  );

  pgPool.on('error', (err) => {
    console.error('Unexpected PG client error', err);
    process.exit(-1);
  });

  return {
    pgPool,
    pgClose: async () => await pgPool.end(),
  };
}
