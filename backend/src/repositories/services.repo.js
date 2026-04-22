async function getActiveServices(db, category) {
  if (category) {
    return db.query(
      `SELECT id, name, description, duration_min, category, active, price
       FROM services
       WHERE active = true AND category = $1
       ORDER BY id`,
      [category]
    );
  }

  return db.query(
    `SELECT id, name, description, duration_min, category, active, price
     FROM services
     WHERE active = true
     ORDER BY id`
  );
}

async function getAllServices(db) {
  return db.query(
    `SELECT id, name, description, duration_min, category, active, price
     FROM services
     ORDER BY category, id`
  );
}

async function getServiceById(db, id) {
  return db.query(
    `SELECT id, name, description, duration_min, category, active, price
     FROM services
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
}

async function createService(db, { name, description, duration_min, price, category, active }) {
  return db.query(
    `INSERT INTO services (
      name,
      description,
      duration_min,
      price,
      category,
      active
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, description, duration_min, price, category, active`,
    [
      name,
      description || null,
      duration_min,
      price,
      category,
      active,
    ]
  );
}

async function updateService(db, id, { name, description, duration_min, price, category, active }) {
  return db.query(
    `UPDATE services
     SET
       name = $2,
       description = $3,
       duration_min = $4,
       price = $5,
       category = $6,
       active = $7
     WHERE id = $1
     RETURNING id, name, description, duration_min, price, category, active`,
    [
      id,
      name,
      description || null,
      duration_min,
      price,
      category,
      active,
    ]
  );
}


async function sumActiveDurationsByIds(db, serviceIds) {
  return db.query(
    `SELECT COALESCE(SUM(duration_min), 0) AS total_min
     FROM services
     WHERE active = true AND id = ANY($1::int[])`,
    [serviceIds]
  );
}

async function sumActivePricesByIds(db, serviceIds) {
  return db.query(
    `SELECT COALESCE(SUM(price), 0) AS total_price
     FROM services
     WHERE active = true AND id = ANY($1::int[])`,
    [serviceIds]
  );
}

module.exports = {
  getActiveServices,
  getAllServices,
  getServiceById,
  createService,
  deactivateService,
  sumActiveDurationsByIds,
  sumActivePricesByIds,
};