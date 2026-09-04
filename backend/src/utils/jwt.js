const jwt = require("jsonwebtoken");

function signAdminToken(userRole) {
  return jwt.sign(
    {
      sub: "admin",
      username: process.env.ADMIN_USERNAME,
      role: "admin",
      userRole: userRole || process.env.ADMIN_ROLE || "super_admin",
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