const mysql = require("mysql2/promise")

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    )

    await conn.query(
      `USE \`${process.env.DB_NAME}\``
    )

    await conn.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id          INT           NOT NULL AUTO_INCREMENT,
        name        VARCHAR(255)  NOT NULL,
        address     VARCHAR(500)  NOT NULL,
        latitude    FLOAT         NOT NULL,
        longitude   FLOAT         NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `)
 
    console.log("Database connected");
  } finally {
    conn.release();
  }
}
 
module.exports = { pool, initializeDatabase };