const bcrypt = require("bcryptjs");
const { signAdminToken } = require("../utils/jwt");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: "Faltan usuario o contraseña",
      });
    }

    const expectedUsername = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!expectedUsername || !passwordHash || !jwtSecret) {
      return res.status(500).json({
        ok: false,
        error: "Configuración incompleta de autenticación",
      });
    }

    if (username !== expectedUsername) {
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas",
      });
    }

    const validPassword = await bcrypt.compare(password, passwordHash);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas",
      });
    }

    const token = signAdminToken();

    return res.json({
      ok: true,
      token,
      user: {
        username: expectedUsername,
      },
    });
  } catch (error) {
    console.error("auth.login error:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno al iniciar sesión",
    });
  }
}

function me(req, res) {
  return res.json({
    ok: true,
    user: {
      username: req.admin.username,
      role: req.admin.role,
    },
  });
}

module.exports = {
  login,
  me,
};