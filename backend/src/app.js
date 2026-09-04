const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const servicesRoutes = require("./routes/services.routes");
const appointmentsRoutes = require("./routes/appointments.routes");
const availabilityRoutes = require("./routes/availability.routes");
const closedDaysRoutes = require("./routes/closedDays.routes");
const adminRoutes = require("./routes/admin.routes");
const settingsCtrl = require("./controllers/settings.controller");

const { pool, query } = require("./db");

const app = express();

/**
 * CORS
 * En desarrollo deja entrar localhost.
 * En producción usá FRONTEND_ORIGIN en .env
 */
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_ORIGIN]
    : null;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins === null) {
        // desarrollo: permitir cualquier localhost
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
      } else if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Probá de nuevo más tarde." },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes al panel admin." },
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de reserva. Probá más tarde." },
});

app.use(generalLimiter);

app.locals.pool = pool;
app.locals.db = { query };
app.locals.adminEventClients = new Set();

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/health/db", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get("/api/settings/transfer", settingsCtrl.getTransferSettings);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", bookingLimiter, appointmentsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/closed-days", closedDaysRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);

// Error handler global: nunca exponer detalles internos en producción
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== "production";
  const status = err.status || 500;
  res.status(status).json({
    error: status < 500 || isDev ? err.message : "Error interno del servidor",
  });
});

module.exports = app;