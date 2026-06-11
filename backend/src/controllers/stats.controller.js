const statsService = require("../services/stats.service");

async function getMonthlyStats(req, res) {
  const { month } = req.query;

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "month inválido. Formato: YYYY-MM" });
  }

  try {
    const data = await statsService.getMonthlyStats(req.app.locals.db, month);
    res.json(data);
  } catch (err) {
    console.error("Error GET /api/admin/stats/monthly:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getMonthlyStats };
