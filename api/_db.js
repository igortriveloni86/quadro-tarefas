import pg from "pg";

const { Pool } = pg;
const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.DATABASE_URL_PUBLIC ||
  null;

const poolConfig = {
  max: 10,
  idleTimeoutMillis: 30000,
};

if (connectionString) {
  poolConfig.connectionString = connectionString;
} else if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
  poolConfig.host = process.env.PGHOST;
  poolConfig.user = process.env.PGUSER;
  poolConfig.password = process.env.PGPASSWORD;
  poolConfig.database = process.env.PGDATABASE;
  if (process.env.PGPORT) poolConfig.port = Number(process.env.PGPORT);
} else if (
  process.env.POSTGRES_USER &&
  process.env.POSTGRES_DB &&
  process.env.POSTGRES_PASSWORD
) {
  poolConfig.host =
    process.env.PGHOST || process.env.POSTGRES_HOST || "localhost";
  poolConfig.user = process.env.POSTGRES_USER;
  poolConfig.password = process.env.POSTGRES_PASSWORD;
  poolConfig.database = process.env.POSTGRES_DB;
  if (process.env.PGPORT) poolConfig.port = Number(process.env.PGPORT);
}

if (!poolConfig.connectionString && !poolConfig.host) {
  throw new Error(
    "Missing DATABASE_URL environment variable or PostgreSQL connection settings",
  );
}

const usesSsl = /sslmode=(require|verify-ca|verify-full)/i.test(
  connectionString || "",
);
if (usesSsl || process.env.NODE_ENV === "production") {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

let pool = global.__pgPool;
if (!pool) {
  pool = new Pool(poolConfig);
  global.__pgPool = pool;
}

export async function ensureTasksDueDateColumn() {
  try {
    // Check if column exists
    const result = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'due_date'",
    );

    if (result.rows.length === 0) {
      // Column doesn't exist, create it as DATE
      await pool.query("ALTER TABLE tasks ADD COLUMN due_date DATE");
    } else {
      // Column exists, convert it to DATE if needed
      await pool.query(
        "ALTER TABLE tasks ALTER COLUMN due_date TYPE DATE USING DATE(due_date)",
      );
    }
  } catch (error) {
    // Ignore errors (column already exists in correct format, etc.)
    console.error("ensureTasksDueDateColumn error:", error.message);
  }
}

export default pool;
