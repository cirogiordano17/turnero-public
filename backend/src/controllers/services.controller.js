const servicesService = require("../services/services.service");

async function getServices(req, res) {
  try {
    const category = req.query.category || null;
    const rows = await servicesService.listServices(req.app.locals.db, category);
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/services:", err);
    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { getServices };