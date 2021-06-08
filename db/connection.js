const mysql = require('mysql2');

require('dotenv').config();

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: cms
  },
    console.log('connected to cms database')
  );

module.exports = db;