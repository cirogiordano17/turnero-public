const bcrypt = require("bcryptjs");
const adminUsersRepo = require("../repositories/adminUsers.repo");

async function login(db, { username, password }) {
  const user = await adminUsersRepo.findByUsername(db, username);
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) return null;

  return { username: user.username, userRole: user.role };
}

module.exports = { login };
