async function findClientIdByWhatsapp(db, whatsapp) {
  return db.query(
    `SELECT id FROM clients WHERE whatsapp = $1 AND deleted_at IS NULL`,
    [whatsapp]
  );
}

async function updateClient(db, { id, first_name, last_name, email, whatsapp, notes }) {
  return db.query(
    `UPDATE clients
     SET first_name = $1, last_name = $2, email = $3, whatsapp = $4, notes = $5
     WHERE id = $6 AND deleted_at IS NULL
     RETURNING id, first_name, last_name, whatsapp, email, notes, created_at`,
    [first_name, last_name, email || null, whatsapp, notes || null, id]
  );
}

async function createClient(db, { first_name, last_name, whatsapp, email, notes }) {
  return db.query(
    `INSERT INTO clients (first_name, last_name, whatsapp, email, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, whatsapp, email, notes, created_at`,
    [first_name, last_name, whatsapp, email || null, notes || null]
  );
}

async function softDeleteClient(db, id) {
  return db.query(
    `UPDATE clients
     SET deleted_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id`,
    [id]
  );
}

async function getAllClients(db) {
  return db.query(
    `SELECT id, first_name, last_name, whatsapp, email, notes, created_at
     FROM clients
     WHERE deleted_at IS NULL
     ORDER BY last_name ASC, first_name ASC`
  );
}

async function getAppointmentsByClientId(db, clientId) {
  return db.query(
    `SELECT
       a.id,
       a.start_at,
       a.end_at,
       a.status,
       a.comment,
       a.category,
       a.price_total,
       a.duration_total,
       a.created_at,
       COALESCE(
         json_agg(
           json_build_object('id', aps.service_id, 'name', aps.service_name, 'price', aps.price, 'duration_min', aps.duration_min)
           ORDER BY aps.service_id
         ) FILTER (WHERE aps.service_id IS NOT NULL),
         '[]'
       ) AS services
     FROM appointments a
     LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
     WHERE a.client_id = $1
     GROUP BY a.id
     ORDER BY a.start_at DESC`,
    [clientId]
  );
}

module.exports = {
  findClientIdByWhatsapp,
  updateClient,
  createClient,
  softDeleteClient,
  getAllClients,
  getAppointmentsByClientId,
};
