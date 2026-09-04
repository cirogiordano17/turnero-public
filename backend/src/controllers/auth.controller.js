const bcrypt = require("bcryptjs");
const { signAdminToken } = require("../utils/jwt");

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

    // Busca el usuario entre los configurados en env
    const users = [
      {
        username: process.env.ADMIN_USERNAME,
        passwordHash: process.env.ADMIN_PASSWORD_HASH,
        userRole: "super_admin",
      },
      {
        username: process.env.OPERADOR_USERNAME,
        passwordHash: process.env.OPERADOR_PASSWORD_HASH,
        userRole: "operador",
      },
    ].filter((u) => u.username && u.passwordHash);

    const matched = users.find((u) => u.username === username);

    if (!matched) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, matched.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const token = signAdminToken(matched.userRole);

    return res.json({ ok: true, token, user: { username: matched.username } });
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
