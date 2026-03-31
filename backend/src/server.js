require("dotenv").config();

const app = require("./app");
const { testConnection } = require("./db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const now = await testConnection();
    console.log("✅ DB conectada. NOW =", now);

    app.listen(PORT, () => {
      console.log(`✅ Server escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a la DB:", err.message);
    process.exit(1);
  }
}

start();