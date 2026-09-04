const { signAdminToken } = require("../utils/jwt");
const authService = require("../services/auth.service");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Faltan usuario o contraseña" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ ok: false, error: "Configuración incompleta de autenticación" });
    }

    const matched = await authService.login(req.app.locals.db, { username, password });

    if (!matched) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const token = signAdminToken(matched.username, matched.userRole);

    return res.json({
      ok: true,
      token,
      user: { username: matched.username, role: "admin", userRole: matched.userRole },
    });
  } catch (error) {
    console.error("auth.login error:", error);
    return res.status(500).json({ ok: false, error: "Error interno al iniciar sesión" });
  }
}

function me(req, res) {
  return res.json({
    ok: true,
    user: {
      username: req.admin.username,
      role: req.admin.role,
      userRole: req.admin.userRole || "super_admin",
    },
  });
}

module.exports = { login, me };
