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
  if (!serviceIds.length) return;

  const values = serviceIds.map((_, i) => `($1, $${i + 2})`).join(", ");
  return db.query(
    `INSERT INTO appointment_services (appointment_id, service_id) VALUES ${values}`,
    [appointmentId, ...serviceIds]
  );
}

module.exports = {
  hasOverlap,
  insertAppointment,
  insertAppointmentServices,
};