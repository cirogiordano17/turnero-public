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

module.exports = { findClientIdByWhatsapp, updateClient, createClient };