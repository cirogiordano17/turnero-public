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

async function createClient(req, res) {
  const { first_name, last_name, whatsapp, email, notes } = req.body;
  if (!first_name?.trim() || !last_name?.trim() || !whatsapp?.trim()) {
    return res.status(400).json({ error: "Nombre, apellido y WhatsApp son obligatorios" });
  }

  try {
    const result = await clientsRepo.createClient(req.app.locals.db, {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      whatsapp: whatsapp.trim(),
      email: email?.trim() || null,
      notes: notes?.trim() || null,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Ya existe un cliente con ese WhatsApp" });
    }
    console.error("Error POST /api/admin/clients:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateClient(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  const { first_name, last_name, whatsapp, email, notes } = req.body;
  if (!first_name?.trim() || !last_name?.trim() || !whatsapp?.trim()) {
    return res.status(400).json({ error: "Nombre, apellido y WhatsApp son obligatorios" });
  }

  try {
    const result = await clientsRepo.updateClient(req.app.locals.db, {
      id,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      whatsapp: whatsapp.trim(),
      email: email?.trim() || null,
      notes: notes?.trim() || null,
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Ya existe un cliente con ese WhatsApp" });
    }
    console.error("Error PATCH /api/admin/clients/:id:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteClient(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  try {
    const result = await clientsRepo.softDeleteClient(req.app.locals.db, id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error DELETE /api/admin/clients/:id:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getClients, getClientAppointments, createClient, updateClient, deleteClient };
