const availabilityService = require("../services/availability.service");
const { isYmd, parseServiceIds } = require("../utils/validate");

async function getAvailability(req, res) {
  const date = req.query.date;
  const serviceIds = parseServiceIds(req.query.service_ids);

  if (!date || !isYmd(date)) {
    return res.status(400).json({ error: "date inválida. Formato: YYYY-MM-DD" });
  }
  if (serviceIds.length === 0) {
    return res.status(400).json({ error: "service_ids requerido. Ej: 1,2" });
  }

  try {
    const slots = await availabilityService.getAvailability(req.app.locals.db, date, serviceIds);
    res.json(slots);
  } catch (err) {
    console.error("Error GET /api/availability:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getAvailability };