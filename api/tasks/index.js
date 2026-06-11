import pool from "../_db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { rows } = await pool.query(
        `SELECT id, title, description, column_name, position, priority, labels, created_date, updated_date
         FROM tasks ORDER BY position ASC`,
      );
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const {
        title,
        description = null,
        position = 0,
        priority = null,
        labels = [],
      } = req.body || {};
      const column_name =
        req.body?.column_name ?? req.body?.column ?? "segunda";
      const now = new Date().toISOString();
      const { rows } = await pool.query(
        `INSERT INTO tasks (title, description, column_name, position, priority, labels, created_date, updated_date)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          title,
          description,
          column_name,
          position,
          priority,
          JSON.stringify(labels),
          now,
          now,
        ],
      );
      return res.status(201).json(rows[0]);
    }

    res.setHeader("Allow", "GET,POST");
    res.status(405).end("Method Not Allowed");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
