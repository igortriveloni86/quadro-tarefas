const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

let pool = global.__pgPool;
if (!pool) {
  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  });
  global.__pgPool = pool;
}

module.exports = pool;
