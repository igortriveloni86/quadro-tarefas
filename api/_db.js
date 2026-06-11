import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

let pool = global.__pgPool;
if (!pool) {
  const poolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  };

  const usesSsl = /sslmode=(require|verify-ca|verify-full)/i.test(
    connectionString,
  );
  if (usesSsl || process.env.NODE_ENV === "production") {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }

  pool = new Pool(poolConfig);
  global.__pgPool = pool;
}

export default pool;
