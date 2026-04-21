const jwt = require("jsonwebtoken");

function openAdminEvents(req, res) {
  const token = String(req.query.token || "");

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  if (res.flushHeaders) {
    res.flushHeaders();
  }

  const client = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    res,
  };

  req.app.locals.adminEventClients.add(client);

  res.write(
    `event: connected\ndata: ${JSON.stringify({
      ok: true,
      clientId: client.id,
      ts: Date.now(),
    })}\n\n`
  );

  const heartbeat = setInterval(() => {
    res.write(`: ping ${Date.now()}\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    req.app.locals.adminEventClients.delete(client);
  });
}

function emitAdminEvent(app, eventName, payload) {
  const clients = app.locals.adminEventClients;

  if (!clients || clients.size === 0) return;

  const message = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;

  for (const client of clients) {
    try {
      client.res.write(message);
    } catch (err) {
      clients.delete(client);
    }
  }
}

module.exports = {
  openAdminEvents,
  emitAdminEvent,
};