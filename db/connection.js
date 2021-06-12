const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'asdfghjkl2!',
    database: 'cms',
  },
    console.log('connected to database','\n Welcome! \n')
  );

module.exports = db;