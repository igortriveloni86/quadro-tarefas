const pool = require("../_db");

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { rows } = await pool.query(
        "SELECT id, name, color FROM labels ORDER BY name ASC",
      );
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { name, color } = req.body || {};
      if (!name || !color)
        return res.status(400).json({ error: "name and color required" });
      const { rows } = await pool.query(
        "INSERT INTO labels (name, color, created_date, updated_date) VALUES ($1,$2,now(),now()) RETURNING *",
        [name, color],
      );
      return res.status(201).json(rows[0]);
    }

    if (req.method === "DELETE") {
      const url = req.url || "";
      const idMatch = (url.match(/id=([^&]+)/) || [])[1];
      const id = idMatch || (req.body && req.body.id);
      if (!id) return res.status(400).json({ error: "id required" });
      const { rows } = await pool.query(
        "DELETE FROM labels WHERE id = $1 RETURNING id",
        [id],
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,POST,DELETE");
    res.status(405).end("Method Not Allowed");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
