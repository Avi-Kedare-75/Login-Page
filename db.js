const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",                // your MySQL username
  password: "Avikedareusv2",// your MySQL root password
  database: "authdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected");
});

module.exports = db;
