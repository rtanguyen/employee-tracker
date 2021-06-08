const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'asdfghjkl2!',
    database: 'cms',
  },
    console.log('connected to cms database')
  );

module.exports = db;