async function findByUsername(db, username) {
  const result = await db.query(
    `SELECT id, username, password_hash, role FROM admin_users WHERE username = $1`,
    [username]
  );
  return result.rows[0] || null;
}

module.exports = { findByUsername };
