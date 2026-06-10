async function findClientIdByWhatsapp(db, whatsapp) {
  return db.query(`SELECT id FROM clients WHERE whatsapp = $1`, [whatsapp]);
}

async function updateClient(db, { id, first_name, last_name, email }) {
  return db.query(
    `UPDATE clients
     SET first_name = $1, last_name = $2, email = $3
     WHERE id = $4`,
    [first_name, last_name, email || null, id]
  );
}

async function createClient(db, { first_name, last_name, whatsapp, email }) {
  return db.query(
    `INSERT INTO clients (first_name, last_name, whatsapp, email)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [first_name, last_name, whatsapp, email || null]
  );
}

async function getAllClients(db) {
  return db.query(
    `SELECT id, first_name, last_name, whatsapp, email, created_at
     FROM clients
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
           json_build_object('id', s.id, 'name', s.name, 'price', s.price, 'duration_min', s.duration_min)
           ORDER BY s.name
         ) FILTER (WHERE s.id IS NOT NULL),
         '[]'
       ) AS services
     FROM appointments a
     LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
     LEFT JOIN services s ON s.id = aps.service_id
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
  getAllClients,
  getAppointmentsByClientId,
};