const apptService = require("../services/appointments.service");
const { emitAdminEvent } = require("./adminEvents.controller");

async function listAppointments(req, res) {
  try {
    const rows = await apptService.listAppointments(req.app.locals.db);
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/appointments:", err);
    res.status(500).json({ error: err.message });
  }
}

async function createAppointment(req, res) {
  const { first_name, last_name, whatsapp, start_at, service_ids, category } = req.body;

  if (!first_name || !last_name || !whatsapp || !start_at) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  if (!Array.isArray(service_ids) || service_ids.length === 0) {
    return res.status(400).json({ error: "service_ids debe tener al menos 1 servicio" });
  }

  try {
    const data = await apptService.createAppointment(req.app.locals.pool, req.body);

    emitAdminEvent(req.app, "appointment_created", {
      id: data.appointment.id,
      category: data.appointment.category,
      status: data.appointment.status,
      start_at: data.appointment.start_at,
      end_at: data.appointment.end_at,
      first_name,
      last_name,
      whatsapp,
      ts: Date.now(),
    });

    res.status(201).json(data);
  } catch (err) {
    console.error("Error POST /api/appointments:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { listAppointments, createAppointment };