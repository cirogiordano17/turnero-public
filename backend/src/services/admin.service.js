const adminRepo = require("../repositories/admin.repo");
const { TZ } = require("../utils/time");

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
  getClosedDays,
  getAllClosedDays,
  getWorkingHours,
};