async function findByUsername(db, username) {
  const result = await db.query(
    `SELECT admin_users.id, admin_users.username, admin_users.password_hash, roles.name AS role
     FROM admin_users
     JOIN roles ON roles.id = admin_users.role_id
     WHERE admin_users.username = $1`,
    [username]
  );
  return result.rows[0] || null;
}

module.exports = { findByUsername };
