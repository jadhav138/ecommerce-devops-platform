const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "ecommerce-postgres",
  database: "ecommerce",
  password: "postgres",
  port: 5432
});

module.exports = pool;