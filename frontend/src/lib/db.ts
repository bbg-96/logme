import { Pool, PoolClient, QueryResult } from "pg";

// Cache the pool in the global scope to avoid creating a new connection
// on every hot-reload in development or every server invocation.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const createPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Please add it to .env.local");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });
};

export const getPool = () => {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }

  return global.__pgPool;
};

export async function query<T = unknown>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
  const pool = getPool();
  return pool.query<T>(text, params);
}

export async function withClient<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (global.__pgPool) {
    await global.__pgPool.end();
    global.__pgPool = undefined;
  }
}
