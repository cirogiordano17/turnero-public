const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "from y to son requeridos" });
    }

    const result = await req.app.locals.db.query(
      `
      SELECT TO_CHAR(closed_date, 'YYYY-MM-DD') AS day
      FROM closed_days
      WHERE closed_date BETWEEN $1 AND $2
      ORDER BY day
      `,
      [from, to]
    );

    res.json(result.rows.map(r => r.day));
  } catch (err) {
    console.error("GET /api/closed-days error:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;