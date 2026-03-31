const TZ = "America/Argentina/Cordoba";
const SLOT_MIN = 15;

function minutesToMs(min) {
  return min * 60 * 1000;
}

function toUtcMs(dateYmd, hhmm) {
  const iso = `${dateYmd}T${hhmm}:00-03:00`;
  return new Date(iso).getTime();
}

function formatHHmm(dateObj) {
  const fmt = new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return fmt.format(dateObj);
}

function generateSlots(dateYmd, startHHmm, endHHmm, stepMin = SLOT_MIN) {
  const slots = [];
  const startMs = toUtcMs(dateYmd, startHHmm);
  const endMs = toUtcMs(dateYmd, endHHmm);

  for (let t = startMs; t <= endMs; t += minutesToMs(stepMin)) {
    slots.push(formatHHmm(new Date(t)));
  }
  return slots;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

module.exports = { TZ, SLOT_MIN, minutesToMs, toUtcMs, formatHHmm, generateSlots, overlaps };