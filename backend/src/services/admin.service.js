const adminRepo = require("../repositories/admin.repo");
const { TZ, toUtcMs, minutesToMs } = require("../utils/time");

const timeFmt = new Intl.DateTimeFormat("es-AR", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

async function getAppointmentsForDay(db, dateYmd) {
  const dayStartIso = `${dateYmd}T00:00:00-03:00`;
  const nextRes = await adminRepo.nextDateText(db, dateYmd);
  const nextDate = nextRes.rows[0].next;
  const dayEndIso = `${nextDate}T00:00:00-03:00`;

  const result = await adminRepo.getAdminAppointmentsForRange(db, dayStartIso, dayEndIso);

  return result.rows.map((r) => ({
    ...r,
    start_hhmm: timeFmt.format(new Date(r.start_at)),
    end_hhmm: timeFmt.format(new Date(r.end_at)),
  }));
}

function cancelAppointment(db, id) {
  return adminRepo.cancelAppointment(db, id);
}

async function blockDay(db, dateYmd, reason) {
  await adminRepo.upsertClosedDay(db, dateYmd, reason);
  return { ok: true };
}

async function unblockDay(db, dateYmd) {
  await adminRepo.deleteClosedDay(db, dateYmd);
  return { ok: true };

}

async function confirmAkashicosPayment(db, appointmentId) {
  const apptRes = await adminRepo.getAppointmentById(db, appointmentId);

  if (apptRes.rows.length === 0) {
    const err = new Error("Turno no encontrado");
    err.status = 404;
    throw err;
  }

  const appt = apptRes.rows[0];

  if (appt.category !== "akashicos") {
    const err = new Error("Solo se puede confirmar pago de turnos de Akáshicos");
    err.status = 400;
    throw err;
  }

  if (appt.status !== "PENDIENTE_PAGO") {
    const err = new Error("El turno no está pendiente de pago");
    err.status = 400;
    throw err;
  }

  const updated = await adminRepo.updateAppointmentStatus(db, appointmentId, "CONFIRMADO");
  return updated.rows[0];
}

async function getUpcomingAppointments(db) {
  const result = await adminRepo.getUpcomingAppointments(db);
  return result.rows.map((r) => ({
    ...r,
    start_hhmm: timeFmt.format(new Date(r.start_at)),
    end_hhmm: timeFmt.format(new Date(r.end_at)),
  }));
}

async function getHistoryAppointments(db) {
  const result = await adminRepo.getHistoryAppointments(db);
  return result.rows.map((r) => ({
    ...r,
    start_hhmm: timeFmt.format(new Date(r.start_at)),
    end_hhmm: timeFmt.format(new Date(r.end_at)),
  }));
}

async function rescheduleAppointment(db, appointmentId, dateYmd, startHhmm) {
  const apptRes = await adminRepo.getAppointmentForReschedule(db, appointmentId);

  if (apptRes.rows.length === 0) {
    const err = new Error("Turno no encontrado");
    err.status = 404;
    throw err;
  }

  const appt = apptRes.rows[0];

  if (appt.status === "CANCELADO") {
    const err = new Error("No se puede reprogramar un turno cancelado");
    err.status = 400;
    throw err;
  }

  const newStartIso = `${dateYmd}T${startHhmm}:00-03:00`;
  const endMs = toUtcMs(dateYmd, startHhmm) + minutesToMs(appt.duration_total);
  const newEndIso = new Date(endMs).toISOString();

  const overlapRes = await adminRepo.checkRescheduleOverlap(db, appointmentId, newStartIso, newEndIso);
  if (overlapRes.rows.length > 0) {
    const err = new Error("El horario seleccionado ya está ocupado");
    err.status = 409;
    throw err;
  }

  const updated = await adminRepo.rescheduleAppointmentTimes(db, appointmentId, newStartIso, newEndIso);
  return updated.rows[0];
}

async function markAttendance(db, appointmentId, attended) {
  const status = attended ? "ASISTIDO" : "NO_SHOW";
  const result = await adminRepo.markAttendance(db, appointmentId, status);

  if (result.rows.length === 0) {
    const err = new Error("Turno no encontrado o aún no comenzó");
    err.status = 404;
    throw err;
  }

  return result.rows[0];
}

async function getClosedDays(db, from, to) {
  const result = await adminRepo.getClosedDaysInRange(db, from, to);
  return result.rows;
}

async function getAllClosedDays(db) {
  const result = await adminRepo.getAllClosedDays(db);
  return result.rows;
}

async function getWorkingHours(db) {
  const result = await adminRepo.getWorkingHours(db);
  return result.rows;
}

module.exports = {
  getAppointmentsForDay,
  getUpcomingAppointments,
  getHistoryAppointments,
  cancelAppointment,
  blockDay,
  unblockDay,
  confirmAkashicosPayment,
  rescheduleAppointment,
  getClosedDays,
  getAllClosedDays,
  getWorkingHours,
  markAttendance,
};