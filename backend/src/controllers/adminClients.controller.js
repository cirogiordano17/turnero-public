const clientsRepo = require("../repositories/clients.repo");
const { toIntId } = require("../utils/validate");

async function getClients(req, res) {
  try {
    const result = await clientsRepo.getAllClients(req.app.locals.db);
    res.json(result.rows);
  } catch (err) {
    console.error("Error GET /api/admin/clients:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getClientAppointments(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  try {
    const result = await clientsRepo.getAppointmentsByClientId(req.app.locals.db, id);
    res.json(result.rows);
  } catch (err) {
    console.error("Error GET /api/admin/clients/:id/appointments:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getClients, getClientAppointments };
