async function listLatestAppointments(db) {
  return db.query(`
    SELECT
      a.id,
      a.start_at,
      a.end_at,
      a.status,
      a.comment,
      a.category,
      a.price_total,
      a.duration_total,
      c.first_name,
      c.last_name,
      c.whatsapp,
      c.email
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    ORDER BY a.start_at DESC
    LIMIT 50
  `);
}

async function hasOverlap(db, startIso, endIso) {
  return db.query(
    `
    SELECT 1
    FROM appointments a
    WHERE a.status IN ('CONFIRMADO','PENDIENTE_PAGO')
      AND a.start_at < $2::timestamptz
      AND a.end_at   > $1::timestamptz
    LIMIT 1
    `,
    [startIso, endIso]
  );
}

async function insertAppointment(db, { clientId, startIso, totalMin, totalPrice, comment, category, status }) {
  return db.query(
    `INSERT INTO appointments (
      client_id,
      start_at,
      end_at,
      status,
      comment,
      category,
      price_total,
      duration_total
    )
    VALUES (
      $1,
      $2::timestamptz,
      ($2::timestamptz + ($3::text || ' minutes')::interval),
      $4,
      $5,
      $6,
      $7,
      $8
    )
    RETURNING
      id,
      client_id,
      start_at,
      end_at,
      status,
      comment,
      category,
      price_total,
      duration_total,
      created_at`,
    [
      clientId,
      startIso,
      totalMin,
      status || "CONFIRMADO",
      comment || null,
      category || "pelu",
      totalPrice || 0,
      totalMin || 0
    ]
  );
}

async function insertAppointmentServices(db, appointmentId, serviceIds) {
  for (const serviceId of serviceIds) {
    await db.query(
      `INSERT INTO appointment_services (appointment_id, service_id)
       VALUES ($1, $2)`,
      [appointmentId, serviceId]
    );
  }
}

module.exports = {
  listLatestAppointments,
  hasOverlap,
  insertAppointment,
  insertAppointmentServices,
};