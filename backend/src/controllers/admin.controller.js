const adminService = require("../services/admin.service");
const blockedSlotsRepo = require("../repositories/blockedSlots.repo");
const { isYmd, toIntId } = require("../utils/validate");

async function getAdminAppointments(req, res) {
  const { date } = req.query;

  if (!date || !isYmd(date)) {
    return res.status(400).json({ error: "date inválida. Formato: YYYY-MM-DD" });
  }

  try {
    const rows = await adminService.getAppointmentsForDay(req.app.locals.db, date);
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/appointments:", err);
    res.status(500).json({ error: err.message });
  }
}

async function cancelAdminAppointment(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  try {
    const result = await adminService.cancelAppointment(req.app.locals.db, id);
    if (result.rows.length === 0) return res.status(404).json({ error: "No existe" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error DELETE /api/admin/appointments/:id:", err);
    res.status(500).json({ error: err.message });
  }
}

async function blockClosedDay(req, res) {
  const { date, reason } = req.body;
  if (!date || !isYmd(date)) {
    return res.status(400).json({ error: "date inválida. Formato: YYYY-MM-DD" });
  }

  try {
    const out = await adminService.blockDay(req.app.locals.db, date, reason);
    res.status(201).json(out);
  } catch (err) {
    console.error("Error POST /api/admin/closed-days:", err);
    res.status(500).json({ error: err.message });
  }
}

async function unblockClosedDay(req, res) {
  const date = String(req.params.date);
  if (!isYmd(date)) {
    return res.status(400).json({ error: "date inválida. Formato: YYYY-MM-DD" });
  }

  try {
    const out = await adminService.unblockDay(req.app.locals.db, date);
    res.json(out);
  } catch (err) {
    console.error("Error DELETE /api/admin/closed-days/:date:", err);
    res.status(500).json({ error: err.message });
  }
}

async function confirmAkashicosPayment(req, res) {
  const id = toIntId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "id inválido" });
  }

  try {
    const data = await adminService.confirmAkashicosPayment(req.app.locals.db, id);
    res.json(data);
  } catch (err) {
    console.error("Error PATCH /api/admin/appointments/:id/confirm-payment:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getUpcomingAppointments(req, res) {
  try {
    const rows = await adminService.getUpcomingAppointments(
      req.app.locals.db
    );
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/appointments/upcoming:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getHistoryAppointments(req, res) {
  try {
    const rows = await adminService.getHistoryAppointments(
      req.app.locals.db
    );
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/appointments/history:", err);
    res.status(500).json({ error: err.message });
  }
}

async function rescheduleAdminAppointment(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  const { date, start_hhmm } = req.body;

  if (!date || !isYmd(date)) {
    return res.status(400).json({ error: "date inválida. Formato: YYYY-MM-DD" });
  }

  if (!start_hhmm || !/^\d{2}:\d{2}$/.test(start_hhmm)) {
    return res.status(400).json({ error: "start_hhmm inválido. Formato: HH:MM" });
  }

  try {
    const data = await adminService.rescheduleAppointment(req.app.locals.db, id, date, start_hhmm);
    res.json(data);
  } catch (err) {
    console.error("Error PATCH /api/admin/appointments/:id/reschedule:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function createBlockedSlot(req, res) {
  const { start_at, end_at, reason } = req.body;

  if (!start_at || !end_at) {
    return res.status(400).json({ error: "start_at y end_at requeridos" });
  }

  try {
    const result = await blockedSlotsRepo.insertBlockedSlot(req.app.locals.db, {
      startIso: start_at,
      endIso: end_at,
      reason,
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating blocked slot:", err);
    res.status(500).json({ error: err.message });
  }
}
async function getBlockedSlots(req, res) {
  const { date } = req.query;

  try {
    const result = date
      ? await blockedSlotsRepo.listBlockedSlotsByDate(req.app.locals.db, date)
      : await blockedSlotsRepo.listBlockedSlots(req.app.locals.db);

    res.json(result.rows);
  } catch (err) {
    console.error("Error getting blocked slots:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function deleteBlockedSlot(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });

  try {
    const result = await blockedSlotsRepo.deleteBlockedSlot(req.app.locals.db, id);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting blocked slot:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getClosedDays(req, res) {
  const { from, to } = req.query;

  if (!from || !to || !isYmd(from) || !isYmd(to)) {
    return res.status(400).json({
      error: "from y to requeridos. Formato: YYYY-MM-DD",
    });
  }

  try {
    const rows = await adminService.getClosedDays(
      req.app.locals.db,
      from,
      to
    );

    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/closed-days:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getAllClosedDays(req, res) {
  try {
    const rows = await adminService.getAllClosedDays(req.app.locals.db);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getWorkingHours(req, res) {
  try {
    const rows = await adminService.getWorkingHours(req.app.locals.db);
    res.json(rows);
  } catch (err) {
    console.error("Error GET /api/admin/working-hours:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAdminAppointments,
  getUpcomingAppointments,
  getHistoryAppointments,
  cancelAdminAppointment,
  blockClosedDay,
  unblockClosedDay,
  confirmAkashicosPayment,
  rescheduleAdminAppointment,
  createBlockedSlot,
  getBlockedSlots,
  deleteBlockedSlot,
  getClosedDays,
  getAllClosedDays,
  getWorkingHours,
};