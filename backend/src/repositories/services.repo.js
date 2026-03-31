async function getActiveServices(db, category) {
  if (category) {
    return db.query(
      `SELECT id, name, duration_min, category, active, price
       FROM services
       WHERE active = true AND category = $1
       ORDER BY id`,
      [category]
    );
  }

  return db.query(
    `SELECT id, name, duration_min, category, active, price
     FROM services
     WHERE active = true
     ORDER BY id`
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

module.exports = { getActiveServices, sumActiveDurationsByIds, sumActivePricesByIds };