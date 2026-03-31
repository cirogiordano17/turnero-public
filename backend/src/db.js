const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  return pool.query(text, params);
}

async function testConnection() {
  const res = await pool.query("SELECT NOW() as now");
  return res.rows[0].now;
}

module.exports = { pool, query, testConnection };