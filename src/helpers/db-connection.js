// import postgres
const { Client } = require("pg");
require("dotenv").config();

// connect database postgresql and using dotenv
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = process.env;

const db = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

db.connect((error) => {
  if (error) {
    console.log("db connection error", error);
  }
});

module.exports = db;
