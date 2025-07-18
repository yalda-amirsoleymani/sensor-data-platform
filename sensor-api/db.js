const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT ? Number(process.env.RDS_PORT) : 5432,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./eu-west-1-bundle.pem').toString()
  }
});//const pool = new Pool({
//  host: process.env.POSTGRES_HOST || 'localhost',
//  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
//  user: process.env.POSTGRES_USER,
//  password: process.env.POSTGRES_PASSWORD,
//  database: process.env.POSTGRES_DB,
//});

module.exports = pool;

