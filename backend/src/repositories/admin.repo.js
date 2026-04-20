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
    WHERE a.end_at > NOW()
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
    WHERE a.end_at <= NOW()
      AND a.end_at >= NOW() - INTERVAL '60 days'
    GROUP BY a.id, c.id
    ORDER BY a.start_at DESC
    `
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
};