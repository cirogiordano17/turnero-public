require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      run_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedMigrations(client) {
  const res = await client.query(`
    SELECT id
    FROM schema_migrations
    ORDER BY id
  `);

  return new Set(res.rows.map((row) => row.id));
}

function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, "../db/migrations");

  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function run() {
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);

    const applied = await getAppliedMigrations(client);
    const files = getMigrationFiles();

    if (files.length === 0) {
      console.log("ℹ️ No hay migraciones para ejecutar.");
      return;
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`⏭️ Migración ya aplicada: ${file}`);
        continue;
      }

      const fullPath = path.join(__dirname, "../db/migrations", file);
      const sql = fs.readFileSync(fullPath, "utf8");

      console.log(`🚀 Ejecutando migración: ${file}`);

      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (id) VALUES ($1)`,
        [file]
      );
      await client.query("COMMIT");

      console.log(`✅ Migración aplicada: ${file}`);
    }

    console.log("✅ Migraciones al día.");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("❌ Error ejecutando migraciones:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();