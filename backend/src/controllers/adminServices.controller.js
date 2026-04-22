const servicesService = require("../services/services.service");

function toIntId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function getAdminServices(req, res) {
  try {
    const rows = await servicesService.listAllServices(req.app.locals.db);
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/services:", err);
    res.status(err.status || 500).json({ error: err.message || "Error interno" });
  }
}

async function createAdminService(req, res) {
  try {
    const row = await servicesService.createService(req.app.locals.db, req.body);
    res.status(201).json(row);
  } catch (err) {
    console.error("Error POST /api/admin/services:", err);
    res.status(err.status || 500).json({ error: err.message || "Error interno" });
  }
}

async function updateAdminService(req, res) {
  const id = toIntId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "id inválido" });
  }

  try {
    const row = await servicesService.updateService(req.app.locals.db, id, req.body);
    res.json(row);
  } catch (err) {
    console.error("Error PATCH /api/admin/services/:id:", err);
    res.status(err.status || 500).json({ error: err.message || "Error interno" });
  }
}


module.exports = {
  getAdminServices,
  createAdminService,
  updateAdminService,
};