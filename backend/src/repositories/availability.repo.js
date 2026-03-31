async function isClosedDay(db, dateYmd) {
  return db.query(
    `SELECT 1 FROM closed_days WHERE closed_date = $1::date LIMIT 1`,
    [dateYmd]
  );
}

async function getIsoDow(db, dateYmd) {
  return db.query(`SELECT EXTRACT(ISODOW FROM $1::date)::int AS dow`, [dateYmd]);
}

async function getWorkingHoursByDow(db, dow) {
  return db.query(
    `SELECT start_morning, end_morning, start_afternoon, end_afternoon
     FROM working_hours
     WHERE day_of_week = $1`,
    [dow]
  );
}

async function getBusyAppointmentsForDay(db, dayStartIso, dayEndIso) {
  return db.query(
    `SELECT start_at, end_at
     FROM appointments
     WHERE status IN ('CONFIRMADO','PENDIENTE_PAGO')
       AND start_at < $2::timestamptz
       AND end_at   > $1::timestamptz`,
    [dayStartIso, dayEndIso]
  );
}

module.exports = { isClosedDay, getIsoDow, getWorkingHoursByDow, getBusyAppointmentsForDay };