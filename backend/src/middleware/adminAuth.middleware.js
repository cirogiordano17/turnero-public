const { verifyAdminToken } = require("../utils/jwt");

function requireAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        error: "Token requerido",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        ok: false,
        error: "Authorization inválido",
      });
    }

    const payload = verifyAdminToken(token);

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({
        ok: false,
        error: "No autorizado",
      });
    }

    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      error: "Token inválido o vencido",
    });
  }
}

module.exports = {
  requireAdminAuth,
};