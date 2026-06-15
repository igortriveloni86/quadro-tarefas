import pool from "../_db.js";

export default async function handler(req, res) {
  try {
    // extract id from url path
    const rawUrl = req.url || "";
    const id = rawUrl.split("/").filter(Boolean).pop().split("?")[0];

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    if (req.method === "GET") {
      const { rows } = await pool.query(
        `SELECT id, title, description, column_name, position, priority, labels, created_date, updated_date
         FROM tasks WHERE id = $1`,
        [id],
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(rows[0]);
    }

    if (req.method === "PUT") {
      const { rows: existingRows } = await pool.query(
        `SELECT title, description, column_name, position, priority, labels
         FROM tasks WHERE id = $1`,
        [id],
      );
      if (!existingRows[0]) return res.status(404).json({ error: "Not found" });

      const existingTask = existingRows[0];
      const title = req.body?.title ?? existingTask.title;
      const description = req.body?.description ?? existingTask.description;
      const column_name =
        req.body?.column_name ?? req.body?.column ?? existingTask.column_name;
      const position = req.body?.position ?? existingTask.position;
      const priority = req.body?.priority ?? existingTask.priority;
      const labels = req.body?.labels ?? existingTask.labels;
      const now = new Date().toISOString();

      const { rows } = await pool.query(
        `UPDATE tasks SET title=$1, description=$2, column_name=$3, position=$4, priority=$5, labels=$6, updated_date=$7
         WHERE id=$8 RETURNING *`,
        [
          title,
          description,
          column_name,
          position,
          priority,
          JSON.stringify(labels),
          now,
          id,
        ],
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(rows[0]);
    }

    if (req.method === "DELETE") {
      const { rows } = await pool.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id],
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,PUT,DELETE");
    res.status(405).end("Method Not Allowed");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
