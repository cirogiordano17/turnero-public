const servicesRepo = require("../repositories/services.repo");
const availabilityRepo = require("../repositories/availability.repo");
const { generateSlots, toUtcMs, minutesToMs, overlaps } = require("../utils/time");

async function getAvailability(db, dateYmd, serviceIds) {
  // closed day
  const closedRes = await availabilityRepo.isClosedDay(db, dateYmd);
  if (closedRes.rows.length > 0) {
    return {
      closed: true,
      slots: []
    };
  }

  // dow + working hours
  const dowRes = await availabilityRepo.getIsoDow(db, dateYmd);
  const dow = dowRes.rows[0].dow;

  const whRes = await availabilityRepo.getWorkingHoursByDow(db, dow);
  if (whRes.rows.length === 0) return [];
  const wh = whRes.rows[0];

  // total duration
  const durRes = await servicesRepo.sumActiveDurationsByIds(db, serviceIds);
  const totalMin = Number(durRes.rows[0].total_min);
  if (totalMin <= 0) {
    const err = new Error("Servicios inválidos o inactivos");
    err.status = 400;
    throw err;
  }

  // busy appointments in day range (local AR)
  const dayStartIso = `${dateYmd}T00:00:00-03:00`;
  const nextDayText = await db.query(`SELECT ($1::date + 1)::text AS next`, [dateYmd]);
  const nextDate = nextDayText.rows[0].next;
  const dayEndIso = `${nextDate}T00:00:00-03:00`;

  const apptsRes = await availabilityRepo.getBusyAppointmentsForDay(db, dayStartIso, dayEndIso);
  const busy = apptsRes.rows.map((r) => ({
    startMs: new Date(r.start_at).getTime(),
    endMs: new Date(r.end_at).getTime(),
  }));

  const blockedRes = await availabilityRepo.getBlockedSlotsForDay(db, dayStartIso, dayEndIso);

  const blockedBusy = blockedRes.rows.map((r) => ({
    startMs: new Date(r.start_at).getTime(),
    endMs: new Date(r.end_at).getTime(),
  }));

  busy.push(...blockedBusy);

  // blocks
  const blocks = [];
  if (wh.start_morning && wh.end_morning) {
    blocks.push({ start: wh.start_morning.slice(0, 5), end: wh.end_morning.slice(0, 5) });
  }
  if (wh.start_afternoon && wh.end_afternoon) {
    blocks.push({ start: wh.start_afternoon.slice(0, 5), end: wh.end_afternoon.slice(0, 5) });
  }

  const available = [];

  function addMinutes(time, mins) {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m + mins, 0, 0);
    return d.toTimeString().slice(0, 5);
  }

  for (const b of blocks) {
    const extendedEnd = addMinutes(b.end, 30);
    const slots = generateSlots(dateYmd, b.start, extendedEnd);
    const blockEndMs = toUtcMs(dateYmd, b.end);

    for (const hhmm of slots) {
      const startMs = toUtcMs(dateYmd, hhmm);
      const endMs = startMs + minutesToMs(totalMin);

      if (endMs > blockEndMs) continue;
      const isBusy = busy.some((x) => overlaps(startMs, endMs, x.startMs, x.endMs));
      if (isBusy) continue;

      available.push(hhmm);
    }
  }

  // unique + sorted
  return {
  closed: false,
  slots: Array.from(new Set(available)).sort()
};
}

module.exports = { getAvailability };