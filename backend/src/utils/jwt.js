const jwt = require("jsonwebtoken");

function signAdminToken(username, userRole) {
  return jwt.sign(
    {
      sub: "admin",
      username,
      role: "admin",
      userRole: userRole || "super_admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );
}

function verifyAdminToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  signAdminToken,
  verifyAdminToken,
};