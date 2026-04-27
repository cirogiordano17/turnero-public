async function insertBlockedSlot(db, { startIso, endIso, reason }) {
  return db.query(
    `
    INSERT INTO blocked_slots (start_at, end_at, reason)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [startIso, endIso, reason]
  );
}

async function listBlockedSlotsByDate(db, date) {
  return db.query(
    `
    SELECT *
    FROM blocked_slots
    WHERE DATE(start_at) = $1
    `,
    [date]
  );
}

async function deleteBlockedSlot(db, id) {
  return db.query(
    `DELETE FROM blocked_slots WHERE id = $1 RETURNING *`,
    [id]
  );
}

async function hasBlockedOverlap(db, startIso, endIso) {
  return db.query(
    `
    SELECT 1
    FROM blocked_slots
    WHERE start_at < $2
      AND end_at > $1
    LIMIT 1
    `,
    [startIso, endIso]
  );
}

module.exports = {
  insertBlockedSlot,
  listBlockedSlotsByDate,
  deleteBlockedSlot,
  hasBlockedOverlap,
};