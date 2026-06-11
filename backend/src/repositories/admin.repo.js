async function getAdminAppointmentsForRange(db, startIso, endIso) {
  return db.query(
    `
    SELECT
  a.id,
  a.status,
  a.comment,
  a.start_at,
  a.end_at,
  a.category,
  a.price_total,
  a.duration_total,
  c.first_name,
  c.last_name,
  c.whatsapp,
  c.email,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'duration_min', s.duration_min,
        'category', s.category
      )
      ORDER BY s.id
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
  ) AS services
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
    LEFT JOIN services s ON s.id = aps.service_id
    WHERE a.start_at < $2::timestamptz
      AND a.end_at   > $1::timestamptz
    GROUP BY a.id, c.id
    ORDER BY a.start_at ASC
    `,
    [startIso, endIso]
  );
}

async function cancelAppointment(db, id) {
  return db.query(
    `UPDATE appointments
     SET status = 'CANCELADO'
     WHERE id = $1
     RETURNING id, status`,
    [id]
  );
}

async function upsertClosedDay(db, dateYmd, reason) {
  return db.query(
    `INSERT INTO closed_days (closed_date, reason)
     VALUES ($1::date, $2)
     ON CONFLICT (closed_date) DO UPDATE SET reason = EXCLUDED.reason`,
    [dateYmd, reason || null]
  );
}

async function deleteClosedDay(db, dateYmd) {
  return db.query(`DELETE FROM closed_days WHERE closed_date = $1::date`, [dateYmd]);
}

async function nextDateText(db, dateYmd) {
  return db.query(`SELECT ($1::date + 1)::text AS next`, [dateYmd]);
}

async function updateAppointmentStatus(db, id, status) {
  return db.query(
    `
    UPDATE appointments
    SET status = $2
    WHERE id = $1
    RETURNING id, status, category, start_at, end_at
    `,
    [id, status]
  );
}

async function getUpcomingAppointments(db) {
  return db.query(
    `
    SELECT
      a.id,
      a.status,
      a.comment,
      a.start_at,
      a.end_at,
      a.category,
      a.price_total,
      a.duration_total,
      c.first_name,
      c.last_name,
      c.whatsapp,
      c.email,
      COALESCE(
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'duration_min', s.duration_min,
            'category', s.category
          )
          ORDER BY s.id
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::json
      ) AS services
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
    LEFT JOIN services s ON s.id = aps.service_id
    WHERE a.start_at > NOW() - INTERVAL '15 minutes'
      AND a.start_at < NOW() + INTERVAL '15 days'
    GROUP BY a.id, c.id
    ORDER BY a.start_at ASC
    `
  );
}

async function getHistoryAppointments(db) {
  return db.query(
    `
    SELECT
      a.id,
      a.status,
      a.comment,
      a.start_at,
      a.end_at,
      a.category,
      a.price_total,
      a.duration_total,
      c.first_name,
      c.last_name,
      c.whatsapp,
      c.email,
      COALESCE(
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'duration_min', s.duration_min,
            'category', s.category
          )
          ORDER BY s.id
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::json
      ) AS services
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
    LEFT JOIN services s ON s.id = aps.service_id
    WHERE a.start_at <= NOW() - INTERVAL '15 minutes'
      AND a.start_at >= NOW() - INTERVAL '60 days'
    GROUP BY a.id, c.id
    ORDER BY a.start_at DESC
    `
  );
}

async function getAppointmentById(db, id) {
  return db.query(
    `SELECT id, category, status FROM appointments WHERE id = $1 LIMIT 1`,
    [id]
  );
}

async function getClosedDaysInRange(db, from, to) {
  return db.query(
    `SELECT closed_date, reason
     FROM closed_days
     WHERE closed_date BETWEEN $1::date AND $2::date
     ORDER BY closed_date ASC`,
    [from, to]
  );
}

async function getAllClosedDays(db) {
  return db.query(
    `SELECT closed_date, reason FROM closed_days ORDER BY closed_date ASC`
  );
}

async function getWorkingHours(db) {
  return db.query(
    `SELECT day_of_week, start_morning, end_morning, start_afternoon, end_afternoon
     FROM working_hours
     ORDER BY day_of_week`
  );
}

async function getAppointmentForReschedule(db, id) {
  return db.query(
    `SELECT id, category, status, duration_total FROM appointments WHERE id = $1 LIMIT 1`,
    [id]
  );
}

async function checkRescheduleOverlap(db, excludeId, newStartIso, newEndIso) {
  return db.query(
    `SELECT 1 FROM appointments
     WHERE id != $1
       AND status IN ('CONFIRMADO', 'PENDIENTE_PAGO')
       AND start_at < $3::timestamptz
       AND end_at   > $2::timestamptz
     LIMIT 1`,
    [excludeId, newStartIso, newEndIso]
  );
}

async function rescheduleAppointmentTimes(db, id, newStartIso, newEndIso) {
  return db.query(
    `UPDATE appointments
     SET start_at = $2::timestamptz, end_at = $3::timestamptz
     WHERE id = $1
     RETURNING id, status, start_at, end_at, category`,
    [id, newStartIso, newEndIso]
  );
}

async function markAttendance(db, id, status) {
  return db.query(
    `UPDATE appointments
     SET status = $2
     WHERE id = $1
       AND start_at <= NOW() - INTERVAL '15 minutes'
     RETURNING id, status`,
    [id, status]
  );
}

module.exports = {
  getAdminAppointmentsForRange,
  getUpcomingAppointments,
  getHistoryAppointments,
  cancelAppointment,
  upsertClosedDay,
  deleteClosedDay,
  nextDateText,
  updateAppointmentStatus,
  getAppointmentById,
  getClosedDaysInRange,
  getAllClosedDays,
  getWorkingHours,
  getAppointmentForReschedule,
  checkRescheduleOverlap,
  rescheduleAppointmentTimes,
  markAttendance,
};