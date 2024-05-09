// Get the client
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Youtube",
  dateStrings: true,
});

// A simple SELECT query
connection.query("SELECT * FROM `users`", function (err, results) {
  let { id, email, name, created_at } = results[0];
  console.log(id, email, name, created_at);
});
