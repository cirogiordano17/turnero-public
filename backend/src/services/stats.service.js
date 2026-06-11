const statsRepo = require("../repositories/stats.repo");
const { TZ } = require("../utils/time");

const timeFmt = new Intl.DateTimeFormat("es-AR", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  timeZone: TZ,
  day: "2-digit",
  month: "2-digit",
});

async function getMonthlyStats(db, monthYm) {
  const [year, month] = monthYm.split("-").map(Number);

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;

  const pad = (n) => String(n).padStart(2, "0");
  const monthStart = `${year}-${pad(month)}-01T00:00:00-03:00`;
  const monthEnd   = `${nextYear}-${pad(nextMonth)}-01T00:00:00-03:00`;

  const raw = await statsRepo.getMonthlyStats(db, monthStart, monthEnd);

  const { summary } = raw;
  const totalHours  = +(summary.total_minutes / 60).toFixed(1);
  const earningsPerHour = totalHours > 0
    ? Math.round(summary.total_earned / totalHours)
    : 0;

  return {
    summary: {
      ...summary,
      total_hours: totalHours,
      earnings_per_hour: earningsPerHour,
    },
    daily: raw.daily,
    services: raw.services,
    appointments: raw.appointments.map((a) => ({
      ...a,
      start_hhmm: timeFmt.format(new Date(a.start_at)),
      start_date:  dateFmt.format(new Date(a.start_at)),
    })),
  };
}

module.exports = { getMonthlyStats };
