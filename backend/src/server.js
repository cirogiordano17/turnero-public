require("dotenv").config();

console.log("=== server.js cargado ===");
console.log("PORT =", process.env.PORT);
console.log("DATABASE_URL exists =", !!process.env.DATABASE_URL);
console.log("NODE_ENV =", process.env.NODE_ENV);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const app = require("./app");
const { testConnection } = require("./db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    console.log(">>> Entrando a start()");
    const now = await testConnection();
    console.log("✅ DB conectada. NOW =", now);

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server escuchando en 0.0.0.0:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("ERROR EN app.listen:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("❌ Error conectando a la DB:", err);
    process.exit(1);
  }
}

start();